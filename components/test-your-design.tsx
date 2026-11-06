"use client";

import { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@lukeanill/ui/components/drawer";
import { STARTER_PROMPT } from "@/lib/starter-prompt";

// Figma "Test your design" (11:3791): a white 44px pill with a spark icon; opens a bottom drawer with the prompt to copy.
// Drawer fill is the theme foreground token; text is DM Sans medium per the Figma variables.
// The drawer is the package's Drawer. Inside: title, the prompt in a glass box and "Tap to copy".
type CopyState = "idle" | "copied" | "manual";

export function TestYourDesign() {
  const [state, setState] = useState<CopyState>("idle");
  const promptRef = useRef<HTMLPreElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const selectPrompt = () => {
    const el = promptRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(STARTER_PROMPT);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), 2000);
    } catch {
      // Clipboard blocked: select the text so the designer can copy it by hand.
      selectPrompt();
      setState("manual");
    }
  };

  const label = state === "copied" ? "Copied" : state === "manual" ? "Press Ctrl or ⌘ + C to copy" : "Tap to copy";

  return (
    <Drawer onOpenChange={(open) => !open && setState("idle")}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="pointer-events-auto inline-flex h-11 cursor-pointer items-center justify-center gap-[6px] rounded-full border-[0.5px] border-[rgba(242,174,218,0.25)] bg-white pr-[14px] pl-3 max-sm:border-0 max-sm:bg-[#f9f6f8] max-sm:px-4 max-sm:shadow-[-1px_-1px_4px_rgba(255,255,255,0.16),0_8px_24px_rgba(129,41,97,0.12)] text-[16px] leading-none font-medium tracking-normal whitespace-nowrap text-foreground sm:drop-shadow-[0_4px_4px_rgba(68,68,68,0.06)]"
        >
          <img src="/brand/spark.svg" alt="" width={20} height={20} className="block h-5 w-5 max-sm:size-[18px]" />
          Test your design
        </button>
      </DrawerTrigger>
      <DrawerContent className="border-t-0 bg-foreground after:bg-foreground [--glass-overlay-saturate:100%] [backdrop-filter:none] [background-image:none]">
        <div className="mx-auto flex w-full max-w-[571px] flex-col gap-4 px-4 pt-6 pb-10 md:px-10">
          <DrawerTitle className="font-body text-[18px] leading-[1.6] font-medium tracking-normal text-white normal-case">Copy this prompt into Claude to get started</DrawerTitle>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy the prompt"
            className="cursor-pointer rounded-[16px] border border-[rgba(30,30,30,0.32)] bg-[rgba(246,244,244,0.12)] p-6 text-left backdrop-blur-[30px]"
          >
            <pre ref={promptRef} className="font-['Geist_Mono',ui-monospace,monospace] text-[18px] leading-[1.4] font-medium whitespace-pre-wrap text-background">
              {STARTER_PROMPT}
            </pre>
          </button>
          <div className="flex items-center justify-end gap-4 text-[16px] leading-[1.6] font-medium text-white">
            <button type="button" onClick={copy} className="cursor-pointer text-right">
              {label}
            </button>
          </div>
          <span aria-live="polite" className="sr-only">
            {state === "copied" ? "Prompt copied" : ""}
          </span>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
