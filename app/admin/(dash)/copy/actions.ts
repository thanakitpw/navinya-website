"use server";

import { revalidatePath, updateTag } from "next/cache";
import { COPY_PAGES, CONTENT, type Scope } from "@/lib/content";
import { collectCopy, hashText } from "@/lib/cms/copy";
import { CMS_TAG } from "@/lib/cms/read";
import { currentCmsUser, serverClient } from "@/lib/cms/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const NO_ACCESS: ActionResult = { ok: false, error: "ไม่มีสิทธิ์แก้ไขเนื้อหา" };
const MAX_TEXT = 5000;

const scopesOf = (page: string): Scope[] | null => {
  const meta = COPY_PAGES[page];
  return meta ? [...new Set<Scope>([meta.scope, "global"])] : null;
};

/**
 * Saves a draft. `edits` holds only the texts that differ from their code default, keyed
 * "scope:path". A text left out went back to its default: an unpublished row is removed, while a
 * published row keeps serving visitors and is cleared on the next publish.
 */
export async function saveCopy(page: string, edits: Record<string, string>): Promise<ActionResult> {
  const user = await currentCmsUser();
  if (!user) return NO_ACCESS;
  const scopes = scopesOf(page);
  if (!scopes) return { ok: false, error: "ไม่พบหน้านี้" };

  const sb = await serverClient();
  for (const scope of scopes) {
    const defaults = new Map(collectCopy(CONTENT[scope]).map((e) => [e.path, e.value]));
    const rows: { page: string; key: string; draft_value: string; source_hash: string; updated_by: string; updated_at: string }[] = [];
    for (const [full, value] of Object.entries(edits)) {
      if (!full.startsWith(`${scope}:`)) continue;
      const key = full.slice(scope.length + 1);
      const fallback = defaults.get(key);
      if (fallback === undefined) continue; // Unknown key: not part of this page any more.
      if (typeof value !== "string" || value.length > MAX_TEXT) {
        return { ok: false, error: `ข้อความยาวเกิน ${MAX_TEXT} ตัวอักษร` };
      }
      rows.push({
        page: scope,
        key,
        draft_value: value,
        source_hash: hashText(fallback),
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      });
    }

    if (rows.length) {
      const { error } = await sb.from("site_copy").upsert(rows, { onConflict: "page,key" });
      if (error) return { ok: false, error: error.message };
    }

    const keep = new Set(rows.map((r) => r.key));
    const { data: existing, error: readError } = await sb.from("site_copy").select("key, published_value").eq("page", scope);
    if (readError) return { ok: false, error: readError.message };

    const reverted = (existing ?? []).filter((r) => !keep.has(r.key));
    const remove = reverted.filter((r) => r.published_value === null).map((r) => r.key);
    const clear = reverted.filter((r) => r.published_value !== null).map((r) => r.key);
    if (remove.length) {
      const { error } = await sb.from("site_copy").delete().eq("page", scope).in("key", remove);
      if (error) return { ok: false, error: error.message };
    }
    if (clear.length) {
      const { error } = await sb.from("site_copy").update({ draft_value: null, updated_by: user.id }).eq("page", scope).in("key", clear);
      if (error) return { ok: false, error: error.message };
    }
  }
  return { ok: true };
}

/** Saves changed images as drafts. An empty url means back to the original picture. */
export async function saveImages(changes: Record<string, string>): Promise<ActionResult> {
  const user = await currentCmsUser();
  if (!user) return NO_ACCESS;
  const allowed = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-media/`;
  const sb = await serverClient();

  for (const [src, url] of Object.entries(changes)) {
    if (!src.startsWith("/") || (url && !url.startsWith(allowed))) return { ok: false, error: "รูปนี้ใช้ไม่ได้" };
    if (url) {
      const { error } = await sb
        .from("site_images")
        .upsert({ src, draft_url: url, updated_by: user.id, updated_at: new Date().toISOString() }, { onConflict: "src" });
      if (error) return { ok: false, error: error.message };
      continue;
    }
    const { error: removeError } = await sb.from("site_images").delete().eq("src", src).is("published_url", null);
    if (removeError) return { ok: false, error: removeError.message };
    const { error } = await sb.from("site_images").update({ draft_url: null, updated_by: user.id }).eq("src", src);
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** Publishes this page's text, the shared text, and the given images, then refreshes the live site. */
export async function publishPage(page: string, images: string[]): Promise<ActionResult> {
  if (!(await currentCmsUser())) return NO_ACCESS;
  const scopes = scopesOf(page);
  if (!scopes) return { ok: false, error: "ไม่พบหน้านี้" };

  const sb = await serverClient();
  const { error } = await sb.rpc("cms_publish_pages", { p_pages: scopes, p_images: images });
  if (error) return { ok: false, error: error.message };

  updateTag(CMS_TAG);
  revalidatePath("/", "layout");
  return { ok: true };
}
