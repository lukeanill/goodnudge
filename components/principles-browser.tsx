"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Category, Principle } from "@/lib/content";
import { Logo } from "./logo";
import { FilterTab } from "./filter-tab";
import { PrincipleCard } from "./principle-card";

const BG_COUNT = 22; // Figma provides 22 background images; they repeat by card position.
const BAR_HEIGHT = 70; // sticky bar: 16 top + 38 tabs + 16 bottom

export function PrinciplesBrowser({ categories, principles }: { categories: Category[]; principles: Principle[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [stuck, setStuck] = useState(false);
  const [boxHeight, setBoxHeight] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const sentinel = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  // No tab selected = everything. Cards keep category order as in the JSON.
  const visible = selected.length ? principles.filter((p) => selected.includes(p.category)) : principles;
  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  // "On scroll: logo and filters animate into a sticky header": triggered once the header reaches the top.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lock the header's height to its resting (large) size so the page below never jumps when it collapses.
  useLayoutEffect(() => {
    if (stuck || !inner.current) return;
    const measure = () => inner.current && setBoxHeight(inner.current.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner.current);
    return () => ro.disconnect();
  }, [stuck]);

  const transition = reduce ? { duration: 0 } : { duration: 0.4, ease: [0, 0, 0.35, 1] as const };

  return (
    <div className="pt-12 pb-16 md:pt-24 md:pb-24 lg:pt-[120px] lg:pb-[120px]">
      <header
        className="sticky z-10 flex flex-col justify-end"
        style={{ top: boxHeight ? -(boxHeight - BAR_HEIGHT) : 0, minHeight: boxHeight ?? undefined }}
      >
        <div ref={sentinel} aria-hidden className="pointer-events-none absolute top-0 left-0 h-px w-px" />
        <div ref={inner} className="relative">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-background/65 backdrop-blur-[40px]"
            initial={false}
            animate={{ opacity: stuck ? 1 : 0 }}
            transition={transition}
          />
          <div
            className={
              "content relative flex gap-x-2 " +
              (stuck ? "flex-row items-center pt-4 pb-4" : "flex-col items-start pt-0 pb-4")
            }
          >
            <motion.div
              layout
              transition={transition}
              className={stuck ? "mr-6 w-[115.798px] max-w-[35%] shrink-0" : "w-[507.892px] max-w-full min-[1280px]:w-[52.907%]"}
            >
              <Logo className="block h-auto w-full text-primary-foreground" />
            </motion.div>
            <motion.div
              layout="position"
              transition={transition}
              className={
                "tabs-scroll flex min-w-0 gap-2 overflow-x-auto " +
                (stuck ? "flex-1" : "mt-6 w-full md:mt-16")
              }
            >
              {categories.map((c) => (
                <FilterTab
                  key={c.name}
                  label={c.name}
                  count={c.count}
                  pressed={selected.includes(c.name)}
                  onToggle={() => toggle(c.name)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      <main className="content grid grid-cols-1 gap-4 py-10 md:grid-cols-2 md:gap-6">
        {visible.map((p, i) => (
          <PrincipleCard key={p.id} principle={p} bg={(i % BG_COUNT) + 1} priority={i < 4} />
        ))}
      </main>
    </div>
  );
}
