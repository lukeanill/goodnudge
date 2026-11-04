import data from "@/data/behavioral_principles.json";
import visuals from "@/data/visuals.json";

export type Principle = {
  id: number;
  category: string;
  name: string;
  aka: string[];
  description: string;
  darkPatternExample: string;
  darkPatternRating: number;
  darkPatternReason: string;
  healthyExample: string;
  /** Illustration shown top right on the card (sample content). */
  image?: { src: string; w: number; h: number };
};

export type Category = { name: string; count: number };

export type Content = {
  title: string;
  tagline: string;
  categories: Category[];
  principles: Principle[];
};

const TAGLINE = "A collection of behavioral nudge principles: influence people without deceiving them.";

/**
 * The single place the site reads content from. Today it is the JSON file;
 * a database can replace the body of this function without touching any page.
 */
export async function getContent(): Promise<Content> {
  const images = visuals as Record<string, { src: string; w: number; h: number }>;
  const principles = (data.principles as Principle[]).map((p) => ({ ...p, image: images[String(p.id)] }));
  const categories = data.categories.map((name) => ({
    name,
    count: principles.filter((p) => p.category === name).length,
  }));
  return { title: data.title, tagline: TAGLINE, categories, principles };
}
