type FilterTabProps = {
  label: string;
  count: number;
  pressed: boolean;
  /** Inside the sticky glass tray: unselected tabs drop their fill and inner shadow. */
  tray?: boolean;
  onToggle: () => void;
};

// Figma "Tab": 36px pill, 12px side padding, 4px gap, 14px label + 13px count at 75%.
// Resting tabs are flat pink pills (the pink with a 12% light wash, as in the design) with a faint inner shadow; the selected tab is
// white and raised. Neither has a border.
const SELECTED = "bg-[#f9f6f8] shadow-[-1px_-1px_4px_rgba(255,255,255,0.16),1px_1px_4px_rgba(129,41,97,0.12)]";
const RESTING = "bg-[color-mix(in_srgb,#f6f4f4_12%,var(--color-primary))] shadow-[inset_-1px_-3px_8px_rgba(129,41,97,0.04)]";
// Same shadow shape as RESTING, zeroed, so the fade between the two is smooth.
const TRAY = "bg-transparent shadow-[inset_-1px_-3px_8px_rgba(129,41,97,0)]";

export function FilterTab({ label, count, pressed, tray, onToggle }: FilterTabProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={
        "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full px-3 text-[14px] leading-none font-normal tracking-normal whitespace-nowrap text-foreground transition-[background-color,box-shadow] duration-150 " +
        (pressed ? SELECTED : tray ? TRAY : RESTING)
      }
    >
      <span>{label}</span>
      <span className="tab-count text-[13px] text-secondary opacity-75">{count}</span>
    </button>
  );
}
