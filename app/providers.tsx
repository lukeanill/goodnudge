"use client";

import { ThemeProvider } from "@lukeanill/ui/components/theme-provider";

// The package's ThemeProvider ships without a "use client" directive, so it is
// wrapped here to be usable from the server-rendered root layout.
export function Providers({ themeId, children }: { themeId: string; children: React.ReactNode }) {
  return <ThemeProvider forcedTheme={themeId}>{children}</ThemeProvider>;
}
