"use client";

export type Layout = "cards" | "table";
// Phones: the Figma closed state draws the toggle 44px tall (1.222x), the categories-open state 40px (1.111x). Desktop is the 36px original.
export type ToggleSize = "default" | "phone" | "phone-open";

// Figma "toggle-layout" (phones: the same, 1.11x larger, 40px): a 36px pink pill with 4px padding holding two 24px icons, each in a 12px-padded slot. The selected slot is
// white and raised and shows the coloured icon; the other shows the dark one. Icons are the Figma originals (public/icons).
const ICON = {
  cards: { on: "/icons/layout-grid-active.png", off: "/icons/layout-grid-resting.png" },
  table: { on: "/icons/layout-rows-active.png", off: "/icons/layout-rows-resting.png" },
} as const;

const BTN_BASE = "flex cursor-pointer items-center justify-center rounded-full transition-[background-color,box-shadow] duration-150 ";
const SIZES = {
  default: { box: "h-9 px-1", btn: "h-[31px] px-3", icon: "size-6" },
  phone: { box: "h-11 px-[4.889px] sm:h-9 sm:px-1", btn: "h-[37.889px] px-[14.667px] sm:h-[31px] sm:px-3", icon: "size-[29.333px] sm:size-6" },
  "phone-open": { box: "h-10 px-[4.444px] sm:h-9 sm:px-1", btn: "h-[34.444px] px-[13.333px] sm:h-[31px] sm:px-3", icon: "size-[26.667px] sm:size-6" },
} as const;
const ON = "bg-[#f9f6f8] shadow-[-1px_-1px_4px_rgba(255,255,255,0.16),1px_1px_4px_rgba(129,41,97,0.12)]";

export function LayoutToggle({ layout, onChange, size = "default" }: { layout: Layout; onChange: (l: Layout) => void; size?: ToggleSize }) {
  const z = SIZES[size];
  return (
    <div
      role="group"
      aria-label="Layout"
      className={"flex shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,#f6f4f4_12%,var(--color-primary))] shadow-[inset_-1px_-3px_8px_rgba(129,41,97,0.04)] " + z.box}
    >
      {(["cards", "table"] as const).map((l) => (
        <button key={l} type="button" aria-label={l === "cards" ? "Cards" : "Table"} aria-pressed={layout === l} onClick={() => onChange(l)} className={BTN_BASE + z.btn + (layout === l ? " " + ON : "")}>
          <img src={layout === l ? ICON[l].on : ICON[l].off} alt="" width={24} height={24} className={"pointer-events-none block " + z.icon} />
        </button>
      ))}
    </div>
  );
}
