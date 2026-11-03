import data from "@/data/behavioral_principles.json";

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
};

export type Category = { name: string; count: number };

export type Content = {
  title: string;
  categories: Category[];
  principles: Principle[];
};

/**
 * The single place the site reads content from. Today it is the JSON file;
 * a database can replace the body of this function without touching any page.
 */
export async function getContent(): Promise<Content> {
  const principles = data.principles as Principle[];
  const categories = data.categories.map((name) => ({
    name,
    count: principles.filter((p) => p.category === name).length,
  }));
  return { title: data.title, categories, principles };
}
