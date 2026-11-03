type FilterTabProps = {
  label: string;
  count: number;
  pressed: boolean;
  onToggle: () => void;
};

// Figma "Tab" (0:133): 8px radius, 1px border, 10/8 padding, 4px gap, 16px label + DM Mono count at 65%.
export function FilterTab({ label, count, pressed, onToggle }: FilterTabProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-[8px] border border-solid px-2 py-[10px] text-[16px] leading-none font-medium tracking-[0.01em] " +
        (pressed
          ? "border-secondary bg-secondary text-background"
          : "border-primary bg-transparent text-foreground")
      }
    >
      <span>{label}</span>
      <span className="tab-count text-[16px] opacity-65">{count}</span>
    </button>
  );
}
