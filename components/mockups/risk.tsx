import type { ComponentType } from "react";
import { Chip, Frame, Money, Serum } from "./art";
import { Bar, Cap, Clock, Gift, Mail, Parcel, Shield, Tick } from "./kit";

type Pair = { dark: ComponentType; good: ComponentType };

// 16 Loss Aversion: "don't lose it" two days out vs a reminder a week out.
const LossDark = () => (
  <Frame>
    <Mail className="size-10 text-white" />
    <Money now="$5" size={56} />
    <div className="flex items-center gap-2">
      <Clock className="size-5 text-primary" />
      <Chip active>2 days</Chip>
    </div>
  </Frame>
);
const LossGood = () => (
  <Frame>
    <Mail className="size-10 text-white" />
    <Money now="$5" size={56} />
    <div className="flex items-center gap-2">
      <Clock className="size-5 text-primary" />
      <Chip>1 week</Chip>
    </div>
  </Frame>
);

// 17 Endowment Effect: a "free" trial that charges if not returned vs a sample with no strings.
const EndowmentDark = () => (
  <Frame>
    <Serum className="h-[100px]" />
    <Money now="$60" size={40} />
    <Chip active>Return in 7 days</Chip>
  </Frame>
);
const EndowmentGood = () => (
  <Frame>
    <Serum className="h-[100px]" />
    <Gift className="size-9 text-primary" />
    <Chip>Free sample</Chip>
  </Frame>
);

// 18 Sunk Cost: the reward target moves away vs a fixed target and points that never expire.
const SunkDark = () => (
  <Frame>
    <div className="flex w-full items-center gap-3">
      <div className="flex-1">
        <Bar pct={70} ghost={76} marker={100} />
      </div>
      <Gift className="size-8 text-primary" />
    </div>
    <Cap dim>Target moved</Cap>
  </Frame>
);
const SunkGood = () => (
  <Frame>
    <div className="flex w-full items-center gap-3">
      <div className="flex-1">
        <Bar pct={70} marker={100} />
      </div>
      <Gift className="size-8 text-primary" />
    </div>
    <Chip>Never expires</Chip>
  </Frame>
);

// 19 Risk Aversion: free returns with a hidden fee vs free returns, even opened.
const RiskDark = () => (
  <Frame>
    <Parcel className="size-16 text-white" />
    <Chip active>Free returns</Chip>
    <Cap dim>* $7 fee if opened</Cap>
  </Frame>
);
const RiskGood = () => (
  <Frame>
    <Parcel className="size-16 text-white" />
    <Chip active>Free returns</Chip>
    <Tick className="size-7 text-primary" />
  </Frame>
);

// 20 Zero-Risk Bias: paid protection the courier already gives vs a simple money-back guarantee.
const ZeroRiskDark = () => (
  <Frame>
    <Shield className="size-16 text-primary" />
    <Money now="$8" size={40} />
    <Cap dim>Courier covers it anyway</Cap>
  </Frame>
);
const ZeroRiskGood = () => (
  <Frame>
    <div className="relative">
      <Shield className="size-16 text-primary" />
      <Tick className="absolute inset-0 m-auto size-7 text-white" />
    </div>
    <Chip active>Money back</Chip>
  </Frame>
);

export const risk: Record<number, Pair> = {
  16: { dark: LossDark, good: LossGood },
  17: { dark: EndowmentDark, good: EndowmentGood },
  18: { dark: SunkDark, good: SunkGood },
  19: { dark: RiskDark, good: RiskGood },
  20: { dark: ZeroRiskDark, good: ZeroRiskGood },
};
