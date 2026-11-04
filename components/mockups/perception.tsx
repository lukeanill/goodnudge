import type { ComponentType } from "react";
import { Chip, Frame, Jar, Money, Serum } from "./art";
import { Arrow, Box, Cap, Face, Leaf, Line, Parcel, Plus, Refresh, Tick, Wave } from "./kit";

type Pair = { dark: ComponentType; good: ComponentType };

// 35 Peak-End Rule: a delightful ending that hides a painful return vs a friendly ending with clear tracking.
const Burst = () => (
  <div className="relative flex size-20 items-center justify-center rounded-full bg-primary text-secondary">
    <Tick className="size-10" />
    {[[-44, -10], [44, -14], [-30, -42], [34, -40], [0, -52]].map(([x, y], i) => (
      <span key={i} className="absolute size-2 rounded-full bg-white" style={{ transform: `translate(${x}px, ${y}px)` }} />
    ))}
  </div>
);
const PeakDark = () => (
  <Frame className="pt-9">
    <Burst />
    <div className="flex items-center gap-2 opacity-60">
      <Parcel className="size-8 text-white" />
      <Refresh className="size-6 text-white" />
      <Cap dim>Returns</Cap>
    </div>
  </Frame>
);
const PeakGood = () => (
  <Frame className="pt-9">
    <Burst />
    <div className="flex items-center gap-2">
      <span className="size-2.5 rounded-full bg-primary" />
      <span className="h-0.5 w-10 bg-primary" />
      <span className="size-2.5 rounded-full bg-primary" />
      <span className="h-0.5 w-10 bg-white/40" />
      <Parcel className="size-7 text-white" />
    </div>
  </Frame>
);

// 36 Serial Position: highest-profit products first and last vs sorted by relevance with ads labelled.
const ListRow = ({ hot, ad }: { hot?: boolean; ad?: boolean }) => (
  <div className={"flex w-full items-center gap-3 rounded-[3px] px-3 py-2 " + (hot ? "border-2 border-primary bg-primary/20" : "border border-white/40")}>
    <Line w={ad ? 45 : 70} dim={!hot} />
    {ad && (
      <span className="ml-auto">
        <Chip>Ad</Chip>
      </span>
    )}
  </div>
);
const SerialDark = () => (
  <Frame>
    <div className="flex w-full flex-col gap-2">
      <ListRow hot />
      <ListRow />
      <ListRow />
      <ListRow />
      <ListRow hot />
    </div>
  </Frame>
);
const SerialGood = () => (
  <Frame>
    <div className="flex w-full flex-col gap-2">
      <ListRow ad />
      <ListRow />
      <ListRow />
      <ListRow />
      <ListRow />
    </div>
  </Frame>
);

// 37 Von Restorff: "Most popular" on the wrong plan vs the highlight on the plan that truly fits.
const Plan = ({ price, hot, label }: { price: string; hot?: boolean; label?: string }) => (
  <div className={"flex h-[150px] w-[84px] flex-col items-center justify-between rounded-[4px] p-2.5 " + (hot ? "border-2 border-primary bg-primary/20" : "border border-white/40")}>
    <Line w={60} dim />
    <span className="font-heading text-[22px] leading-none text-primary">{price}</span>
    {label ? <Chip active>{label}</Chip> : <span className="h-[22px]" />}
  </div>
);
const RestorffDark = () => (
  <Frame>
    <div className="flex gap-2">
      <Plan price="$20" />
      <Plan price="$40" hot label="Popular" />
      <Plan price="$60" />
    </div>
  </Frame>
);
const RestorffGood = () => (
  <Frame>
    <div className="flex gap-2">
      <Plan price="$20" hot label="Best fit" />
      <Plan price="$40" />
      <Plan price="$60" />
    </div>
  </Frame>
);

// 38 Aesthetic-Usability: retouched before/after vs an unretouched real customer photo.
const AestheticDark = () => (
  <Frame>
    <div className="flex items-center gap-3">
      <Face className="size-20" dots />
      <Arrow className="size-6 text-white" />
      <div className="relative">
        <Face className="size-20" glow />
        <Plus className="absolute -top-1 -right-1 size-5 text-white" />
      </div>
    </div>
    <Jar className="w-[56px]" />
  </Frame>
);
const AestheticGood = () => (
  <Frame>
    <Face className="size-28" dots />
    <Chip>Real customer</Chip>
  </Frame>
);

// 39 Mere Exposure: the same ad following you around vs recently viewed on the shop's own site.
const Ad = () => (
  <div className="flex h-[96px] w-[76px] flex-col items-center justify-center gap-2 rounded-[3px] border border-white/40">
    <Serum className="h-[52px]" />
    <Line w={55} dim />
  </div>
);
const ExposureDark = () => (
  <Frame>
    <div className="flex gap-2">
      <Ad />
      <Ad />
      <Ad />
    </div>
    <Cap dim>Everywhere</Cap>
  </Frame>
);
const ExposureGood = () => (
  <Frame>
    <Box className="flex flex-col gap-2">
      <Chip>Recently viewed</Chip>
      <div className="flex items-end justify-around">
        <Serum className="h-[56px]" />
        <Jar className="w-[50px]" />
        <Serum className="h-[56px]" />
      </div>
    </Box>
  </Frame>
);

// 40 Priming: a spa mood with "you deserve this" vs a calm image with clear price and ingredients.
const PrimingDark = () => (
  <Frame>
    <Wave className="size-10 text-primary" />
    <Jar className="w-[84px]" />
    <Money now="$120" size={38} />
    <Chip active>You deserve this</Chip>
  </Frame>
);
const PrimingGood = () => (
  <Frame>
    <Wave className="size-10 text-primary" />
    <Jar className="w-[84px]" />
    <Money now="$120" size={38} />
    <div className="flex w-[140px] flex-col gap-1.5">
      <Line />
      <Line w={80} />
      <Line w={60} />
    </div>
  </Frame>
);

export const perception: Record<number, Pair> = {
  35: { dark: PeakDark, good: PeakGood },
  36: { dark: SerialDark, good: SerialGood },
  37: { dark: RestorffDark, good: RestorffGood },
  38: { dark: AestheticDark, good: AestheticGood },
  39: { dark: ExposureDark, good: ExposureGood },
  40: { dark: PrimingDark, good: PrimingGood },
};
