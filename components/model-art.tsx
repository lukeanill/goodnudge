"use client";

import { useEffect, useRef, useState } from "react";
import type { Principle } from "@/lib/content";

// The 3D art on a card: a still image of the model by default, and on mouse hover the live model, which turns to follow the cursor.
// The still is rendered with exactly the camera below, so the swap from still to live model cannot be seen. Only one model is live at a
// time, and the viewer (about 1 MB) and the model are only fetched when someone first hovers a card.
const THETA = -20; // camera angle around the model, degrees (the stills use the same pose)
const PHI = 72; // camera angle from the top
const FOV = 30;
const EXPOSURE = 1.15;
const SWING_THETA = 30; // how far the model turns toward the cursor, at the edge of the art
const SWING_PHI = 16;
const SETTLE_MS = 450; // time to ease back to the resting pose before the live model is dropped

type Viewer = HTMLElement & { cameraOrbit: string };

let loader: Promise<void> | null = null;
function loadViewer() {
  // The package carries its own mesh decoder; it only needs to be switched on by giving it any script address.
  loader ??= import("@google/model-viewer").then(({ ModelViewerElement }) => {
    ModelViewerElement.meshoptDecoderLocation = "/models/decoder.js";
  });
  return loader;
}

let releaseActive: (() => void) | null = null;
const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function ModelArt({ model, className, live }: { model: NonNullable<Principle["model"]>; className: string; live?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const run = useRef(0); // bumps on every start/stop, so a late load can tell it is out of date
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [showLive, setShowLive] = useState(false); // the live model has drawn, so the still can step aside

  const rest = `${THETA}deg ${PHI}deg ${model.radius}%`;

  const drop = () => {
    clearTimeout(settle.current);
    run.current++;
    const el = viewer.current;
    viewer.current = null;
    setShowLive(false);
    if (releaseActive === drop) releaseActive = null;
    // Remove the viewer a frame after the still is back, so there is never a blank frame.
    if (el) requestAnimationFrame(() => el.remove());
  };

  const start = () => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearTimeout(settle.current);
    if (viewer.current) {
      viewer.current.cameraOrbit = rest; // pointer came back before it was dropped: carry on with the same viewer
      return;
    }
    if (releaseActive && releaseActive !== drop) releaseActive();
    releaseActive = drop;
    const mine = ++run.current;
    loadViewer().then(() => {
      if (run.current !== mine || !box.current) return;
      const el = document.createElement("model-viewer") as Viewer;
      const attrs: Record<string, string> = {
        src: model.glb,
        "environment-image": "neutral",
        exposure: String(EXPOSURE),
        "shadow-intensity": "0",
        "camera-orbit": rest,
        "field-of-view": `${FOV}deg`,
        "interaction-prompt": "none",
        "interpolation-decay": "70",
        "disable-zoom": "",
        "disable-pan": "",
        loading: "eager",
        reveal: "auto",
        "aria-hidden": "true",
      };
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      el.tabIndex = -1;
      Object.assign(el.style, { position: "absolute", inset: "0", width: "100%", height: "100%", background: "transparent", pointerEvents: "none", opacity: "0" });
      el.style.setProperty("--poster-color", "transparent");
      el.addEventListener("model-visibility", (e) => {
        if (!(e as CustomEvent<{ visible: boolean }>).detail.visible || viewer.current !== el) return;
        el.style.opacity = "1"; // on top of the still, identical frame
        requestAnimationFrame(() => viewer.current === el && setShowLive(true));
      });
      viewer.current = el;
      box.current.appendChild(el);
    });
  };

  const track = (e: React.PointerEvent) => {
    const el = viewer.current;
    if (!el || !box.current || e.pointerType !== "mouse") return;
    const r = box.current.getBoundingClientRect();
    const nx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2);
    const ny = clamp(((e.clientY - r.top) / r.height - 0.5) * 2);
    // The model turns to face the cursor: cursor to the right, the camera moves left round it; cursor lower, the camera rises.
    el.cameraOrbit = `${THETA - nx * SWING_THETA}deg ${PHI - ny * SWING_PHI}deg ${model.radius}%`;
  };

  const end = () => {
    run.current++; // cancels a load that has not finished
    if (viewer.current) {
      viewer.current.cameraOrbit = rest;
      settle.current = setTimeout(drop, SETTLE_MS);
    } else if (releaseActive === drop) {
      releaseActive = null;
    }
  };

  useEffect(() => () => drop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={box}
      className={className + " relative"}
      onPointerEnter={(e) => e.pointerType === "mouse" && start()}
      onPointerMove={track}
      onPointerLeave={(e) => e.pointerType === "mouse" && end()}
    >
      <img src={model.still} alt="" width={480} height={449} loading="lazy" decoding="async" draggable={false} className={"pointer-events-none absolute inset-0 size-full object-contain" + (showLive ? " opacity-0" : "")} />
    </div>
  );
}
