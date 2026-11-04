// Extra pieces for the mockups: simple line icons, skeleton lines, boxes and small widgets.
// UI colours: white, primary (pink), background (pale pink). Products stay secondary (plum).

import type { ReactNode } from "react";

type IconProps = { className?: string };
const Svg = ({ className = "size-6", children }: { className?: string; children: ReactNode }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

export const Tick = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Svg>
);
export const Cross = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const Clock = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
export const Mail = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 7l9 7 9-7" />
  </Svg>
);
export const Gift = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="4" y="10" width="16" height="10" rx="1" />
    <rect x="3" y="7" width="18" height="3" rx="1" />
    <path d="M12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0" />
  </Svg>
);
export const Lock = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="5" y="11" width="14" height="10" rx="1" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </Svg>
);
export const Shield = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
  </Svg>
);
export const Users = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M2.5 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6M14.5 15c2.5-.5 6 1 6 5" />
  </Svg>
);
export const Leaf = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19l7-7" />
  </Svg>
);
export const Heart = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" />
  </Svg>
);
export const Refresh = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 12a8 8 0 11-2.5-5.8M20 4v5h-5" />
  </Svg>
);
export const Parcel = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M3 8l9-5 9 5v9l-9 5-9-5zM3 8l9 5 9-5M12 13v9" />
  </Svg>
);
export const Card = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="2" y="5" width="20" height="14" rx="1" />
    <path d="M2 10h20" />
  </Svg>
);
export const Wave = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M2 9c3-3 5 3 8 0s5 3 8 0M2 15c3-3 5 3 8 0s5 3 8 0" />
  </Svg>
);
export const Spinner = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 3a9 9 0 019 9" />
  </Svg>
);
export const Arrow = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);
export const Plus = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const Phone = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </Svg>
);

export const Star = ({ on = true, className = "size-4" }: { on?: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z"
      className={on ? "fill-primary" : "fill-none stroke-white/40"}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
export const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} on={i <= n} />
    ))}
  </div>
);

/** A boxed area with a pink outline. */
export const Box = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={"w-full rounded-[4px] border border-primary p-3 " + className}>{children}</div>
);

/** A grey bar that stands in for a line of text. */
export const Line = ({ w = 100, dim }: { w?: number; dim?: boolean }) => (
  <div className={"h-1.5 rounded-[1px] " + (dim ? "bg-white/25" : "bg-white/60")} style={{ width: `${w}%` }} />
);

/** Checkbox / radio-like square. */
export const Check = ({ on, round }: { on?: boolean; round?: boolean }) => (
  <span className={"inline-flex size-4 shrink-0 items-center justify-center border-2 border-white " + (round ? "rounded-full" : "rounded-[2px]") + (on ? " bg-primary text-secondary" : "")}>
    {on && <Tick className="size-3" />}
  </span>
);

/** A colour swatch (foundation shade). */
export const Swatch = ({ tone, className = "size-5" }: { tone: number; className?: string }) => {
  const tones = ["bg-background", "bg-background/80", "bg-primary", "bg-primary/80", "bg-primary/60", "bg-white/70", "bg-white/50", "bg-primary/40"];
  return <span className={"inline-block rounded-[2px] " + tones[tone % tones.length] + " " + className} />;
};

/** Progress bar with an optional marker. */
export const Bar = ({ pct, marker, ghost }: { pct: number; marker?: number; ghost?: number }) => (
  <div className="relative h-2.5 w-full rounded-[2px] bg-white/25">
    <div className="h-full rounded-[2px] bg-primary" style={{ width: `${pct}%` }} />
    {ghost !== undefined && <div className="absolute -top-1 h-[18px] w-0 border-l-2 border-dashed border-white/50" style={{ left: `${ghost}%` }} />}
    {marker !== undefined && <div className="absolute -top-1 h-[18px] w-0.5 bg-white" style={{ left: `${marker}%` }} />}
  </div>
);

/** Circular progress. */
export const Ring = ({ pct, children }: { pct: number; children?: ReactNode }) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[84px]">
      <svg viewBox="0 0 84 84" className="size-full -rotate-90" aria-hidden>
        <circle cx="42" cy="42" r={r} fill="none" strokeWidth="7" className="stroke-white/25" />
        <circle cx="42" cy="42" r={r} fill="none" strokeWidth="7" strokeDasharray={`${(c * pct) / 100} ${c}`} className="stroke-primary" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-heading text-[20px] text-primary">{children}</div>
    </div>
  );
};

/** A small caption. */
export const Cap = ({ children, dim }: { children: ReactNode; dim?: boolean }) => (
  <span className={"text-[11px] leading-none font-medium " + (dim ? "text-white/40" : "text-background/80")}>{children}</span>
);

/** A little face (customer / before-after photos). */
export const Face = ({ className = "size-16", dots, glow }: { className?: string; dots?: boolean; glow?: boolean }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <circle cx="32" cy="32" r="28" className={glow ? "fill-background" : "fill-primary"} />
    <circle cx="23" cy="28" r="3" className="fill-secondary" />
    <circle cx="41" cy="28" r="3" className="fill-secondary" />
    <path d="M22 41c4 5 16 5 20 0" fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-secondary" />
    {dots && (
      <>
        <circle cx="18" cy="36" r="1.4" className="fill-secondary" />
        <circle cx="46" cy="37" r="1.4" className="fill-secondary" />
        <circle cx="30" cy="22" r="1.2" className="fill-secondary" />
        <circle cx="36" cy="46" r="1.2" className="fill-secondary" />
      </>
    )}
  </svg>
);
