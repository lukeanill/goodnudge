"use client";

export type Layout = "cards" | "table";

// Figma "toggle-layout": a 36px pink pill with 4px padding holding two 24px icons, each in a 12px-padded slot. The selected slot is
// white and raised and shows the coloured icon; the other shows the dark one. Icons are the Figma originals (public/icons).
const ICON = {
  cards: { on: "/icons/layout-grid-active.png", off: "/icons/layout-grid-resting.png" },
  table: { on: "/icons/layout-rows-active.png", off: "/icons/layout-rows-resting.png" },
} as const;

const BTN = "flex h-[31px] cursor-pointer items-center justify-center rounded-full px-3 transition-[background-color,box-shadow] duration-150";
const ON = "bg-[#f9f6f8] shadow-[-1px_-1px_4px_rgba(255,255,255,0.16),1px_1px_4px_rgba(129,41,97,0.12)]";

export function LayoutToggle({ layout, onChange }: { layout: Layout; onChange: (l: Layout) => void }) {
  return (
    <div
      role="group"
      aria-label="Layout"
      className="flex h-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,#f6f4f4_12%,var(--color-primary))] px-1 shadow-[inset_-1px_-3px_8px_rgba(129,41,97,0.04)]"
    >
      {(["cards", "table"] as const).map((l) => (
        <button key={l} type="button" aria-label={l === "cards" ? "Cards" : "Table"} aria-pressed={layout === l} onClick={() => onChange(l)} className={BTN + (layout === l ? " " + ON : "")}>
          <img src={layout === l ? ICON[l].on : ICON[l].off} alt="" width={24} height={24} className="pointer-events-none block size-6" />
        </button>
      ))}
    </div>
  );
}
