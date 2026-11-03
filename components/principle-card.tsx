import type { Principle } from "@/lib/content";

// Figma "CARD" (0:143), 468 x 460 at desktop. Every size below is the Figma px value
// expressed in cqw of the 468px card, so the card scales down as a whole on small screens
// (floors keep the smallest text legible).
export function PrincipleCard({ principle, bg, priority }: { principle: Principle; bg: number; priority?: boolean }) {
  // Principle 9 carries a "*Hick's Law..." note inside its description: shown as a footnote.
  const [body, ...note] = principle.description.split(" *");
  const footnote = note.length ? `*${note.join(" *")}` : null;

  const num = String(bg).padStart(2, "0");

  return (
    <div className="@container relative aspect-[468/460] w-full">
      <article className="relative flex size-full flex-col gap-[3.419cqw] overflow-hidden rounded-[min(12px,2.564cqw)] bg-secondary p-[8.547cqw]">
        <img
          src={`/bg/bg-${num}.jpg`}
          srcSet={`/bg/bg-${num}.jpg 1x, /bg/bg-${num}@2x.jpg 2x, /bg/bg-${num}@3x.jpg 3x`}
          alt=""
          width={468}
          height={460}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        <p className="relative text-[max(11px,2.991cqw)] leading-none font-semibold tracking-[0.06em] text-background uppercase">
          {principle.category}
        </p>
        <div className="flex-1" />
        <div className="relative flex flex-col gap-[1.709cqw]">
          <h2 className="font-serif text-[min(36px,7.692cqw)] leading-[1.4] font-normal tracking-normal text-primary">
            {principle.name}
          </h2>
          <div className="flex flex-col pr-[5.128cqw]">
            <p className="text-[max(13px,3.419cqw)] leading-[1.6] font-medium tracking-normal text-white">{body}</p>
            {footnote && (
              <p className="text-[max(13px,3.419cqw)] leading-[1.6] font-medium tracking-normal text-white">{footnote}</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
