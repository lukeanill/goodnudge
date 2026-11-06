import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { getPreset } from "@lukeanill/ui/themes/presets";
import { themeToCss } from "@lukeanill/ui/themes/css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Good Nudge",
  description: "Behavioural economics and consumer psychology principles for UX and product.",
};

// The browser's top bar takes this colour (the page colour) instead of picking up the purple of the open card underneath it.
export const viewport: Viewport = { themeColor: "#f7cae7" };

const THEME_ID = "illuzion";
const theme = getPreset(THEME_ID)!;
// Intan is bundled in the package CSS. DM Sans is loaded here with its optical-size axis (Figma sets opsz to the
// font size; the package's own link has no opsz axis, so text came out ~1px narrower). DM Mono is used for the tab counts, Geist Mono for the prompt in the Test your design drawer.
const fontsHref =
  "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..800&family=DM+Mono:wght@400&family=Geist+Mono:wght@500&display=swap";

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
