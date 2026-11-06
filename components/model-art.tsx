"use client";

import { useEffect, useRef, useState } from "react";
import type { Principle } from "@/lib/content";

// The 3D art on a card: a still image of the model, and, while the card is on screen, the live model, which turns as the page scrolls.
// The still is rendered with exactly the resting camera below, so the swap from still to live model cannot be seen. Each card turns in
// its own direction (left-right, up-down or diagonal; see `motionFor`). At most MAX_LIVE models are live at once, because each one is
// drawn on every scroll frame. The viewer (about 1 MB) and the models are only fetched once the page has settled.
const THETA = -20; // resting camera angle around the model, degrees (the stills use the same pose)
const PHI = 72; // resting camera angle from the top
const FOV = 30;
const EXPOSURE = 1.15;
const SWEEP_THETA = 40; // degrees the model turns left-right between the bottom and the top of the screen
const SWEEP_PHI = 20; // degrees it tilts up-down
const MAX_LIVE_DESKTOP = 9;
const MAX_LIVE_PHONE = 4;

/** Direction a card turns in: [left-right, up-down]. Each is -1, 0 or 1. Neighbouring cards differ. */
const DIRECTIONS: [number, number][] = [
  [1, 0], // left to right
  [0, 1], // up and down
  [1, 1], // diagonal
  [-1, 0], // right to left
  [0, -1], // down and up
  [-1, 1], // the other diagonal
];
export const motionFor = (id: number) => DIRECTIONS[id % DIRECTIONS.length];

type Viewer = HTMLElement & { cameraOrbit: string };

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

export function ModelArt({ model, motion, className, live }: { model: NonNullable<Principle["model"]>; motion: [number, number]; className: string; live?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [showLive, setShowLive] = useState(false); // the live model has drawn, so the still can step aside

  useEffect(() => {
    const el = box.current;
    if (!live || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = {};
    let viewer: Viewer | null = null;
    let inView = false;
    let wanted = 0; // bumps whenever the card enters or leaves, so a late load can tell it is out of date
    let unsubscribe: (() => void) | null = null;
    const rest = `${THETA}deg ${PHI}deg ${model.radius}%`;

    // Pose for the card's position on screen: the middle of the screen is the resting pose, the bottom edge is one end of the sweep
    // and the top edge is the other, in this card's own direction.
    const pose = () => {
      const r = el.getBoundingClientRect();
      const s = Math.max(-1.2, Math.min(1.2, 1 - ((r.top + r.height / 2) / window.innerHeight) * 2));
      return `${THETA + s * SWEEP_THETA * motion[0]}deg ${PHI + s * SWEEP_PHI * motion[1]}deg ${model.radius}%`;
    };
    const update = () => {
      if (viewer) viewer.cameraOrbit = pose();
    };

    const drop = () => {
      wanted++;
      unsubscribe?.();
      unsubscribe = null;
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
          "camera-orbit": rest, // starts exactly where the still is, then eases to the scroll pose
          "field-of-view": `${FOV}deg`,
          "interaction-prompt": "none",
          "interpolation-decay": "90",
          "disable-zoom": "",
          "disable-pan": "",
          loading: "eager",
          reveal: "auto",
          "aria-hidden": "true",
        };
        for (const [k, val] of Object.entries(attrs)) v.setAttribute(k, val);
        v.tabIndex = -1;
        Object.assign(v.style, { position: "absolute", inset: "0", width: "100%", height: "100%", background: "transparent", pointerEvents: "none", opacity: "0" });
        v.style.setProperty("--poster-color", "transparent");
        v.addEventListener("model-visibility", (e) => {
          if (!(e as CustomEvent<{ visible: boolean }>).detail.visible || viewer !== v) return;
          v.style.opacity = "1"; // on top of the still, identical frame
          requestAnimationFrame(() => {
            if (viewer !== v) return;
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
  }, [live, model.glb, model.radius, motion]);

  return (
    <div ref={box} className={className + " relative"}>
      <img src={model.still} alt="" width={480} height={449} loading="lazy" decoding="async" draggable={false} className={"pointer-events-none absolute inset-0 size-full object-contain" + (showLive ? " opacity-0" : "")} />
    </div>
  );
}
