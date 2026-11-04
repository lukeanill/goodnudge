import type { ComponentType } from "react";
import { Chip, Frame, Jar, Lipstick, Money, Row } from "./art";
import { Bar, Box, Card, Clock, Gift, Line, Parcel, Phone, Plus, Ring, Tick } from "./kit";

type Pair = { dark: ComponentType; good: ComponentType };

// 29 Goal-Gradient: "$4 to go" but only $20 suggestions vs a small useful add-on.
const Suggest = ({ price, big }: { price: string; big?: boolean }) => (
  <Box className="flex items-center gap-3">
    {big ? <Lipstick className="h-[44px]" /> : <Jar className="w-[44px]" />}
    <Money now={price} size={24} />
    <span className="ml-auto flex size-7 items-center justify-center rounded-[3px] bg-primary text-secondary">
      <Plus className="size-4" />
    </span>
  </Box>
);
const GradientDark = () => (
  <Frame>
    <Bar pct={88} />
    <Chip>$4 to go</Chip>
    <Suggest price="$20" big />
  </Frame>
);
const GradientGood = () => (
  <Frame>
    <Bar pct={88} />
    <Chip>$4 to go</Chip>
    <Suggest price="$4" />
  </Frame>
);

// 30 Endowed Progress: free stamps that expire vs free stamps that never do.
const Stamps = () => (
  <div className="grid grid-cols-5 gap-2">
    {Array.from({ length: 10 }, (_, i) => (
      <span key={i} className={"flex size-9 items-center justify-center rounded-full " + (i < 2 ? "bg-primary text-secondary" : "border-2 border-dashed border-white/50")}>
        {i < 2 && <Tick className="size-5" />}
      </span>
    ))}
  </div>
);
const EndowedDark = () => (
  <Frame>
    <Stamps />
    <div className="flex items-center gap-2">
      <Clock className="size-5 text-primary" />
      <Chip active>30 days</Chip>
    </div>
  </Frame>
);
const EndowedGood = () => (
  <Frame>
    <Stamps />
    <Chip>Never expire</Chip>
  </Frame>
);

// 31 Variable Rewards: spin to win vs a clear gift every fifth order.
const Wheel = () => (
  <svg viewBox="0 0 120 130" className="h-[130px]" aria-hidden>
    <path d="M60 2l8 14H52z" className="fill-white" />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a0 = (i * 60 - 90) * (Math.PI / 180);
      const a1 = ((i + 1) * 60 - 90) * (Math.PI / 180);
      const p = (a: number) => `${60 + 52 * Math.cos(a)} ${76 + 52 * Math.sin(a)}`;
      return <path key={i} d={`M60 76L${p(a0)}A52 52 0 0 1 ${p(a1)}Z`} className={i % 2 ? "fill-white/80" : "fill-primary"} />;
    })}
    <circle cx="60" cy="76" r="9" className="fill-secondary" />
  </svg>
);
const VariableDark = () => (
  <Frame>
    <Wheel />
    <Chip>Spin</Chip>
  </Frame>
);
const VariableGood = () => (
  <Frame>
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className="flex size-8 items-center justify-center rounded-full bg-primary text-secondary">
          <Tick className="size-4" />
        </span>
      ))}
      <span className="flex size-12 items-center justify-center rounded-[4px] border-2 border-primary text-primary">
        <Gift className="size-7" />
      </span>
    </div>
    <Chip>Every 5th order</Chip>
  </Frame>
);

// 32 Hyperbolic Discounting: a discount tied to a credit card, today only vs a plain first-order discount.
const HyperbolicDark = () => (
  <Frame>
    <Money now="15%" size={64} />
    <div className="flex items-center gap-3">
      <Card className="size-9 text-white" />
      <Chip active>Today only</Chip>
    </div>
  </Frame>
);
const HyperbolicGood = () => (
  <Frame>
    <Money now="15%" size={64} />
    <Chip>First order</Chip>
  </Frame>
);

// 33 Zeigarnik Effect: nagging to finish a profile for a phone number vs optional fields.
const ZeigarnikDark = () => (
  <Frame>
    <Ring pct={60}>60%</Ring>
    <Box className="flex items-center gap-2">
      <Phone className="size-5 text-white" />
      <Line w={60} dim />
    </Box>
  </Frame>
);
const ZeigarnikGood = () => (
  <Frame>
    <Ring pct={60}>60%</Ring>
    <div className="flex w-full flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <Box key={i} className="flex items-center gap-2 py-2">
          <Line w={55} dim />
          <span className="ml-auto">
            <Chip>Optional</Chip>
          </span>
        </Box>
      ))}
    </div>
  </Frame>
);

// 34 IKEA Effect: a surprise assembly fee vs a running total.
const IkeaDark = () => (
  <Frame>
    <Parcel className="size-14 text-white" />
    <Box className="flex flex-col gap-2">
      <Row label="Gift box" value="$30" />
      <Row label="Assembly" value="$5" hot />
      <div className="h-px w-full bg-primary" />
      <Row label="Total" value="$35" strong />
    </Box>
  </Frame>
);
const IkeaGood = () => (
  <Frame>
    <Parcel className="size-14 text-white" />
    <div className="flex items-end gap-3">
      <Lipstick className="h-[44px]" />
      <Jar className="w-[48px]" />
      <Plus className="size-6 text-white" />
    </div>
    <Money now="$30" size={36} />
  </Frame>
);

export const motivation: Record<number, Pair> = {
  29: { dark: GradientDark, good: GradientGood },
  30: { dark: EndowedDark, good: EndowedGood },
  31: { dark: VariableDark, good: VariableGood },
  32: { dark: HyperbolicDark, good: HyperbolicGood },
  33: { dark: ZeigarnikDark, good: ZeigarnikGood },
  34: { dark: IkeaDark, good: IkeaGood },
};
