type FilterTabProps = {
  label: string;
  count: number;
  pressed: boolean;
  /** Inside the sticky glass tray: unselected tabs drop their border and fill. */
  tray?: boolean;
  onToggle: () => void;
};

// Figma "Tab" (updated tabs): 36px pill, 12px side padding, 4px gap, 14px medium label + DM Mono count at 65%.
// Resting row: unselected tabs are inset pills with a hairline border; the selected tab is white and raised.
const SELECTED =
  "px-3 border-[0.5px] border-[rgba(242,174,218,0.25)] bg-white shadow-[-4px_-4px_12px_rgba(255,255,255,0.32),4px_4px_12px_rgba(194,160,179,0.32)]";
const RESTING =
  "px-3 border-[0.5px] border-primary bg-background shadow-[inset_-6px_-6px_12px_rgba(251,226,246,0.24),inset_6px_6px_8px_rgba(57,29,55,0.08)]";
// Same box as RESTING (border kept, just transparent) so the border and inset shadow fade out instead of snapping.
const TRAY = "px-3 border-[0.5px] border-transparent bg-transparent shadow-[inset_0_0_0_rgba(0,0,0,0)]";

export function FilterTab({ label, count, pressed, tray, onToggle }: FilterTabProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={
        "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full text-[14px] leading-none font-medium tracking-normal whitespace-nowrap text-foreground transition-[background-color,box-shadow,border-color] duration-200 " +
        (pressed ? SELECTED : tray ? TRAY : RESTING)
      }
    >
      <span>{label}</span>
      <span className="tab-count text-[14px] opacity-65">{count}</span>
    </button>
  );
}
