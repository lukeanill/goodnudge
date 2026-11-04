import type { ComponentType } from "react";
import { Chip, Frame, Jar, Lipstick, Money, Serum } from "./art";
import { Clock, Lock, Refresh } from "./kit";

type Pair = { dark: ComponentType; good: ComponentType };

// 26 Scarcity Effect: "only 3 left" on everything vs stock shown only when it is real.
const Item = ({ kind, left }: { kind: "serum" | "jar" | "lipstick"; left?: boolean }) => (
  <div className="flex w-[78px] flex-col items-center gap-2 rounded-[4px] border border-white/40 p-2.5">
    <div className="flex h-[70px] items-end">
      {kind === "serum" && <Serum className="h-[68px]" />}
      {kind === "jar" && <Jar className="w-[56px]" />}
      {kind === "lipstick" && <Lipstick className="h-[68px]" />}
    </div>
    {left ? <Chip active>3 left</Chip> : <span className="h-[22px]" />}
  </div>
);
const ScarcityDark = () => (
  <Frame>
    <div className="flex gap-2">
      <Item kind="serum" left />
      <Item kind="jar" left />
      <Item kind="lipstick" left />
    </div>
  </Frame>
);
const ScarcityGood = () => (
  <Frame>
    <div className="flex gap-2">
      <Item kind="serum" />
      <Item kind="jar" />
      <Item kind="lipstick" left />
    </div>
  </Frame>
);

// 27 Urgency: a countdown that resets vs a real end date.
const UrgencyDark = () => (
  <Frame>
    <Clock className="size-14 text-white" />
    <div className="flex items-center gap-3">
      <Money now="10:00" size={48} />
      <Refresh className="size-8 text-white/60" />
    </div>
  </Frame>
);
const UrgencyGood = () => (
  <Frame>
    <Clock className="size-14 text-white" />
    <Money now="30 Nov" size={42} />
    <Chip>Sale ends</Chip>
  </Frame>
);

// 28 Exclusivity: best prices behind a paid membership vs early access with the same prices for everyone.
const ExclusivityDark = () => (
  <Frame>
    <div className="relative flex items-center gap-4 opacity-90">
      <Lipstick className="h-[84px] opacity-40" />
      <div className="opacity-30">
        <Money now="$14" size={40} />
      </div>
      <Lock className="absolute inset-0 m-auto size-10 text-white" />
    </div>
    <Chip active>$9.99 / month</Chip>
  </Frame>
);
const ExclusivityGood = () => (
  <Frame>
    <Lipstick className="h-[84px]" />
    <Money now="$19" size={40} />
    <Chip active>Members: early access</Chip>
  </Frame>
);

export const scarcity: Record<number, Pair> = {
  26: { dark: ScarcityDark, good: ScarcityGood },
  27: { dark: UrgencyDark, good: UrgencyGood },
  28: { dark: ExclusivityDark, good: ExclusivityGood },
};
