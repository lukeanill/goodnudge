"use client";

import type { Principle } from "@/lib/content";
import type { CardRect } from "./principle-card";

// Table row, Figma "Principle Row" (33:3166): white at 80%, 4px between rows, 12px padding, an 88 x 40 icon slot, a 220px name column and the
// description, both 14px regular. Every second row is at 85% opacity. On phones the description drops under the name.
export function RowFace({ principle, tone }: { principle: Principle; tone: "plain" | "alt" | "solid-plain" | "solid-alt" }) {
  // "solid-*" are the same two row colours already blended onto the page colour, used by the opening animation.
  const bg =
    tone === "plain" ? "bg-white/80" : tone === "alt" ? "bg-white/80 opacity-85" : tone === "solid-plain" ? "bg-[#fdf4fa]" : "bg-[#fcf0f8]";
  return (
    <div className={"grid size-full min-h-[68px] grid-cols-[88px_1fr] items-center gap-x-1 gap-y-1 py-3 pr-4 pl-1 md:grid-cols-[88px_220px_1fr] " + bg}>
      <div className="relative h-10 w-[88px]">
        {principle.model ? (
          <img src={principle.model.still} alt="" width={528} height={494} loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 size-full object-contain p-1" />
        ) : (
          principle.image && (
            <img src={principle.image.src} alt="" width={principle.image.w} height={principle.image.h} loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 size-full object-contain p-1" />
          )
        )}
      </div>
      <h2 className="font-body text-[14px] leading-[1.6] font-normal tracking-normal text-foreground normal-case">{principle.name}</h2>
      <p className="col-span-2 text-[14px] leading-[1.6] font-normal tracking-normal text-foreground md:col-span-1">{principle.description.split(" *")[0]}</p>
    </div>
  );
}

export function PrincipleRow({
  principle,
  bg,
  alt,
  onOpen,
}: {
  principle: Principle;
  bg: number;
  alt: boolean;
  onOpen: (principle: Principle, bg: number, rect: CardRect) => void;
}) {
  return (
    <button
      type="button"
      data-card={principle.id}
      className="block w-full cursor-pointer text-left"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onOpen(principle, bg, { top: r.top, left: r.left, width: r.width, height: r.height, kind: "row", alt });
      }}
    >
      <RowFace principle={principle} tone={alt ? "alt" : "plain"} />
    </button>
  );
}
