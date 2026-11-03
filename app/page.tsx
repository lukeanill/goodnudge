import { getContent } from "@/lib/content";
import { PrinciplesBrowser } from "@/components/principles-browser";

export default async function Home() {
  const { categories, principles } = await getContent();
  return <PrinciplesBrowser categories={categories} principles={principles} />;
}
