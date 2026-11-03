import { marked } from "marked";
import { supabaseGet } from "./supabase-rest";

// Articles live in the Supabase posts table; RLS returns only published rows.
// content/articles/*.md are the drafts pushed there with `npm run sync:posts`.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  cover: string;
  coverAlt: string;
  readTime: string;
};

type Row = {
  slug: string;
  title: string;
  description: string;
  published_at: string | null;
  category: string;
  cover: string;
  cover_alt: string;
  read_time: string;
  body_md: string;
};

const columns = "slug,title,description,published_at,category,cover,cover_alt,read_time";
const order = "order=published_at.desc.nullslast,sort_order.asc";

function toPost(r: Omit<Row, "body_md">): Post {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    date: r.published_at ?? "",
    category: r.category,
    cover: r.cover,
    coverAlt: r.cover_alt,
    readTime: r.read_time,
  };
}

export async function getPosts(): Promise<Post[]> {
  const rows = await supabaseGet<Omit<Row, "body_md">[]>(`posts?select=${columns}&${order}`, ["posts"]);
  return rows.map(toPost);
}

export async function getPost(slug: string) {
  const rows = await supabaseGet<Row[]>(
    `posts?select=${columns},body_md&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    ["posts"],
  );
  const row = rows[0];
  if (!row) return undefined;
  return { post: toPost(row), html: marked.parse(row.body_md, { async: false }) };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
}
