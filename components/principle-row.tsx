"use client";

import type { Principle } from "@/lib/content";
import type { CardRect } from "./principle-card";

// Table row, Figma "slot-contained-width" rows: white at 80%, 4px between rows, 12px padding, 64 x 40 picture,
// bold name column (280px wide), description. Every second row is at 85% opacity. On phones the description drops under the name.
export function RowFace({ principle, tone }: { principle: Principle; tone: "plain" | "alt" | "solid-plain" | "solid-alt" }) {
  // "solid-*" are the same two row colours already blended onto the page colour, used by the opening animation.
  const bg =
    tone === "plain" ? "bg-white/80" : tone === "alt" ? "bg-white/80 opacity-85" : tone === "solid-plain" ? "bg-[#fdf4fa]" : "bg-[#fcf0f8]";
  return (
    <div className={"grid size-full grid-cols-[64px_1fr] items-center gap-x-1 gap-y-1 py-3 pr-4 pl-1 md:grid-cols-[64px_280px_1fr] " + bg}>
      <div className="relative h-10 w-16">
        {principle.image && (
          <img src={principle.image.src} alt="" width={principle.image.w} height={principle.image.h} loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 size-full object-contain" />
        )}
      </div>
      <h2 className="font-body text-[18px] leading-[1.6] font-bold tracking-normal text-foreground normal-case">{principle.name}</h2>
      <p className="col-span-2 text-[18px] leading-[1.6] font-medium tracking-normal text-foreground md:col-span-1">{principle.description.split(" *")[0]}</p>
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
