import type { ComponentType } from "react";
import { Chip, Frame, Jar, Serum } from "./art";
import { Bar, Cap, Leaf, Line, Spinner, Tick } from "./kit";

type Pair = { dark: ComponentType; good: ComponentType };

// 41 Confirmation Bias: a vague "toxin-free" label vs the label explained.
const ConfirmDark = () => (
  <Frame>
    <Jar className="w-[110px]" />
    <div className="flex items-center gap-2">
      <Leaf className="size-5 text-primary" />
      <Chip active>Toxin-free</Chip>
    </div>
  </Frame>
);
const ConfirmGood = () => (
  <Frame>
    <Jar className="w-[88px]" />
    <div className="flex items-center gap-2">
      <Leaf className="size-5 text-primary" />
      <Chip active>Clean</Chip>
    </div>
    <div className="flex w-[160px] flex-col gap-2">
      {[80, 65, 72].map((w) => (
        <div key={w} className="flex items-center gap-2">
          <Tick className="size-4 shrink-0 text-primary" />
          <Line w={w} />
        </div>
      ))}
    </div>
  </Frame>
);

// 42 Ambiguity Effect: the ingredient list missing vs shown.
const AmbiguityDark = () => (
  <Frame>
    <Serum className="h-[110px]" />
    <div className="flex h-[84px] w-[180px] items-center justify-center rounded-[4px] border-2 border-dashed border-white/50 font-heading text-[40px] text-white/50">?</div>
  </Frame>
);
const AmbiguityGood = () => (
  <Frame>
    <Serum className="h-[110px]" />
    <div className="flex w-[180px] flex-col gap-2 rounded-[4px] border border-primary p-3">
      {[90, 70, 80, 60].map((w) => (
        <Line key={w} w={w} />
      ))}
    </div>
  </Frame>
);

// 43 Labor Illusion: a fake "analysing" delay vs progress shown only while the tool is really working.
const LaborDark = () => (
  <Frame>
    <Spinner className="size-14 text-primary" />
    <div className="w-full">
      <Bar pct={60} />
    </div>
    <Cap dim>Analysing…</Cap>
  </Frame>
);
const Step = ({ done }: { done?: boolean }) => (
  <div className="flex w-full items-center gap-3">
    {done ? <Tick className="size-5 shrink-0 text-primary" /> : <Spinner className="size-5 shrink-0 text-white" />}
    <Line w={done ? 65 : 45} dim={!done} />
  </div>
);
const LaborGood = () => (
  <Frame>
    <div className="flex w-full flex-col gap-3">
      <Step done />
      <Step done />
      <Step />
    </div>
    <div className="w-full">
      <Bar pct={66} />
    </div>
  </Frame>
);

export const trust: Record<number, Pair> = {
  41: { dark: ConfirmDark, good: ConfirmGood },
  42: { dark: AmbiguityDark, good: AmbiguityGood },
  43: { dark: LaborDark, good: LaborGood },
};
