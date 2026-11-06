import data from "@/data/behavioral_principles.json";
import visuals from "@/data/visuals.json";
import models from "@/data/models.json";

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
  /** 3D model of the illustration (public/models): a still for the grid and table, and the model itself, loaded on hover. */
  model?: { glb: string; still: string; radius: number; distance: number; amp: number; shift: [number, number] };
};

export const SITE_URL = "https://goodnudge.lukeai.space";

/** URL-safe name of a principle: "Aesthetic-Usability Effect" -> "aesthetic-usability-effect". Used for /?principle=... links. */
export const principleSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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
 * Reads from the Neon database (Vercel Storage) when STORAGE_URL (or DATABASE_URL) is set, using Neon's HTTP SQL endpoint
 * so no extra package is needed. Returns null on any failure, so the caller falls back to the JSON file.
 */
async function fromDatabase(): Promise<(Omit<Content, "tagline" | "categories"> & { categoryNames: string[] }) | null> {
  const conn = (process.env.STORAGE_URL ?? process.env.DATABASE_URL)?.trim();
  if (!conn) return null;
  let host: string;
  try {
    host = new URL(conn).hostname;
  } catch {
    return null;
  }
  const query = async <T,>(sql: string): Promise<T[]> => {
    const res = await fetch(`https://${host}/sql`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Neon-Connection-String": conn },
      body: JSON.stringify({ query: sql, params: [] }),
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`db: ${res.status}`);
    return (await res.json()).rows as T[];
  };
  try {
    const [rows, cats, meta] = await Promise.all([
      query<Row>("select * from principles order by id"),
      query<{ name: string }>("select name from categories order by position"),
      query<{ key: string; value: unknown }>("select key, value from meta"),
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
 * The single place the site reads content from: database first, the JSON file as fallback.
 */
export async function getContent(): Promise<Content> {
  const images = visuals as Record<string, { src: string; w: number; h: number }>;
  const db = await fromDatabase();
  const base = db ?? {
    title: data.title,
    scale: data.darkPatternScale,
    scaleNote: data.darkPatternNote,
    categoryNames: data.categories as string[],
    principles: data.principles as Principle[],
  };
  const modelInfo = models as unknown as Record<string, { radius: number; distance: number; amp: number; shift: [number, number] }>;
  const principles = base.principles.map((p) => {
    const image = images[String(p.id)];
    // The model has the same name as the illustration it replaces: /img/anchor.png -> /models/anchor.glb
    const name = image?.src.split("/").pop()?.replace(/\.[a-z]+$/, "") ?? "";
    const info = modelInfo[name];
    return { ...p, image, model: info ? { glb: `/models/${name}.glb`, still: `/models/still/${name}.webp`, radius: info.radius, distance: info.distance, amp: info.amp, shift: info.shift } : undefined };
  });
  const categories = base.categoryNames.map((name) => ({
    name,
    count: principles.filter((p) => p.category === name).length,
  }));
  return { title: base.title, tagline: TAGLINE, categories, principles, scale: base.scale, scaleNote: base.scaleNote };
}
