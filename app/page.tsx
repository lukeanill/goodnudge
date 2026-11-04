import { getContent } from "@/lib/content";
import { PrinciplesBrowser } from "@/components/principles-browser";

export default async function Home() {
  const { tagline, categories, principles } = await getContent();
  return <PrinciplesBrowser tagline={tagline} categories={categories} principles={principles} />;
}
