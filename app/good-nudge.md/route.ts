import { getContent } from "@/lib/content";
import { guidanceMd } from "@/lib/guidance";

// Public, read-only. Claude opens this link from the "Test your design" prompt.
// Revalidates every minute so edits to the principles show up without a deploy.
export const revalidate = 60;

export async function GET() {
  return new Response(guidanceMd(await getContent()), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
