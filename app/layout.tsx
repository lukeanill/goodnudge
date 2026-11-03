import type { Metadata } from "next";
import { Providers } from "./providers";
import { getPreset } from "@lukeanill/ui/themes/presets";
import { themeToCss, themeFamilies } from "@lukeanill/ui/themes/css";
import { googleFontsHref } from "@lukeanill/ui/themes/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Good Nudge",
  description: "Behavioural economics and consumer psychology principles for UX and product.",
};

const THEME_ID = "illuzion";
const theme = getPreset(THEME_ID)!;
// DM Sans is a Google font (Intan is bundled in the package CSS).
const fontsHref = googleFontsHref(themeFamilies(theme));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Class set on the server so the first paint is already ILLUZION. ThemeProvider
    // keeps it in sync on the client. Ids match what the provider checks for, so it
    // does not inject a second copy of the CSS/font link.
    <html lang="en" className={THEME_ID} data-theme={THEME_ID} suppressHydrationWarning>
      <head>
        <style id="ui-theme-presets" dangerouslySetInnerHTML={{ __html: themeToCss(theme, { asDefault: true }) }} />
        {fontsHref && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link id="ui-theme-fonts" rel="stylesheet" href={fontsHref} />
          </>
        )}
      </head>
      <body>
        <Providers themeId={THEME_ID}>{children}</Providers>
      </body>
    </html>
  );
}
