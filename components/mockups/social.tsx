import type { ComponentType } from "react";
import { Chip, Frame, Jar, Money } from "./art";
import { Box, Cap, Face, Gift, Heart, Line, Lock, Mail, Stars, Tick, Users } from "./kit";

type Pair = { dark: ComponentType; good: ComponentType };

// 21 Social Proof: a made-up number vs a real, dated one.
const ProofDark = () => (
  <Frame>
    <Users className="size-14 text-white" />
    <Money now="2,341" size={48} />
    <Chip>This week</Chip>
  </Frame>
);
const ProofGood = () => (
  <Frame>
    <Users className="size-14 text-white" />
    <div className="flex items-center gap-2">
      <Money now="128" size={48} />
      <Tick className="size-7 text-primary" />
    </div>
    <Chip>Last 7 days</Chip>
  </Frame>
);

// 22 Authority Bias: an expert badge with nobody behind it vs the named expert.
const AuthorityDark = () => (
  <Frame>
    <Jar className="w-[100px]" />
    <Chip active>Dermatologist recommended</Chip>
    <Cap dim>Who?</Cap>
  </Frame>
);
const AuthorityGood = () => (
  <Frame>
    <Jar className="w-[100px]" />
    <Chip active>Dermatologist recommended</Chip>
    <div className="flex items-center gap-2">
      <Face className="size-8" />
      <Cap>Dr. A. Lee</Cap>
    </div>
  </Frame>
);

// 23 Liking / Similarity: a paid review dressed as a customer vs a labelled one, filter by skin like mine.
const Review = () => (
  <Box className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Face className="size-8" />
      <Stars n={5} />
    </div>
    <Line />
    <Line w={70} />
  </Box>
);
const LikingDark = () => (
  <Frame>
    <Review />
  </Frame>
);
const LikingGood = () => (
  <Frame>
    <Chip active>Skin like mine</Chip>
    <Box className="relative flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Face className="size-8" />
        <Stars n={5} />
        <span className="ml-auto">
          <Chip>Paid</Chip>
        </span>
      </div>
      <Line />
      <Line w={70} />
    </Box>
  </Frame>
);

// 24 Reciprocity: a gift, then a daily flood of emails vs a gift with no follow-up.
const ReciprocityDark = () => (
  <Frame>
    <Gift className="size-14 text-primary" />
    <div className="flex gap-1.5">
      {Array.from({ length: 7 }, (_, i) => (
        <Mail key={i} className="size-7 text-white" />
      ))}
    </div>
  </Frame>
);
const ReciprocityGood = () => (
  <Frame>
    <Gift className="size-14 text-primary" />
    <Heart className="size-9 text-white" />
  </Frame>
);

// 25 Commitment & Consistency: results locked behind an email vs results shown straight away.
const Bars = ({ dim }: { dim?: boolean }) => (
  <div className={"flex h-[110px] items-end gap-3 " + (dim ? "opacity-25" : "")}>
    {[42, 78, 58, 100].map((h, i) => (
      <div key={i} className="w-9 rounded-t-[2px] bg-primary" style={{ height: `${h}%` }} />
    ))}
  </div>
);
const CommitmentDark = () => (
  <Frame>
    <div className="relative">
      <Bars dim />
      <Lock className="absolute inset-0 m-auto size-9 text-white" />
    </div>
    <Box className="flex items-center gap-2">
      <Mail className="size-5 text-white" />
      <Line w={60} dim />
    </Box>
  </Frame>
);
const CommitmentGood = () => (
  <Frame>
    <Bars />
    <Chip>Your results</Chip>
  </Frame>
);

export const social: Record<number, Pair> = {
  21: { dark: ProofDark, good: ProofGood },
  22: { dark: AuthorityDark, good: AuthorityGood },
  23: { dark: LikingDark, good: LikingGood },
  24: { dark: ReciprocityDark, good: ReciprocityGood },
  25: { dark: CommitmentDark, good: CommitmentGood },
};
