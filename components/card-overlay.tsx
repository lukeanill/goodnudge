"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Principle } from "@/lib/content";
import { CardFace, type CardRect } from "./principle-card";
import { RowFace } from "./principle-row";
import { BackArrow, Caret, RatingIcons, TooltipArrow } from "./open-card-icons";
import { mockups } from "./mockups";

// The open card. Sequence from the Figma annotations: the card text fades out quickly, then the card
// expands to full screen while its fill darkens and blurs (ease-in-out); the title loads second, the
// two columns third. Closing plays it in reverse.
const EASE = [0.8, 0, 0.2, 1] as const; // the design system's ease-in-out-normal

type Phase = "opening" | "open" | "closing";
type Vp = { w: number; h: number };

const FULL = { top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0 };
const inset = (r: CardRect, vp: Vp, radius: number) => ({
  top: r.top,
  left: r.left,
  right: vp.w - r.left - r.width,
  bottom: vp.h - r.top - r.height,
  borderRadius: radius,
});

export function CardOverlay({ principle, bg, origin, onClosed }: { principle: Principle; bg: number; origin: CardRect; onClosed: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("opening");
  const [vp] = useState<Vp>(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [hiRes, setHiRes] = useState(false);
  const [closeRect, setCloseRect] = useState<CardRect | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const [descOpen, setDescOpen] = useState(false); // tap the name to show the principle's description under it
  const slotRef = useRef<HTMLDivElement>(null);

  const closing = phase === "closing";
  const isRow = origin.kind === "row";
  const radius = isRow ? 8 : (12 * origin.width) / 309; // the card's (or row's) own corner radius
  const dy = reduce ? 0 : 12;
  const t = (duration: number, delay = 0) => (reduce ? { duration: 0 } : { duration, delay, ease: EASE });
  const face = closing && closeRect ? closeRect : origin;
  const num = String(bg).padStart(2, "0");

  const close = () => {
    if (phase !== "open") return;
    const el = document.querySelector(`[data-card="${principle.id}"]`);
    const r = el?.getBoundingClientRect();
    setCloseRect(r ? { top: r.top, left: r.left, width: r.width, height: r.height } : origin);
    setTip(null);
    setPhase("closing");
  };

  // Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  // Tap anywhere else hides the tooltip (touch).
  useEffect(() => {
    if (!tip) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !slotRef.current?.contains(e.target as Node)) setTip(null);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [tip]);

  return (
    <>
      {/* Expanding card: background art, darkening/blur layer, and a copy of the card text that fades out first. */}
      <motion.div
        className="fixed z-50 overflow-hidden bg-secondary"
        initial={inset(origin, vp, radius)}
        animate={closing && closeRect ? inset(closeRect, vp, radius) : FULL}
        transition={closing ? t(0.5, 0.15) : t(0.6, 0.1)}
        onAnimationComplete={() => (closing ? onClosed() : setPhase("open"))}
      >
        {/* Base layer: the same image the card in the grid already shows (cached), so there is never a flash of flat colour. */}
        <img
          src={`/bg/bg-${num}.jpg`}
          srcSet={`/bg/bg-${num}.jpg 1x, /bg/bg-${num}@2x.jpg 2x, /bg/bg-${num}@3x.jpg 3x`}
          alt=""
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        {/* Full-size art fades in over the base once it has loaded. */}
        <img
          ref={(el) => {
            if (el?.complete && el.naturalWidth) setHiRes(true);
          }}
          src={`/bg/bg-${num}@3x.jpg`}
          alt=""
          decoding="async"
          onLoad={() => setHiRes(true)}
          className="pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out"
          style={{ opacity: hiRes ? 1 : 0 }}
        />
        <motion.div
          className="absolute inset-0 bg-[rgba(30,30,30,0.32)] backdrop-blur-[80px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: closing ? 0 : 1 }}
          transition={closing ? t(0.5, 0.15) : t(0.6, 0.1)}
        />
        <motion.div
          className="@container absolute top-0 left-0"
          style={{ width: face.width, height: face.height }}
          initial={{ opacity: 1 }}
          animate={{ opacity: closing ? 1 : 0 }}
          transition={closing ? t(0.15, 0.5) : t(0.15)}
        >
          {isRow ? <RowFace principle={principle} tone={origin.alt ? "solid-alt" : "solid-plain"} /> : <CardFace principle={principle} bg={bg} withBg={false} fill />}
        </motion.div>
      </motion.div>

      {/* Title and content: fixed to the screen, so they never shift while the card is still growing. */}
      <div className="fixed inset-0 z-[51] overflow-y-auto overscroll-contain" style={{ pointerEvents: phase === "open" ? "auto" : "none" }}>
        <motion.header
          className="relative z-10 grid grid-cols-[auto_1fr_auto] items-center px-4 py-6 md:absolute md:inset-x-0 md:top-0 md:h-[120px] md:px-10"
          initial={{ opacity: 0, y: dy }}
          animate={closing ? { opacity: 0, y: dy } : { opacity: 1, y: 0 }}
          transition={closing ? t(0.2) : t(0.35, 0.5)}
        >
          <button type="button" onClick={close} aria-label="Back to all principles" className="cursor-pointer text-background max-md:row-start-1 max-md:justify-self-start">
            <BackArrow className="block h-auto w-[66px] md:w-[133px]" />
          </button>
          <div className="flex min-h-[72px] flex-col items-center pt-2 text-center max-md:col-span-3 max-md:row-start-2 max-md:mt-2 md:whitespace-nowrap">
            <h1 className="flex">
              <button
                type="button"
                onClick={() => setDescOpen((o) => !o)}
                aria-expanded={descOpen}
                aria-controls="principle-description"
                className={
                  "flex cursor-pointer items-center gap-2 font-serif text-[30px] leading-[1.4] font-normal tracking-normal transition-colors duration-300 " +
                  (descOpen ? "text-white" : "text-primary")
                }
              >
                <span>{principle.name}</span>
                <Caret open={descOpen} />
              </button>
            </h1>
            {principle.aka.length > 0 && (
              <p
                aria-hidden={descOpen}
                className={"text-[14px] leading-[1.6] font-medium tracking-normal text-background uppercase transition-opacity duration-300 " + (descOpen ? "opacity-0" : "opacity-100")}
              >
                {principle.aka.join(", ")}
              </p>
            )}
          </div>
          <div aria-hidden className="w-[133px] max-md:hidden" />
          <AnimatePresence>
            {descOpen && (
              <motion.div
                key="description"
                id="principle-description"
                className="col-span-3 mt-3 text-center md:absolute md:top-[85px] md:left-1/2 md:mt-0 md:w-[560px] md:-translate-x-1/2"
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : 6 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
              >
                <p className="text-[18px] leading-[1.6] font-normal tracking-normal text-white">{principle.description.split(" *")[0]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <motion.div
          className={"flex flex-col p-4 pb-12 transition-[padding] duration-300 ease-[cubic-bezier(0.8,0,0.2,1)] md:absolute md:inset-0 md:overflow-y-auto md:px-10 md:pb-10 " + (descOpen ? "md:pt-[200px]" : "md:pt-[72px]")}
          initial={{ opacity: 0, y: dy }}
          animate={closing ? { opacity: 0, y: dy } : { opacity: 1, y: 0 }}
          transition={closing ? t(0.2) : t(0.35, 1.15)}
        >
          <div className="m-auto flex flex-col items-center gap-12 md:flex-row md:gap-20">
            <Column
              label="DARK PATTERN"
              labelClass="font-['Batang_Tebo'] text-[30px]"
              text={principle.darkPatternExample}
              rating={principle.darkPatternRating}
              mockup={mockups[principle.id]?.dark}
              slotRef={slotRef}
              slotHandlers={{
                onPointerEnter: (e) => e.pointerType === "mouse" && setTip({ x: e.clientX, y: e.clientY }),
                onPointerMove: (e) => e.pointerType === "mouse" && setTip({ x: e.clientX, y: e.clientY }),
                onPointerLeave: (e) => e.pointerType === "mouse" && setTip(null),
                onPointerUp: (e) => {
                  if (e.pointerType === "mouse") return;
                  setTip((cur) => (cur ? null : { x: e.clientX, y: e.clientY }));
                },
              }}
            />
            <Column label="GOOD NUDGE" labelClass="font-heading text-[24px]" text={principle.healthyExample} mockup={mockups[principle.id]?.good} />
          </div>
        </motion.div>
      </div>

      {tip && <Tooltip x={tip.x} y={tip.y} vp={vp} rating={principle.darkPatternRating} reason={principle.darkPatternReason} />}
    </>
  );
}

// One column of the open card: label, image slot (grey placeholder for now), example text.
function Column({
  label,
  labelClass,
  text,
  rating,
  slotRef,
  slotHandlers,
  mockup: Mockup,
}: {
  label: string;
  labelClass: string;
  text: string;
  rating?: number;
  slotRef?: React.Ref<HTMLDivElement>;
  slotHandlers?: React.ComponentProps<"div">;
  mockup?: React.ComponentType;
}) {
  return (
    <div className="relative flex w-[300px] shrink-0 flex-col gap-3">
      {rating !== undefined && (
        // Handwritten "4 of 5", tilted 25 degrees up-left of the label (Figma: centre 67px in, 2px down from the column top).
        <span className="pointer-events-none absolute top-[2px] left-[67px] z-10 -translate-x-1/2 -translate-y-1/2 -rotate-25 font-['Batang_Tebo'] text-[24px] leading-[1.4] whitespace-nowrap text-background">
          {rating} of 5
        </span>
      )}
      <div className={"flex h-[42px] items-center justify-center text-center leading-[1.4] font-normal text-white " + labelClass}>{label}</div>
      <div className="flex flex-col gap-6">
        <div
          ref={slotRef}
          {...slotHandlers}
          className={"h-[320px] w-[300px] overflow-hidden shadow-[12px_12px_20px_0_rgba(34,34,34,0.12)] " + (Mockup ? "rounded-[12px] border-2 border-dashed border-white" : "rounded-[16px] bg-[#363636]")}
        >
          {Mockup && <Mockup />}
        </div>
        <div className="flex min-h-[78px] items-start justify-center px-4">
          <p className="text-center text-[16px] leading-[1.6] font-medium tracking-normal text-white">{text}</p>
        </div>
      </div>
    </div>
  );
}

// Tooltip on the dark card: arrow tip at the pointer/tap, bubble 12px below it; flips above near the screen bottom.
const TIP_W = 260;
function Tooltip({ x, y, vp, rating, reason }: { x: number; y: number; vp: Vp; rating: number; reason: string }) {
  const raw = x - 24;
  const left = Math.min(Math.max(raw, 8), vp.w - TIP_W - 8);
  const arrowLeft = Math.min(Math.max(16 + (raw - left), 12), TIP_W - 28);
  const above = y + 12 + 110 > vp.h - 8;
  return (
    <motion.div
      className="pointer-events-none fixed z-[52] [filter:drop-shadow(40px_40px_40px_rgba(34,34,34,0.24))]"
      style={{ left, width: TIP_W, ...(above ? { bottom: vp.h - y } : { top: y }) }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
    >
      <span className={"absolute " + (above ? "bottom-0 rotate-180" : "top-0")} style={{ left: arrowLeft }}>
        <TooltipArrow className="block h-[12px] w-[16px] text-background" />
      </span>
      <div className={"flex flex-col gap-2 rounded-[12px] bg-background p-3 " + (above ? "mb-[12px]" : "mt-[12px]")}>
        <RatingIcons rating={rating} />
        <p className="text-[14px] leading-[1.6] font-medium tracking-normal text-foreground">{reason}</p>
      </div>
    </motion.div>
  );
}
