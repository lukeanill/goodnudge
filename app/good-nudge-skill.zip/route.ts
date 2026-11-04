import { zipSync, strToU8 } from "fflate";
import { getContent } from "@/lib/content";
import { principlesMd, skillMd } from "@/lib/skill";

// The Good Nudge skill as a zip, built from the site content at build time.
export const dynamic = "force-static";

export async function GET() {
  const content = await getContent();
  const zip = zipSync({
    "good-nudge/SKILL.md": strToU8(skillMd()),
    "good-nudge/principles.md": strToU8(principlesMd(content)),
  });
  return new Response(zip as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="good-nudge-skill.zip"',
    },
  });
}
