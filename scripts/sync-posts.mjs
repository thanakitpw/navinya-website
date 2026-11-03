// Push content/articles/NN-slug.md into the Supabase posts table (upsert by slug).
// Usage: npm run sync:posts [-- --draft]   (new rows default to published)
// Overwrites edits made to the same slug in the Supabase dashboard.
import fs from "node:fs";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local");

const status = process.argv.includes("--draft") ? "draft" : "published";
const dir = path.join(process.cwd(), "content/articles");

function field(front, name) {
  const m = front.match(new RegExp(`^${name}: "?(.*?)"?$`, "m"));
  return m ? m[1] : "";
}

function read(file) {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const end = raw.indexOf("\n---", 3);
  const front = raw.slice(3, end);
  const keywords = field(front, "keyword_รอง");
  return {
    slug: field(front, "slug"),
    title: field(front, "title"),
    description: field(front, "description"),
    category: field(front, "category"),
    cover: field(front, "cover"),
    cover_alt: field(front, "cover_alt"),
    read_time: field(front, "เวลาอ่าน"),
    keyword_main: field(front, "keyword_หลัก") || null,
    keywords: keywords.startsWith("[") ? JSON.parse(keywords) : [],
    author: field(front, "ผู้เขียน") || null,
    // The page renders the H1 itself, so drop it from the body.
    body_md: raw.slice(end + 4).replace(/^\s*# .*\n/, "").trim(),
    published_at: field(front, "date") || null,
    sort_order: Number(file.slice(0, 2)),
    status,
  };
}

const rows = fs
  .readdirSync(dir)
  .filter((f) => /^\d{2}-.+\.md$/.test(f))
  .sort()
  .map(read);

const res = await fetch(`${url}/rest/v1/posts?on_conflict=slug`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify(rows),
});
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
console.log(`synced ${rows.length} posts as ${status}: ${rows.map((r) => r.slug).join(", ")}`);
