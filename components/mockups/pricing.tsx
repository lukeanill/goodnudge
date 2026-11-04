import type { ComponentType } from "react";
import { Btn, Chip, Foundation, Frame, Jar, Lipstick, Mask, Money, Row, Serum, Small } from "./art";

type Pair = { dark: ComponentType; good: ComponentType };

// 1 Anchoring: a fake "was" price vs a real, dated one.
const AnchoringDark = () => (
  <Frame>
    <Serum className="h-[116px]" />
    <Money now="$49" was="$85" />
  </Frame>
);
const AnchoringGood = () => (
  <Frame>
    <Serum className="h-[104px]" />
    <Money now="$49" was="$85" />
    <Small>Was $85 until 12 Oct</Small>
  </Frame>
);

// 2 Decoy Effect: a medium that only exists to make the large look good vs sizes that each fit a need.
const Size = ({ label, price, w, dim, pick, note }: { label: string; price: string; w: number; dim?: boolean; pick?: boolean; note?: string }) => (
  <div className={"flex w-[78px] flex-col items-center gap-1.5 rounded-[4px] p-2 " + (pick ? "border-2 border-primary" : "border border-white/40") + (dim ? " opacity-55" : "")}>
    <div style={{ width: w }}>
      <Jar className="w-full" />
    </div>
    <span className="text-[11px] leading-none font-semibold">{label}</span>
    <span className="font-heading text-[18px] leading-none text-primary">{price}</span>
    {note && <Chip active={pick}>{note}</Chip>}
  </div>
);
const DecoyDark = () => (
  <Frame>
    <div className="flex items-end gap-2">
      <Size label="Small" price="$20" w={34} />
      <Size label="Medium" price="$32" w={44} dim />
      <Size label="Large" price="$34" w={56} pick note="Best value" />
    </div>
  </Frame>
);
const DecoyGood = () => (
  <Frame>
    <div className="flex items-end gap-2">
      <Size label="Small" price="$12" w={34} note="Travel" />
      <Size label="Medium" price="$22" w={44} note="Daily" />
      <Size label="Large" price="$34" w={56} note="Refill" />
    </div>
  </Frame>
);

// 3 Charm Pricing: 19 looks bigger than .99 vs the same price with the full total shown.
const CharmDark = () => (
  <Frame>
    <Lipstick className="h-[116px]" />
    <div className="flex items-start font-heading leading-none">
      <span className="text-[48px] text-primary">$19</span>
      <span className="mt-1 text-[22px]">.99</span>
    </div>
  </Frame>
);
const CharmGood = () => (
  <Frame>
    <Lipstick className="h-[96px]" />
    <Money now="$19.99" size={34} />
    <div className="w-full rounded-[4px] border border-primary p-3">
      <Row label="Checkout total" value="$19.99" strong />
      <Small>Tax included</Small>
    </div>
  </Frame>
);

// 4 Price Relativity: a cheap-looking $45 beside $120 vs a side-by-side comparison on size and ingredients.
const RelativityDark = () => (
  <Frame>
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <Foundation className="h-[112px]" />
        <Money now="$45" size={32} />
        <Chip active>Best price</Chip>
      </div>
      <div className="flex flex-col items-center gap-2 opacity-50">
        <Foundation className="h-[112px]" />
        <Money now="$120" size={26} />
      </div>
    </div>
  </Frame>
);
const RelativityGood = () => (
  <Frame>
    <div className="w-full rounded-[4px] border border-primary p-3">
      <div className="mb-2 grid grid-cols-[1fr_auto_auto] items-end gap-x-4 gap-y-2 text-[12px] leading-none">
        <span />
        <Foundation className="h-[44px]" />
        <Foundation className="h-[44px]" />
        <span className="font-semibold">Size</span>
        <span>30 ml</span>
        <span>30 ml</span>
        <span className="font-semibold">Ingredients</span>
        <span>14</span>
        <span>21</span>
        <span className="font-semibold">Price</span>
        <span className="font-heading text-[15px] text-primary">$45</span>
        <span className="font-heading text-[15px] text-primary">$120</span>
      </div>
    </div>
  </Frame>
);

// 5 Mental Accounting: a "treat" label vs a budget section.
const MentalDark = () => (
  <Frame>
    <Mask className="h-[112px]" />
    <Money now="$30" size={38} />
    <Chip>Self-care treat</Chip>
  </Frame>
);
const MentalGood = () => (
  <Frame>
    <Chip active>Under $15</Chip>
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <Jar className="h-[52px]" />
        <Money now="$9" size={24} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Mask className="h-[64px]" />
        <Money now="$12" size={24} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Lipstick className="h-[64px]" />
        <Money now="$14" size={24} />
      </div>
    </div>
  </Frame>
);

// 6 Pain of Paying: "Pay in 4" up front, total small vs the full total and schedule first.
const PainDark = () => (
  <Frame>
    <div className="flex items-end gap-3">
      <Serum className="h-[64px]" />
      <Jar className="h-[40px]" />
      <Lipstick className="h-[64px]" />
    </div>
    <Money now="4 × $22.50" size={30} />
    <Btn>Pay in 4</Btn>
    <Small>Bundle $90</Small>
  </Frame>
);
const PainGood = () => (
  <Frame>
    <Money now="$90" size={40} />
    <div className="w-full rounded-[4px] border border-primary p-3">
      <div className="flex flex-col gap-1.5">
        <Row label="Today" value="$22.50" />
        <Row label="In 2 weeks" value="$22.50" />
        <Row label="In 4 weeks" value="$22.50" />
        <Row label="In 6 weeks" value="$22.50" />
      </div>
    </div>
    <Btn>Choose Pay in 4</Btn>
  </Frame>
);

// 7 Zero-Price Effect: add something you don't need to reach free shipping vs a refill you already use.
const Bar = ({ pct }: { pct: number }) => (
  <div className="w-full">
    <div className="mb-1.5 flex justify-between text-[12px] leading-none font-semibold">
      <span>Free shipping over $35</span>
      <span className="tabular-nums">$29 / $35</span>
    </div>
    <div className="h-2.5 w-full overflow-hidden rounded-[2px] bg-white/25">
      <div className="h-full rounded-[2px] bg-primary" style={{ width: `${pct}%` }} />
    </div>
  </div>
);
const ZeroDark = () => (
  <Frame>
    <Bar pct={83} />
    <div className="flex w-full items-center gap-3 rounded-[4px] border border-primary p-3">
      <Lipstick className="h-[40px]" />
      <div className="flex-1 text-left">
        <p className="text-[12px] leading-tight font-semibold">Lip balm</p>
        <p className="mt-1 font-heading text-[18px] leading-none text-primary">$6</p>
      </div>
      <Btn>Add</Btn>
    </div>
  </Frame>
);
const ZeroGood = () => (
  <Frame>
    <Bar pct={83} />
    <div className="flex w-full items-center gap-3 rounded-[4px] border border-primary p-3">
      <Serum className="h-[44px]" />
      <div className="flex-1 text-left">
        <p className="text-[12px] leading-tight font-semibold">Serum refill</p>
        <Small>You use this</Small>
      </div>
      <Btn>Add $8</Btn>
    </div>
  </Frame>
);

// 8 Partitioned Pricing: fees appear on the last step vs the full price on the product page.
const PartitionDark = () => (
  <Frame>
    <Chip>Checkout · step 3 of 3</Chip>
    <div className="flex w-full flex-col gap-2 rounded-[4px] border border-primary p-3">
      <Row label="Serum" value="$34.00" />
      <Row label="Delivery" value="$4.50" hot />
      <Row label="Packaging" value="$1.00" hot />
      <div className="h-px w-full bg-primary" />
      <Row label="Total" value="$39.50" strong />
    </div>
    <Btn>Pay now</Btn>
  </Frame>
);
const PartitionGood = () => (
  <Frame>
    <Serum className="h-[104px]" />
    <Money now="$39.50" size={40} />
    <Chip>Delivery included</Chip>
  </Frame>
);

export const pricing: Record<number, Pair> = {
  1: { dark: AnchoringDark, good: AnchoringGood },
  2: { dark: DecoyDark, good: DecoyGood },
  3: { dark: CharmDark, good: CharmGood },
  4: { dark: RelativityDark, good: RelativityGood },
  5: { dark: MentalDark, good: MentalGood },
  6: { dark: PainDark, good: PainGood },
  7: { dark: ZeroDark, good: ZeroGood },
  8: { dark: PartitionDark, good: PartitionGood },
};
