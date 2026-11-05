import { cache } from "react";
import { CONTENT, type Content, type Scope } from "@/lib/content";
import { supabaseGet } from "@/lib/supabase-rest";
import { applyCopy, type Override } from "./copy";
import { inPreview, serverClient } from "./server";

export const CMS_TAG = "cms";

type CopyRow = { key: string; published_value: string; source_hash: string | null };
type ImageRow = { src: string; published_url: string };

// A failed read must never take the public site down: fall back to the defaults in code.
async function publishedCopy(scope: Scope): Promise<Map<string, Override>> {
  try {
    const rows = await supabaseGet<CopyRow[]>(
      `site_copy?select=key,published_value,source_hash&page=eq.${scope}&published_value=not.is.null`,
      [CMS_TAG],
    );
    return new Map(rows.map((r) => [r.key, { value: r.published_value, hash: r.source_hash }]));
  } catch (err) {
    console.error(`[cms] reading copy for ${scope} failed:`, err);
    return new Map();
  }
}

async function draftCopy(scope: Scope): Promise<Map<string, Override>> {
  const sb = await serverClient();
  const { data } = await sb.from("site_copy").select("key, draft_value, source_hash").eq("page", scope);
  return new Map(
    (data ?? [])
      .filter((r) => r.draft_value !== null)
      .map((r) => [r.key as string, { value: r.draft_value as string, hash: r.source_hash as string | null }]),
  );
}

const load = cache(async (scope: Scope) => {
  const preview = await inPreview();
  const overrides = preview ? await draftCopy(scope) : await publishedCopy(scope);
  return applyCopy(CONTENT[scope] as unknown, overrides, preview ? scope : null);
});

/** A page's text: defaults from code with published edits on top, or drafts in the admin preview. */
export async function getCopy<S extends Scope>(scope: S): Promise<Content[S]> {
  return (await load(scope)) as Content[S];
}

/** Replaced images, keyed by the image's original path. */
export const getImageOverrides = cache(async (): Promise<Record<string, string>> => {
  if (await inPreview()) {
    const sb = await serverClient();
    const { data } = await sb.from("site_images").select("src, draft_url");
    return Object.fromEntries((data ?? []).filter((r) => r.draft_url).map((r) => [r.src, r.draft_url]));
  }
  try {
    const rows = await supabaseGet<ImageRow[]>(
      "site_images?select=src,published_url&published_url=not.is.null",
      [CMS_TAG],
    );
    return Object.fromEntries(rows.map((r) => [r.src, r.published_url]));
  } catch (err) {
    console.error("[cms] reading images failed:", err);
    return {};
  }
});
