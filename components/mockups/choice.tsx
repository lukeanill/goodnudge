import type { ComponentType } from "react";
import { Btn, Chip, Frame, Jar, Money, Serum } from "./art";
import { Arrow, Box, Cap, Check, Leaf, Stars, Swatch } from "./kit";

type Pair = { dark: ComponentType; good: ComponentType };

// 9 Choice Overload: a wall of shades vs a short quiz that narrows to four.
const OverloadDark = () => (
  <Frame>
    <div className="grid grid-cols-10 gap-1">
      {Array.from({ length: 70 }, (_, i) => (
        <Swatch key={i} tone={i * 3} className="size-[18px]" />
      ))}
    </div>
    <Money now="140" size={34} />
  </Frame>
);
const OverloadGood = () => (
  <Frame>
    <div className="flex items-center gap-2">
      <Check on round />
      <Check on round />
      <Check on round />
    </div>
    <Arrow className="size-6 rotate-90 text-white" />
    <div className="flex gap-2">
      {[2, 3, 4, 0].map((t) => (
        <Swatch key={t} tone={t} className="size-12" />
      ))}
    </div>
  </Frame>
);

// 10 Default Effect: a subscription already ticked vs one-off ticked and subscribe as a clear opt-in.
const Opt = ({ label, price, on, round }: { label: string; price: string; on?: boolean; round?: boolean }) => (
  <div className={"flex w-full items-center gap-3 rounded-[4px] p-3 " + (on ? "border-2 border-primary" : "border border-white/40")}>
    <Check on={on} round={round} />
    <span className="flex-1 text-left text-[13px] font-semibold">{label}</span>
    <span className="font-heading text-[20px] text-primary">{price}</span>
  </div>
);
const DefaultDark = () => (
  <Frame>
    <Serum className="h-[84px]" />
    <Opt label="Monthly" price="$25" on />
    <Btn>Pay</Btn>
  </Frame>
);
const DefaultGood = () => (
  <Frame>
    <Serum className="h-[84px]" />
    <Opt label="One-off" price="$30" on round />
    <Opt label="Monthly" price="$25" round />
  </Frame>
);

// 11 Framing Effect: a big percentage with the tiny sample hidden vs the sample shown with the study.
const FramingDark = () => (
  <Frame>
    <Money now="97%" size={64} />
    <Cap dim>30 people</Cap>
  </Frame>
);
const FramingGood = () => (
  <Frame>
    <Money now="97%" size={64} />
    <Cap>300 people</Cap>
    <Chip>Read the study</Chip>
  </Frame>
);

// 12 Compromise Effect: the top set pushed vs each set explained by who it is for.
const Dots = ({ n }: { n: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: n }, (_, i) => (
      <span key={i} className="size-2.5 rounded-full bg-white" />
    ))}
  </div>
);
const Set = ({ price, pick, dim, n }: { price: string; pick?: boolean; dim?: boolean; n?: number }) => (
  <div className={"flex h-[150px] w-[84px] flex-col items-center justify-between rounded-[4px] p-2.5 " + (pick ? "border-2 border-primary" : "border border-white/40") + (dim ? " opacity-50" : "")}>
    <Jar className="w-[52px]" />
    <span className="font-heading text-[20px] leading-none text-primary">{price}</span>
    {pick ? <Chip active>Best</Chip> : n ? <Dots n={n} /> : <span className="h-[22px]" />}
  </div>
);
const CompromiseDark = () => (
  <Frame>
    <div className="flex gap-2">
      <Set price="$15" dim />
      <Set price="$25" />
      <Set price="$35" pick />
    </div>
  </Frame>
);
const CompromiseGood = () => (
  <Frame>
    <div className="flex gap-2">
      <Set price="$15" n={1} />
      <Set price="$25" n={2} />
      <Set price="$35" n={3} />
    </div>
  </Frame>
);

// 13 Choice Architecture: the cheapest option below the fold vs every option in view, eco highlighted.
const Ship = ({ label, price, on, dim, leaf }: { label: string; price: string; on?: boolean; dim?: boolean; leaf?: boolean }) => (
  <div className={"flex w-full items-center gap-2 rounded-[4px] px-3 py-2.5 " + (on ? "border-2 border-primary" : "border border-white/40") + (dim ? " opacity-40" : "")}>
    {leaf && <Leaf className="size-4 text-primary" />}
    <span className="flex-1 text-left text-[13px] font-semibold">{label}</span>
    <span className="font-heading text-[18px] text-primary">{price}</span>
  </div>
);
const ArchitectureDark = () => (
  <Frame>
    <Ship label="Express" price="$12" on />
    <Ship label="Priority" price="$8" />
    <div className="flex w-full items-center gap-2">
      <div className="w-full border-t-2 border-dashed border-white/50" />
    </div>
    <Ship label="Standard" price="$4" dim />
  </Frame>
);
const ArchitectureGood = () => (
  <Frame>
    <Ship label="Express" price="$12" />
    <Ship label="Priority" price="$8" />
    <Ship label="Eco" price="$4" on leaf />
  </Frame>
);

// 14 Cognitive Load: six steps to cancel vs one click.
const CognitiveDark = () => (
  <Frame>
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <span key={n} className="flex size-9 items-center justify-center rounded-[3px] border border-white/60 font-heading text-[16px]">
          {n}
        </span>
      ))}
    </div>
    <Chip>Cancel</Chip>
  </Frame>
);
const CognitiveGood = () => (
  <Frame>
    <Btn>Cancel</Btn>
  </Frame>
);

// 15 Satisficing: a "best" badge handed out for profit vs earned from reviews.
const SatisficingDark = () => (
  <Frame>
    <Jar className="w-[110px]" />
    <Chip active>Best for dry skin</Chip>
  </Frame>
);
const SatisficingGood = () => (
  <Frame>
    <Jar className="w-[100px]" />
    <Chip active>Best for dry skin</Chip>
    <Stars n={5} />
  </Frame>
);

export const choice: Record<number, Pair> = {
  9: { dark: OverloadDark, good: OverloadGood },
  10: { dark: DefaultDark, good: DefaultGood },
  11: { dark: FramingDark, good: FramingGood },
  12: { dark: CompromiseDark, good: CompromiseGood },
  13: { dark: ArchitectureDark, good: ArchitectureGood },
  14: { dark: CognitiveDark, good: CognitiveGood },
  15: { dark: SatisficingDark, good: SatisficingGood },
};
