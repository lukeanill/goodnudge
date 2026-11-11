"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import type { Principle } from "@/lib/content";
import { ModelArt } from "./model-art";

export type CardRect = { top: number; left: number; width: number; height: number; kind?: "card" | "row"; alt?: boolean };

// Illustration slot (Figma CARD-VER): a 124 x 116 box, 8px left of the card's padding edge, 3px under the category label. It sits in the
// flow, so a card with long text grows instead of running into the art. Sizes in cqw of the 309px card.
function CardImage({ principle, live, grid }: { principle: Principle; live?: boolean; grid?: boolean }) {
  // Grid cards on phones (Figma mobile card, 370 x 280): a 112 x 104 box (Figma has 86 x 80, which read too small; the desktop slot is 124 x 116, which crowded the text) pinned 24px from the left and 30px from the top, outside the text flow.
  const slot =
    "mt-[1.1cqw] -ml-[2.589cqw] block h-[37.54cqw] w-[40.129cqw] shrink-0" +
    (grid ? " max-sm:absolute max-sm:top-[30px] max-sm:left-6 max-sm:m-0 max-sm:h-[104px] max-sm:w-[112px]" : "");
  if (principle.model) return <ModelArt model={principle.model} id={principle.id} live={live} className={slot} />;
  const image = principle.image;
  if (!image) return null;
  return (
    <img
      src={image.src}
      alt=""
      width={image.w}
      height={image.h}
      loading="lazy"
      decoding="async"
      className={"pointer-events-none relative object-contain " + slot}
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
  animate,
}: {
  principle: Principle;
  bg: number;
  withBg?: boolean;
  priority?: boolean;
  fill?: boolean;
  animate?: boolean;
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
        (fill ? "" : "max-sm:rounded-[12px] max-sm:p-8 ") +
        (fill ? "size-full " : "aspect-[309/388] h-full w-full max-sm:aspect-auto max-sm:min-h-[280px] ") +
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
      <p className={"relative text-right text-[max(11px,4.207cqw)] leading-none font-medium tracking-[0.04em] text-primary opacity-75 " + (fill ? "" : "max-sm:text-[13px]")}>{principle.category}</p>
      {(principle.image || principle.model) && <CardImage principle={principle} live={!fill && animate} grid={!fill} />}
      <div className={"min-h-[3.2cqw] flex-1 " + (fill ? "" : "max-sm:min-h-[117px]")} />
      <div className={"relative flex flex-col gap-[1.294cqw] " + (fill ? "" : "max-sm:gap-1")}>
        <h2 className={"text-h5-sec text-primary " + shadow}>{principle.name}</h2>
        <div className="flex flex-col">
          <p className={"text-md text-white " + shadow}>{body}</p>
          {footnote && <p className={"text-md text-white " + shadow}>{footnote}</p>}
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
  animate,
  onOpen,
}: {
  principle: Principle;
  bg: number;
  priority?: boolean;
  animate?: boolean;
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
        <CardFace principle={principle} bg={bg} priority={priority} animate={animate} />
      </motion.div>
    </button>
  );
}
