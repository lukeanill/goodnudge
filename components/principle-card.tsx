"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import type { Principle } from "@/lib/content";

export type CardRect = { top: number; left: number; width: number; height: number; kind?: "card" | "row"; alt?: boolean };

// Illustration, top right: a 180 x 168 box whose right edge is 40px in from the card edge and whose top is 52px down.
// A much wider image (about 1.3:1 or more) gets a 220px wide box instead. Sizes in cqw of the 468px card.
const WIDE_FROM = 1.3;
function CardImage({ image, alt }: { image: NonNullable<Principle["image"]>; alt: string }) {
  const wide = image.w / image.h >= WIDE_FROM;
  return (
    <img
      src={image.src}
      alt={alt}
      width={image.w}
      height={image.h}
      loading="lazy"
      decoding="async"
      className={
        "pointer-events-none absolute right-[8.547cqw] h-[35.897cqw] object-contain " +
        (wide ? "top-[11.19cqw] w-[47.009cqw]" : "top-[11.111cqw] w-[38.462cqw]")
      }
    />
  );
}

// Figma "CARD" (0:143), 468 x 460 at desktop. Every size below is the Figma px value
// expressed in cqw of the 468px card, so the card scales as a whole on other screen sizes
// (floors keep the smallest text legible). Needs a `@container` parent for the cqw units.
export function CardFace({ principle, bg, withBg = true, priority }: { principle: Principle; bg: number; withBg?: boolean; priority?: boolean }) {
  const num = String(bg).padStart(2, "0");
  // Principle 9 used to carry a "*Hick's Law..." note inside its description: shown as a footnote.
  const [body, ...note] = principle.description.split(" *");
  const footnote = note.length ? `*${note.join(" *")}` : null;

  return (
    <article className={"relative flex size-full flex-col gap-[3.419cqw] overflow-hidden rounded-[2.564cqw] p-[8.547cqw] " + (withBg ? "bg-secondary" : "")}>
      {withBg && (
        <img
          src={`/bg/bg-${num}.jpg`}
          srcSet={`/bg/bg-${num}.jpg 1x, /bg/bg-${num}@2x.jpg 2x, /bg/bg-${num}@3x.jpg 3x`}
          alt=""
          width={468}
          height={460}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      )}
      {principle.image && <CardImage image={principle.image} alt="" />}
      <p className="relative text-[max(11px,2.991cqw)] leading-none font-semibold tracking-[0.06em] text-background uppercase">
        {principle.category}
      </p>
      <div className="flex-1" />
      <div className="relative flex flex-col gap-[1.709cqw]">
        <h2 className="font-serif text-[7.692cqw] leading-[1.2] font-normal tracking-normal text-primary">{principle.name}</h2>
        <div className="flex flex-col pr-[5.128cqw]">
          <p className="text-[max(14px,3.846cqw)] leading-[1.6] font-medium tracking-normal text-white">{body}</p>
          {footnote && <p className="text-[max(14px,3.846cqw)] leading-[1.6] font-medium tracking-normal text-white">{footnote}</p>}
        </div>
      </div>
    </article>
  );
}

// The card in the grid: opens the detail view when clicked or tapped.
export function PrincipleCard({
  principle,
  bg,
  priority,
  onOpen,
}: {
  principle: Principle;
  bg: number;
  priority?: boolean;
  onOpen: (principle: Principle, bg: number, rect: CardRect) => void;
}) {
  const wobble = useAnimationControls();
  const reduce = useReducedMotion();
  const isMouse = (e: React.PointerEvent) => e.pointerType === "mouse" || e.pointerType === "pen";

  return (
    <button
      type="button"
      data-card={principle.id}
      className="block w-full cursor-pointer text-left"
      // Hover wobble: a quick rock plus a small lift. Mouse only; the button itself never moves, so the open animation
      // still starts from the card's true position.
      onPointerEnter={(e) => {
        if (reduce || !isMouse(e)) return;
        wobble.start({
          rotate: [0, -1.5, 1.2, -0.8, 0.4, 0],
          scale: 1.02,
          transition: { rotate: { duration: 0.55, ease: "easeInOut" }, scale: { duration: 0.2, ease: "easeOut" } },
        });
      }}
      onPointerLeave={(e) => {
        if (reduce || !isMouse(e)) return;
        wobble.start({ rotate: 0, scale: 1, transition: { duration: 0.25, ease: "easeOut" } });
      }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onOpen(principle, bg, { top: r.top, left: r.left, width: r.width, height: r.height });
      }}
    >
      <motion.div animate={wobble} className="@container relative aspect-[468/440] w-full">
        <CardFace principle={principle} bg={bg} priority={priority} />
      </motion.div>
    </button>
  );
}
