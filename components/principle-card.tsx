"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import type { Principle } from "@/lib/content";

export type CardRect = { top: number; left: number; width: number; height: number; kind?: "card" | "row"; alt?: boolean };

// Illustration slot (Figma CARD-VER): a 124 x 116 box, 8px left of the card's padding edge, 3px under the category label. It sits in the
// flow, so a card with long text grows instead of running into the art. Sizes in cqw of the 309px card.
function CardImage({ image, alt }: { image: NonNullable<Principle["image"]>; alt: string }) {
  return (
    <img
      src={image.src}
      alt={alt}
      width={image.w}
      height={image.h}
      loading="lazy"
      decoding="async"
      className="pointer-events-none relative mt-[1.1cqw] -ml-[2.589cqw] block h-[37.54cqw] w-[40.129cqw] shrink-0 object-contain"
    />
  );
}

// Figma "CARD-VER" (33:2647), 309 x 388. Every size below is the Figma px value expressed in cqw of the 309px card, so the card scales as
// a whole on other screen sizes (floors keep the smallest text legible). Needs a `@container` parent for the cqw units.
// `fill` is for the open-card animation, which sets the size itself; in the grid the card keeps its 309:388 shape and only grows if the text needs it.
export function CardFace({
  principle,
  bg,
  withBg = true,
  priority,
  fill,
}: {
  principle: Principle;
  bg: number;
  withBg?: boolean;
  priority?: boolean;
  fill?: boolean;
}) {
  const num = String(bg).padStart(2, "0");
  // Principle 9 used to carry a "*Hick's Law..." note inside its description: shown as a footnote.
  const [body, ...note] = principle.description.split(" *");
  const footnote = note.length ? `*${note.join(" *")}` : null;
  const shadow = "[text-shadow:0_1px_2px_rgba(0,0,0,0.16)]";

  return (
    <article
      className={
        "relative flex flex-col overflow-clip rounded-[3.883cqw] p-[10.356cqw] " +
        (fill ? "size-full " : "aspect-[309/388] h-full w-full ") +
        (withBg ? "bg-secondary" : "")
      }
    >
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
      {/* The design has this label at 50% pink, which fails WCAG AA on every one of the 22 backgrounds (1.2-2.2:1). White on a 35% black chip passes
          on all of them (worst case 4.9:1). The negative margins cancel the chip's padding, so the text stays exactly where the design puts it. */}
      <p className="relative -my-[1.294cqw] -mr-[2.589cqw] self-end rounded-full bg-black/35 px-[2.589cqw] py-[1.294cqw] text-right text-[max(11px,4.207cqw)] leading-none font-medium tracking-[0.04em] text-white">
        {principle.category}
      </p>
      {principle.image && <CardImage image={principle.image} alt="" />}
      <div className="min-h-[3.2cqw] flex-1" />
      <div className="relative flex flex-col gap-[1.294cqw]">
        <h2 className={"font-serif text-[9.061cqw] leading-[1.4] font-normal tracking-normal text-primary " + shadow}>{principle.name}</h2>
        <div className="flex flex-col">
          <p className={"text-[max(14px,5.178cqw)] leading-[1.6] font-normal tracking-normal text-white " + shadow}>{body}</p>
          {footnote && <p className={"text-[max(14px,5.178cqw)] leading-[1.6] font-normal tracking-normal text-white " + shadow}>{footnote}</p>}
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
      className="block h-full w-full cursor-pointer text-left"
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
      <motion.div animate={wobble} className="@container relative h-full w-full">
        <CardFace principle={principle} bg={bg} priority={priority} />
      </motion.div>
    </button>
  );
}
