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
  /** The 1 to 5 dark pattern scale and its note, used by the guidance page for Claude. */
  scale: Record<string, string>;
  scaleNote: string;
};

const TAGLINE = "A collection of behavioral nudge principles: influence people without deceiving them.";

type Row = {
  id: number; category: string; name: string; aka: string[]; description: string;
  dark_pattern_example: string; dark_pattern_rating: number; dark_pattern_reason: string; healthy_example: string;
};

/**
 * Reads from Supabase when the `goodnudge` env var ("<project url> <publishable key>") is set.
 * Returns null on any failure, so the caller falls back to the JSON file.
 */
async function fromSupabase(): Promise<Omit<Content, "tagline" | "categories"> & { categoryNames: string[] } | null> {
  const raw = process.env.goodnudge?.trim();
  if (!raw) return null;
  const [url, key] = raw.split(/\s+/);
  if (!url || !key) return null;
  const get = async <T,>(table: string, query = "select=*"): Promise<T> => {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`${table}: ${res.status}`);
    return res.json();
  };
  try {
    const [rows, cats, meta] = await Promise.all([
      get<Row[]>("principles", "select=*&order=id"),
      get<{ position: number; name: string }[]>("categories", "select=*&order=position"),
      get<{ key: string; value: unknown }[]>("meta"),
    ]);
    if (!rows.length || !cats.length) return null;
    const m = Object.fromEntries(meta.map((r) => [r.key, r.value]));
    return {
      title: String(m.title ?? data.title),
      scale: (m.darkPatternScale as Record<string, string>) ?? data.darkPatternScale,
      scaleNote: String(m.darkPatternNote ?? data.darkPatternNote),
      categoryNames: cats.map((c) => c.name),
      principles: rows.map((r) => ({
        id: r.id, category: r.category, name: r.name, aka: r.aka, description: r.description,
        darkPatternExample: r.dark_pattern_example, darkPatternRating: r.dark_pattern_rating,
        darkPatternReason: r.dark_pattern_reason, healthyExample: r.healthy_example,
      })),
    };
  } catch {
    return null;
  }
}

/**
 * The single place the site reads content from: Supabase first, the JSON file as fallback.
 */
export async function getContent(): Promise<Content> {
  const images = visuals as Record<string, { src: string; w: number; h: number }>;
  const db = await fromSupabase();
  const base = db ?? {
    title: data.title,
    scale: data.darkPatternScale,
    scaleNote: data.darkPatternNote,
    categoryNames: data.categories as string[],
    principles: data.principles as Principle[],
  };
  const principles = base.principles.map((p) => ({ ...p, image: images[String(p.id)] }));
  const categories = base.categoryNames.map((name) => ({
    name,
    count: principles.filter((p) => p.category === name).length,
  }));
  return { title: base.title, tagline: TAGLINE, categories, principles, scale: base.scale, scaleNote: base.scaleNote };
}
