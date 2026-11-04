// Building blocks for the open-card mockups: flat product drawings in the theme colours, plus a few tiny UI pieces.
// Colours come from theme tokens (secondary = plum, primary = pink, background = pale pink) so they follow the theme.

import type { ReactNode } from "react";

type ArtProps = { className?: string };

export function Serum({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden>
      <rect x="24" y="1" width="12" height="15" rx="5" className="fill-primary" />
      <rect x="21" y="14" width="18" height="8" rx="2" className="fill-secondary" />
      <rect x="9" y="22" width="42" height="74" rx="11" className="fill-secondary" />
      <rect x="15" y="46" width="30" height="32" rx="4" fill="#fff" />
      <rect x="20" y="53" width="20" height="3" rx="1.5" className="fill-primary" />
      <rect x="20" y="60" width="14" height="3" rx="1.5" className="fill-primary" />
    </svg>
  );
}

export function Jar({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 80 66" className={className} aria-hidden>
      <rect x="8" y="2" width="64" height="16" rx="5" className="fill-primary" />
      <rect x="3" y="18" width="74" height="46" rx="11" className="fill-secondary" />
      <rect x="22" y="28" width="36" height="26" rx="4" fill="#fff" />
      <rect x="29" y="35" width="22" height="3" rx="1.5" className="fill-primary" />
      <rect x="29" y="42" width="14" height="3" rx="1.5" className="fill-primary" />
    </svg>
  );
}

export function Lipstick({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 40 100" className={className} aria-hidden>
      <path d="M12 34V10L28 1V34Z" className="fill-primary" />
      <rect x="8" y="34" width="24" height="14" rx="2" className="fill-secondary" />
      <rect x="5" y="48" width="30" height="50" rx="5" className="fill-secondary" />
      <rect x="9" y="62" width="22" height="3" rx="1.5" className="fill-primary" />
    </svg>
  );
}

export function Foundation({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 50 100" className={className} aria-hidden>
      <rect x="19" y="1" width="12" height="8" rx="3" className="fill-secondary" />
      <rect x="22" y="9" width="6" height="12" className="fill-secondary" />
      <rect x="6" y="21" width="38" height="77" rx="9" className="fill-primary" />
      <rect x="12" y="46" width="26" height="30" rx="4" fill="#fff" />
      <rect x="16" y="54" width="18" height="3" rx="1.5" className="fill-secondary" />
      <rect x="16" y="61" width="12" height="3" rx="1.5" className="fill-secondary" />
    </svg>
  );
}

export function Mask({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 70 90" className={className} aria-hidden>
      <rect x="4" y="4" width="62" height="82" rx="9" className="fill-primary" />
      <ellipse cx="35" cy="45" rx="17" ry="22" fill="#fff" />
      <ellipse cx="28" cy="40" rx="3" ry="2" className="fill-secondary" />
      <ellipse cx="42" cy="40" rx="3" ry="2" className="fill-secondary" />
      <rect x="29" y="55" width="12" height="3" rx="1.5" className="fill-secondary" />
    </svg>
  );
}

/** The mockup canvas: white, content centred, plum text. */
export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={"flex size-full flex-col items-center justify-center gap-3 p-5 text-center text-secondary " + className}>{children}</div>;
}

/** A price: big current price, optional crossed-out old price. */
export function Money({ now, was, size = 40 }: { now: string; was?: string; size?: number }) {
  return (
    <div className="flex items-baseline justify-center gap-3 font-heading leading-none" style={{ fontSize: size }}>
      <span className="text-secondary">{now}</span>
      {was && <span className="text-primary line-through" style={{ fontSize: size * 0.7 }}>{was}</span>}
    </div>
  );
}

export function Chip({ children, active, tone = "pink" }: { children: ReactNode; active?: boolean; tone?: "pink" | "orange" }) {
  const cls = active ? "bg-secondary text-white" : tone === "orange" ? "bg-primary-foreground text-white" : "bg-background text-secondary";
  return <span className={"inline-block rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold " + cls}>{children}</span>;
}

export function Btn({ children }: { children: ReactNode }) {
  return <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-[12px] leading-none font-semibold text-white">{children}</span>;
}

/** A label/value row, e.g. in a checkout summary. */
export function Row({ label, value, strong, hot }: { label: string; value: string; strong?: boolean; hot?: boolean }) {
  return (
    <div className={"flex w-full justify-between text-[12px] leading-tight " + (strong ? "font-bold" : "font-medium") + (hot ? " text-primary-foreground" : "")}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function Small({ children }: { children: ReactNode }) {
  return <p className="text-[11px] leading-snug font-medium text-foreground/60">{children}</p>;
}
