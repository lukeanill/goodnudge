import type { Content } from "./content";

// The Good Nudge skill for Claude, built from the site's content so the two never drift apart.
// The zip holds good-nudge/SKILL.md (the flow) and good-nudge/principles.md (all principles).

export type Scale = Record<string, string>;

const EXAMPLE =
  "We believe that showing the full price, including delivery, on the product page will make shoppers trust the price. To test that we will show the full price to half of our visitors and measure checkout completion and return rate.";

export function skillMd(): string {
  return `---
name: good-nudge
description: Reviews a designer's experiment and designs against the 43 Good Nudge behavioral principles, separating good nudges from dark patterns. Use when a designer wants to test, review or sanity-check a nudge, such as pricing, choice, urgency, social proof, defaults or trust cues.
---

# Good Nudge

Help a designer test a behavioral design idea without deceiving people. Work through the steps in order, one step per message. Write in plain design language, in US English.

## Step 1: The experiment

Ask the designer to describe their experiment in this format, and show the example:

> We believe that ___
> To test that we will ___
> and measure ___

Example: "${EXAMPLE}"

If any of the three parts is missing, vague or not measurable, ask one short follow-up. Do not move on until all three are clear.

## Step 2: The designs

Ask for the designs: screenshots, a Figma link, or a written description. If there is a control and a test version, ask for both. If a Figma link can't be opened, ask for screenshots instead. If the designer has no designs yet, offer to review the written description, and say that the review will be less precise.

## Step 3: The review

Read principles.md first. Then:

1. Pick the principles that are really at work in this design. Usually 2 to 5. Never list a principle just to fill space.
2. For each one, compare the design with that principle's dark pattern example and its good nudge example. Rate the design on the 1 to 5 scale in principles.md. The rating judges this design, not the principle.
3. Run the fairness check: would a user feel tricked if they knew exactly how this works? Is everything they need to decide visible at the moment they decide? Is it easy to say no or undo it?

## Step 4: The output

Keep it to one screen. Use these five parts, in this order:

1. **Verdict.** One line: good nudge, risky nudge, or dark pattern, and why.
2. **Principles in play.** A short table: principle (with its number), where it shows in the design, rating 1 to 5, one-line note.
3. **Fairness check.** Three lines, one per question, each answered yes or no with a reason.
4. **Top 3 changes.** Concrete and in priority order. Say what to change on the screen, not just what to think about.
5. **Sharper experiment.** Rewrite their "We believe / To test that we will / and measure" with the fixes applied, and add one guardrail measure that would show harm, such as refunds, complaints, returns or repeat visits.

End by offering to review a revised version.

## Rules

- Be specific to what you can see. Quote the real words and elements from the design.
- Don't invent features or screens that aren't there.
- Don't call something a dark pattern without saying exactly why.
- If the design is good, say so plainly. Don't hunt for problems.
- Use only the principles in principles.md unless the designer asks for more.
`;
}

export function principlesMd(c: Content, scale: Scale, scaleNote: string): string {
  const head = `# Good Nudge principles

${c.title}. Examples use a fictional online beauty store.

## Dark pattern scale

${Object.entries(scale)
  .map(([n, t]) => `- ${n}: ${t}`)
  .join("\n")}

${scaleNote}
`;
  const body = c.principles
    .map(
      (p) => `## ${p.id}. ${p.name} (${p.category})${p.aka.length ? `\nAlso known as: ${p.aka.join(", ")}` : ""}

${p.description}

- Dark pattern, rated ${p.darkPatternRating}: ${p.darkPatternExample} ${p.darkPatternReason}
- Good nudge: ${p.healthyExample}
`,
    )
    .join("\n");
  return `${head}\n${body}`;
}

/** The short prompt the designer copies from the popup. */
export const STARTER_PROMPT = `Use the Good Nudge skill.

I want to test a design change. Ask me to describe my experiment, then ask for my designs, then review them against the Good Nudge principles.

If you can't find the skill, tell me and I'll add it.`;
