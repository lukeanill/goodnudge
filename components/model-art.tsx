"use client";

import { useEffect, useRef, useState } from "react";
import type { Principle } from "@/lib/content";

// The 3D art on a card: a still image of the model, and, while the card is on screen, the live model, which tumbles as the page scrolls.
// Every card turns on all three axes at once (roll, pitch and yaw), each with its own mix of directions and speeds (see `traits`).
// The still is rendered with exactly the resting camera below, so the swap from still to live model cannot be seen. The live model is drawn
// on a canvas K times the size of the art box, centred on it, with a wider field of view: the model keeps the same size and perspective, but a
// turned model has room and is not cut off by the box. At most MAX_LIVE models are live at once, because each one is drawn on every scroll
// frame. The viewer (about 1 MB) and the models are only fetched once the page has settled.
const THETA = -20; // resting camera angle around the model, degrees (the stills use the same pose)
const PHI = 72; // resting camera angle from the top
const FOV = 30; // field of view of the still; the live canvas is K times larger, so its field of view is widened to match
const K = 2.4;
const EXPOSURE = 1.15;
const ROLL = 40; // largest turn on each axis, degrees, before the per-card amount (model.amp, which keeps the model inside its card)
const PITCH = 45;
const YAW = 75;
const MAX_LIVE_DESKTOP = 9;
const MAX_LIVE_PHONE = 4;
// The stills are cut from a 480 x 449 art frame; `model.shift` is in pixels of that frame, so it scales with the width of the art box.
const FRAME_W = 480;
const WIDE_FOV = (2 * Math.atan(K * Math.tan((FOV / 2) * (Math.PI / 180))) * 180) / Math.PI;

/** A card's own mix: which way it turns on each axis, and how much of the full range. Fixed by the principle, so it never changes. */
function traits(id: number) {
  const h = (i: number) => {
    const x = Math.sin((id + 1) * (i + 1) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    roll: (h(0) < 0.5 ? -1 : 1) * (0.7 + 0.3 * h(3)),
    pitch: (h(1) < 0.5 ? -1 : 1) * (0.7 + 0.3 * h(4)),
    yaw: (h(2) < 0.5 ? -1 : 1) * (0.7 + 0.3 * h(5)),
  };
}

type Viewer = HTMLElement & { cameraOrbit: string; jumpCameraToGoal: () => void };

let loader: Promise<void> | null = null;
function loadViewer() {
  // The package carries its own mesh decoder; it only needs to be switched on by giving it any script address.
  loader ??= import("@google/model-viewer").then(({ ModelViewerElement }) => {
    ModelViewerElement.meshoptDecoderLocation = "/models/decoder.js";
  });
  return loader;
}

// Wait until the page has loaded and the intro animation has had time to play before fetching anything 3D.
let settled: Promise<void> | null = null;
function pageSettled() {
  settled ??= new Promise<void>((resolve) => {
    const go = () => setTimeout(() => ("requestIdleCallback" in window ? requestIdleCallback(() => resolve()) : resolve()), 1200);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
  return settled;
}

// A small pool of live-model slots, shared by every card.
const holders = new Set<object>();
const waiting: { id: object; inView: () => boolean; grant: () => void }[] = [];
const maxLive = () => (window.innerWidth < 640 ? MAX_LIVE_PHONE : MAX_LIVE_DESKTOP);
function request(id: object, inView: () => boolean, grant: () => void) {
  if (holders.size < maxLive()) {
    holders.add(id);
    grant();
  } else if (!waiting.some((w) => w.id === id)) waiting.push({ id, inView, grant });
}
function release(id: object) {
  holders.delete(id);
  const i = waiting.findIndex((w) => w.id === id);
  if (i >= 0) waiting.splice(i, 1);
  const next = waiting.find((w) => w.inView());
  if (next && holders.size < maxLive()) {
    waiting.splice(waiting.indexOf(next), 1);
    holders.add(next.id);
    next.grant();
  }
}

// One scroll listener for all cards, run once per frame.
const updaters = new Set<() => void>();
let frame = 0;
function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    updaters.forEach((u) => u());
  });
}
function subscribe(u: () => void) {
  if (!updaters.size) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
  updaters.add(u);
  return () => {
    updaters.delete(u);
    if (!updaters.size) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  };
}

export function ModelArt({ model, id: cardId, className, live }: { model: NonNullable<Principle["model"]>; id: number; className: string; live?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [showLive, setShowLive] = useState(false); // the live model has drawn, so the still can step aside

  useEffect(() => {
    const el = box.current;
    if (!live || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = {};
    const t = traits(cardId);
    let viewer: Viewer | null = null;
    let ready = false; // the model has drawn, so its orientation can be changed
    let inView = false;
    let wanted = 0; // bumps whenever the card enters or leaves, so a late load can tell it is out of date
    let unsubscribe: (() => void) | null = null;
    let raf = 0;
    let last = 0;
    const now = [0, 0, 0]; // orientation shown now: roll, pitch, yaw
    const goal = [0, 0, 0]; // orientation for the card's place on screen

    // The middle of the screen is the resting pose; the bottom and top edges are the two ends of the card's tumble. Each axis follows its
    // own curve (yaw straight, pitch up and back, roll a full wave), so the model never just spins about a single line.
    const aim = () => {
      const r = el.getBoundingClientRect();
      const s = Math.max(-1, Math.min(1, 1 - ((r.top + r.height / 2) / window.innerHeight) * 2));
      goal[0] = ROLL * model.amp * t.roll * Math.sin(Math.PI * s);
      goal[1] = PITCH * model.amp * t.pitch * Math.sin(0.75 * Math.PI * s);
      goal[2] = YAW * model.amp * t.yaw * s;
    };
    // Yaw and pitch move the camera round the model (the viewer's supported way, and it keeps the model centred); roll is a turn of the
    // picture itself, which is exactly what a roll about the view axis looks like, and costs nothing to draw. (The viewer's own
    // "orientation" setting is not used: in this version it throws an error whenever it changes outside of AR.)
    const draw = () => {
      if (!viewer || !ready) return;
      viewer.cameraOrbit = `${THETA + now[2]}deg ${PHI + now[1]}deg ${model.distance}m`;
      const px = el.clientWidth / FRAME_W;
      viewer.style.transform = `translate(${(-model.shift[0] * px).toFixed(2)}px, ${(-model.shift[1] * px).toFixed(2)}px) rotate(${now[0].toFixed(2)}deg)`;
    };
    // Ease towards the goal (about a tenth of a second), so scrolling in jerks still moves smoothly and a model that goes live
    // part-way down the screen turns into its pose instead of jumping.
    const step = (time: number) => {
      raf = 0;
      const k = 1 - Math.exp(-Math.min(64, time - (last || time)) / 110);
      last = time;
      let moving = false;
      for (let i = 0; i < 3; i++) {
        now[i] += (goal[i] - now[i]) * k;
        if (Math.abs(goal[i] - now[i]) > 0.05) moving = true;
      }
      draw();
      if (moving) raf = requestAnimationFrame(step);
      else last = 0;
    };
    const update = () => {
      if (!viewer || !ready) return;
      aim();
      if (!raf) raf = requestAnimationFrame(step);
    };

    const drop = () => {
      wanted++;
      unsubscribe?.();
      unsubscribe = null;
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      ready = false;
      const v = viewer;
      viewer = null;
      setShowLive(false);
      // Remove the viewer a frame after the still is back, so there is never a blank frame.
      if (v) requestAnimationFrame(() => v.remove());
      release(id);
    };

    const create = () => {
      const mine = ++wanted;
      loadViewer().then(() => {
        if (wanted !== mine || !inView) return release(id);
        const v = document.createElement("model-viewer") as Viewer;
        const attrs: Record<string, string> = {
          src: model.glb,
          "environment-image": "neutral",
          exposure: String(EXPOSURE),
          "shadow-intensity": "0",
          "min-field-of-view": "5deg",
          "max-field-of-view": "120deg",
          "interpolation-decay": "10", // the card eases the motion itself
          "interaction-prompt": "none",
          "disable-zoom": "",
          "disable-pan": "",
          loading: "eager",
          reveal: "auto",
          "aria-hidden": "true",
        };
        for (const [k, val] of Object.entries(attrs)) v.setAttribute(k, val);
        v.tabIndex = -1;
        // K times the art box, centred on it, then moved so the visible model (not its invisible bounding box) is centred on the art box.
        // The turn happens about the visible model's own centre.
        const edge = `${(-(K - 1) / 2) * 100}%`;
        Object.assign(v.style, { position: "absolute", left: edge, top: edge, width: `${K * 100}%`, height: `${K * 100}%`, background: "transparent", pointerEvents: "none", opacity: "0", willChange: "transform" });
        v.style.clipPath = "inset(4px)"; // the outermost pixels of the canvas can carry a faint line, which a turned canvas would show as a diagonal
        v.style.transformOrigin = `${50 + (model.shift[0] / (480 * K)) * 100}% ${50 + (model.shift[1] / (449 * K)) * 100}%`;
        // The view is set once the model has loaded: set earlier, the viewer works out its allowed camera distance from the wide view and
        // pulls the camera in too close.
        v.addEventListener(
          "load",
          () => {
            v.setAttribute("field-of-view", `${WIDE_FOV}deg`);
            v.cameraOrbit = `${THETA}deg ${PHI}deg ${model.distance}m`; // the still's camera, by distance, so the pose is exact
            v.jumpCameraToGoal();
          },
          { once: true },
        );
        v.style.setProperty("--poster-color", "transparent");
        v.addEventListener("model-visibility", (e) => {
          if (!(e as CustomEvent<{ visible: boolean }>).detail.visible || viewer !== v) return;
          v.style.opacity = "1"; // on top of the still, identical frame
          requestAnimationFrame(() => {
            if (viewer !== v) return;
            ready = true;
            setShowLive(true);
            update();
          });
        });
        viewer = v;
        el.appendChild(v);
        unsubscribe = subscribe(update);
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) {
          if (viewer || holders.has(id)) drop();
          else release(id);
          return;
        }
        pageSettled().then(() => {
          if (inView && !viewer) request(id, () => inView, create);
        });
      },
      { rootMargin: "80px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      inView = false;
      drop();
    };
  }, [live, cardId, model.glb, model.distance, model.amp, model.shift]);

  return (
    <div ref={box} className={className + " relative"}>
      {/* The still is cut a tenth larger all round than the art box, so a model with a tall or wide shape is never trimmed by the box. */}
      <img src={model.still} alt="" width={528} height={494} loading="lazy" decoding="async" draggable={false} className={"pointer-events-none absolute top-[-5%] left-[-5%] h-[110%] w-[110%] max-w-none object-contain" + (showLive ? " opacity-0" : "")} />
    </div>
  );
}
