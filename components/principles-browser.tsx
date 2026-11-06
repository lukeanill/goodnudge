"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GlassLayer } from "@lukeanill/ui/components/liquid-glass";
import type { Category, Principle } from "@/lib/content";
import { Logo } from "./logo";
import { FilterTab } from "./filter-tab";
import { PrincipleCard, type CardRect } from "./principle-card";
import { PrincipleRow } from "./principle-row";
import { LayoutToggle, type Layout } from "./layout-toggle";
import { CardOverlay } from "./card-overlay";
import { Footer } from "./footer";
import { TestYourDesign } from "./test-your-design";

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

  // No tab selected = everything. Cards keep category order as in the JSON.
  const visible = selected.length ? principles.filter((p) => selected.includes(p.category)) : principles;
  const changeLayout = (l: Layout) => {
    if (l === layout) return;
    setFiltered(true);
    setLayout(l);
  };
  const toggle = (name: string) => {
    setFiltered(true);
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
  };

  // The tabs stick 24px from the top. Once they do, they move into a centred glass tray (no logo: it scrolls away).
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // Sequenced so it reads the same every time (layout animation has to be on in an earlier render than the change it
    // animates, or it sometimes just jumps).
    //   Down: pills go flat + toggle fades (STEP) -> layout armed -> tray state flips: tabs glide, glass fades in.
    //   Up:   glass fades out (STEP) -> layout armed -> tabs glide back -> pills get their border/shadow back, toggle returns.
    const STEP = 90; // the move starts while the pills / glass are mostly faded, not after they finish
    const ARM = 35; // two frames
    const MOVE = 400;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    const io = new IntersectionObserver(([e]) => {
      const toStuck = !e.isIntersecting;
      timers.splice(0).forEach(clearTimeout);
      if (toStuck) {
        setFlat(true);
        later(() => setMorphing(true), STEP);
        later(() => {
          setStuck(true);
          setGlass(true);
        }, STEP + ARM);
      } else {
        setGlass(false);
        later(() => setMorphing(true), STEP);
        later(() => setStuck(false), STEP + ARM);
        later(() => setFlat(false), STEP + ARM + MOVE - 100);
      }
      later(() => setMorphing(false), STEP + ARM + MOVE + 300);
    }, { threshold: 0, rootMargin: "-24px 0px 0px 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const transition = reduce ? { duration: 0 } : { duration: 0.4, ease: [0.8, 0, 0.2, 1] as const };
  const cardVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: reduce ? { duration: 0 } : { duration: 0.35, ease: [0, 0, 0.35, 1] as const, delay: Math.min(i, 7) * 0.05 } }),
  };

  return (
    <div className="relative pt-[76px] md:pt-24 lg:pt-[120px]">
      {/* Top right, 40px in from the edges (Figma); on phones it gets its own row above the logo. Scrolls away with the header. */}
      <div className="absolute top-4 right-4 md:top-10 md:right-10">
        <TestYourDesign />
      </div>
      <header className="content flex flex-col items-start">
        <Logo className="block h-auto w-[507.892px] max-w-full text-primary-foreground min-[1280px]:w-[52.907%]" />
        <p className="mt-6 min-h-[26px] max-w-[640px] text-[16px] leading-[1.6] font-medium tracking-normal text-foreground">{tagline}</p>
      </header>

      {/* Marks where the tabs rest; 24px (64px from tablet up) below the tagline in total. */}
      <div ref={sentinel} aria-hidden className="pointer-events-none h-px mt-[23px] md:mt-[63px]" />

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

      {/* Keyed by the selection: a filter change re-mounts the grid and the cards rise in (first 8 staggered). */}
      <motion.main
        key={layout + "|" + selected.join("|")}
        className={"content py-10 " + (layout === "cards" ? "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6" : "flex flex-col gap-1")}
      >
        {visible.map((p, i) => (
          <motion.div
            key={p.id}
            custom={i}
            initial={filtered ? "hidden" : false}
            animate="show"
            variants={cardVariants}
            className={layout === "table" ? "overflow-hidden first:rounded-t-[8px] last:rounded-b-[8px]" : undefined}
          >
            {layout === "cards" ? (
              <PrincipleCard principle={p} bg={(i % BG_COUNT) + 1} priority={i < 4} onOpen={(principle, bg, rect) => setOpen({ principle, bg, rect })} />
            ) : (
              <PrincipleRow principle={p} bg={(i % BG_COUNT) + 1} alt={i % 2 === 1} onOpen={(principle, bg, rect) => setOpen({ principle, bg, rect })} />
            )}
          </motion.div>
        ))}
      </motion.main>
      <Footer />
      {open && <CardOverlay key={open.principle.id} principle={open.principle} bg={open.bg} origin={open.rect} onClosed={() => setOpen(null)} />}
    </div>
  );
}
