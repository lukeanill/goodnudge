"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GlassLayer } from "@lukeanill/ui/components/liquid-glass";
import { Effect } from "@lukeanill/ui/components/animate-ui/primitives/effects/effect";
import { principleSlug, type Category, type Principle } from "@/lib/content";
import { Logo } from "./logo";
import { FilterTab } from "./filter-tab";
import { pickAnimated } from "@/lib/animated";
import { PrincipleCard, type CardRect } from "./principle-card";
import { PrincipleRow } from "./principle-row";
import { LayoutToggle, type Layout } from "./layout-toggle";
import { CardOverlay } from "./card-overlay";
import { Footer } from "./footer";
import { TestYourDesign } from "./test-your-design";

// Page-load reveal, in four steps: logo, tagline, (Test your design + tabs + toggle together), cards as one block. Each is the library's
// Effect (slide up + fade on the default spring, stiffness 200 / damping 20: the Storybook "Effect" story), STEP ms apart.
const STEP = 150;
const SLIDE = 24; // px each step travels; the story's default is 100, which is a lot for a logo
const reveal = (step: number, reduce: boolean | null) => ({
  slide: reduce ? false : { offset: SLIDE },
  fade: true,
  delay: 100 + step * STEP,
  ...(reduce ? { transition: { duration: 0 } } : {}),
});

const BG_COUNT = 22; // Figma provides 22 background images; they repeat by card position.

export function PrinciplesBrowser({ tagline, categories, principles }: { tagline: string; categories: Category[]; principles: Principle[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [stuck, setStuck] = useState(false); // tabs are in the glass tray (layout)
  const [glass, setGlass] = useState(false); // the tray's glass is showing; fades in with the move, fades out before the move back
  const [flat, setFlat] = useState(false); // pills have dropped their border and inset shadow; leads stuck going in, trails it coming out
  const [layout, setLayout] = useState<Layout>("cards"); // always starts on cards
  const [open, setOpen] = useState<{ principle: Principle; bg: number; rect: CardRect } | null>(null);
  const [morphing, setMorphing] = useState(false); // layout animation is only on while the tabs morph into the tray; a filter change collapses the page height and would otherwise fling the pill in
  const [filtered, setFiltered] = useState(false); // true after the first filter change, so page load itself does not animate
  const reduce = useReducedMotion();

  const sentinel = useRef<HTMLDivElement>(null);

  // Always open at the top: the browser would otherwise restore the old scroll position on reload and back/forward, which lands
  // part-way down the page while the intro is still animating in.
  useLayoutEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // No tab selected = everything. Cards keep category order as in the JSON.
  const visible = selected.length ? principles.filter((p) => selected.includes(p.category)) : principles;
  // 2 in every 6 cards get live 3D art, picked at random once per visit.
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31));
  const animated = useMemo(() => pickAnimated(visible.length, seed), [visible.length, seed]);
  const changeLayout = (l: Layout) => {
    if (l === layout) return;
    setFiltered(true);
    setLayout(l);
  };
  const toggle = (name: string) => {
    setFiltered(true);
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
  };

  // Deep link: /?principle=anchoring opens that principle's card on load (growing from the middle of the screen).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("principle");
    if (!slug) return;
    const i = principles.findIndex((p) => principleSlug(p.name) === slug);
    if (i < 0) return;
    const [w, h, cw, ch] = [window.innerWidth, window.innerHeight, 309, 388];
    setOpen({ principle: principles[i], bg: (i % BG_COUNT) + 1, rect: { top: (h - ch) / 2, left: (w - cw) / 2, width: cw, height: ch } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the address in step with the open card, so the page can be shared or linked: /?principle=anchoring
  const urlReady = useRef(false);
  useEffect(() => {
    if (!urlReady.current) {
      urlReady.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (open) url.searchParams.set("principle", principleSlug(open.principle.name));
    else url.searchParams.delete("principle");
    if (url.href !== window.location.href) window.history.replaceState(null, "", url.toString());
  }, [open]);

  // The tabs stick 24px from the top. Once they do, they move into a centred glass tray (no logo: it scrolls away).
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // One continuous morph (about 400ms), not three stages. Layout animation has to be on in an earlier render than the change
    // it animates (or it sometimes just jumps), so everything starts at once and the tray state flips two frames later.
    //   Down: pills flatten + toggle fades now; tabs glide into the tray with the glass fading in as they go.
    //   Up:   glass fades now; tabs glide back; pills get their border/shadow back and the toggle returns as they land.
    const ARM = 35; // two frames
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    const io = new IntersectionObserver(([e]) => {
      const toStuck = !e.isIntersecting;
      timers.splice(0).forEach(clearTimeout);
      setMorphing(true);
      if (toStuck) {
        setFlat(true);
        later(() => {
          setStuck(true);
          setGlass(true);
        }, ARM);
      } else {
        setGlass(false);
        later(() => setStuck(false), ARM);
        later(() => setFlat(false), ARM + 200);
      }
      later(() => setMorphing(false), ARM + 700);
    }, { threshold: 0, rootMargin: "-24px 0px 0px 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  // Quick start, soft landing: a lightly damped spring (settles in about 350ms) in place of the slow-in ease-in-out.
  const transition = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.9 };
  const cardVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: reduce ? { duration: 0 } : { duration: 0.35, ease: [0, 0, 0.35, 1] as const, delay: Math.min(i, 7) * 0.05 } }),
  };

  return (
    <div className="relative pt-[76px] md:pt-24 lg:pt-[120px]">
      {/* Top right, 40px in from the edges (Figma); on phones it gets its own row above the logo. Scrolls away with the header. */}
      <Effect {...reveal(2, reduce)} className="absolute top-4 right-4 md:top-10 md:right-10">
        <TestYourDesign />
      </Effect>
      <header className="content flex flex-col items-start">
        <Effect {...reveal(0, reduce)} className="w-full">
          <Logo className="block h-auto w-[507.892px] max-w-full text-primary-foreground min-[1280px]:w-[52.907%]" />
        </Effect>
        <Effect {...reveal(1, reduce)} className="mt-6">
          <p className="min-h-[26px] max-w-[640px] text-[16px] leading-[1.6] font-medium tracking-normal text-foreground">{tagline}</p>
        </Effect>
      </header>

      {/* Marks where the tabs rest; 24px (64px from tablet up) below the tagline in total. */}
      <div ref={sentinel} aria-hidden className="pointer-events-none h-px mt-[23px] md:mt-[63px]" />

      <Effect asChild {...reveal(2, reduce)}>
      <nav className="content sticky top-6 z-10 flex h-9 items-start">
        <motion.div
          layout={morphing ? "position" : false}
          transition={transition}
          className={"relative flex max-w-full items-center " + (stuck ? "mx-auto -my-1 w-fit gap-2 rounded-full p-1" : "w-full justify-between gap-4")}
        >
          {(stuck || glass) && (
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: glass ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
            >
              <GlassLayer weight="heavy" tone="light" tint="rgba(247,202,231,0.6)" radius={22} />
            </motion.div>
          )}
          <motion.div
            layout={morphing ? "position" : false}
            transition={transition}
            className={
              "tabs-scroll relative flex min-w-0 max-[900px]:overflow-x-auto " +
              (stuck ? "gap-1 drop-shadow-[0_8px_8px_rgba(68,68,68,0.06)]" : "gap-[6px]")
            }
          >
            {categories.map((c) => (
              <FilterTab
                key={c.name}
                label={c.name}
                count={c.count}
                pressed={selected.includes(c.name)}
                tray={flat}
                onToggle={() => toggle(c.name)}
              />
            ))}
          </motion.div>
          {/* The cards/table toggle stays mounted and never moves: it only fades out as the pills go flat and back in once they are
              restored. While the tray is up it is taken out of the flow (invisible by then) so the tray hugs the tabs. */}
          <motion.div
            inert={flat}
            className={stuck ? "absolute top-1 right-1" : "relative shrink-0"}
            initial={false}
            animate={{ opacity: flat ? 0 : 1 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: "easeOut" }}
          >
            <LayoutToggle layout={layout} onChange={changeLayout} />
          </motion.div>
        </motion.div>
      </nav>
      </Effect>

      {/* Keyed by the selection: a filter change re-mounts the grid and the cards rise in (first 8 staggered). */}
      <Effect {...reveal(3, reduce)}>
      <motion.main
        key={layout + "|" + selected.join("|")}
        className={"content py-10 " + (layout === "cards" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-1")}
      >
        {visible.map((p, i) => (
          <motion.div
            key={p.id}
            custom={i}
            initial={filtered ? "hidden" : false}
            animate="show"
            variants={cardVariants}
            className={layout === "table" ? "overflow-hidden first:rounded-t-[8px] last:rounded-b-[8px]" : "h-full"}
          >
            {layout === "cards" ? (
              <PrincipleCard principle={p} bg={(i % BG_COUNT) + 1} priority={i < 4} animate={animated[i]} onOpen={(principle, bg, rect) => setOpen({ principle, bg, rect })} />
            ) : (
              <PrincipleRow principle={p} bg={(i % BG_COUNT) + 1} alt={i % 2 === 1} onOpen={(principle, bg, rect) => setOpen({ principle, bg, rect })} />
            )}
          </motion.div>
        ))}
      </motion.main>
      </Effect>
      <Footer />
      {open && <CardOverlay key={open.principle.id} principle={open.principle} bg={open.bg} origin={open.rect} onClosed={() => setOpen(null)} />}
    </div>
  );
}
