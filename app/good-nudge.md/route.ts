import { getContent } from "@/lib/content";
import { guidanceMd } from "@/lib/guidance";

// Public, read-only. Claude opens this link from the "Test your design" prompt.
// Served as text/plain, not text/markdown: some web readers (ChatGPT's, for one) fail to open text/markdown.
// Revalidates every minute so edits to the principles show up without a deploy.
export const revalidate = 60;

export async function GET() {
  return new Response(guidanceMd(await getContent()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
