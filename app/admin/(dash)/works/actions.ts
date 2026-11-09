"use server";

import { revalidatePath, updateTag } from "next/cache";
import { currentCmsUser, serverClient } from "@/lib/cms/server";
import { workCategories } from "@/lib/work-categories";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type NewPhoto = { path: string; width: number; height: number };

const NO_ACCESS: ActionResult = { ok: false, error: "ไม่มีสิทธิ์แก้ไขผลงาน" };
const BUCKET = "works";
const MAX_NAME = 200;

// Public pages read work_photos under this tag (lib/works.ts); the paths cover the prerendered pages.
const refresh = () => {
  updateTag("work_photos");
  revalidatePath("/works", "layout");
};

const fail = (error: { message: string } | null): ActionResult | null => (error ? { ok: false, error: error.message } : null);

const validService = (s: string) => workCategories.some((c) => c.slug === s);
const validPhoto = (service: string, p: NewPhoto) =>
  typeof p.path === "string" &&
  new RegExp(`^${service}/[\\w-]+\\.(webp|jpg)$`).test(p.path) &&
  Number.isInteger(p.width) &&
  Number.isInteger(p.height) &&
  p.width > 0 &&
  p.height > 0;
const cleanName = (s: string) => s.replace(/\s+/g, " ").trim();

async function guard() {
  return (await currentCmsUser()) ? serverClient() : null;
}

/** Adds uploaded photos to the end of a project; a new project name starts a new project at the bottom. */
export async function addPhotos(service: string, project: string, photos: NewPhoto[]): Promise<ActionResult> {
  const sb = await guard();
  if (!sb) return NO_ACCESS;
  const name = cleanName(project);
  if (!validService(service)) return { ok: false, error: "ไม่พบประเภทผลงานนี้" };
  if (!name || name.length > MAX_NAME) return { ok: false, error: "กรุณาใส่ชื่อโครงการ (ไม่เกิน 200 ตัวอักษร)" };
  if (!photos.length || !photos.every((p) => validPhoto(service, p))) return { ok: false, error: "รูปนี้ใช้ไม่ได้" };

  const { data: last, error: readError } = await sb
    .from("work_photos")
    .select("sort_order")
    .eq("service", service)
    .order("sort_order", { ascending: false })
    .limit(1);
  if (readError) return fail(readError)!;
  const start = (last?.[0]?.sort_order ?? -1) + 1;

  const { error } = await sb.from("work_photos").insert(
    photos.map((p, i) => ({ service, project: name, path: p.path, width: p.width, height: p.height, sort_order: start + i })),
  );
  if (error) return fail(error)!;
  refresh();
  return { ok: true };
}

/** Swaps the picture of one photo, keeping its place, then removes the old file. */
export async function replacePhoto(id: string, photo: NewPhoto): Promise<ActionResult> {
  const sb = await guard();
  if (!sb) return NO_ACCESS;
  const { data: row, error: readError } = await sb.from("work_photos").select("service, path").eq("id", id).maybeSingle();
  if (readError) return fail(readError)!;
  if (!row) return { ok: false, error: "ไม่พบรูปนี้ อาจถูกลบไปแล้ว" };
  if (!validPhoto(row.service, photo)) return { ok: false, error: "รูปนี้ใช้ไม่ได้" };

  const { error } = await sb.from("work_photos").update({ path: photo.path, width: photo.width, height: photo.height }).eq("id", id);
  if (error) return fail(error)!;
  await sb.storage.from(BUCKET).remove([row.path]);
  refresh();
  return { ok: true };
}

/** Deletes photos and their files. */
export async function deletePhotos(ids: string[]): Promise<ActionResult> {
  const sb = await guard();
  if (!sb) return NO_ACCESS;
  if (!ids.length) return { ok: true };
  const { data: rows, error } = await sb.from("work_photos").delete().in("id", ids).select("path");
  if (error) return fail(error)!;
  const paths = (rows ?? []).map((r) => r.path);
  // A file left behind costs a little storage; a failed row delete would show a broken picture.
  if (paths.length) await sb.storage.from(BUCKET).remove(paths);
  refresh();
  return { ok: true };
}

/** Renames a project. Renaming to an existing name merges the two. */
export async function renameProject(service: string, from: string, to: string): Promise<ActionResult> {
  const sb = await guard();
  if (!sb) return NO_ACCESS;
  const name = cleanName(to);
  if (!name || name.length > MAX_NAME) return { ok: false, error: "กรุณาใส่ชื่อโครงการ (ไม่เกิน 200 ตัวอักษร)" };
  const { error } = await sb.from("work_photos").update({ project: name }).eq("service", service).eq("project", from);
  if (error) return fail(error)!;
  refresh();
  return { ok: true };
}

/** Saves the order of every photo in a service. Project order follows each project's first photo. */
export async function reorderPhotos(ids: string[]): Promise<ActionResult> {
  const sb = await guard();
  if (!sb) return NO_ACCESS;
  const { error } = await sb.rpc("cms_reorder_work_photos", { p_ids: ids });
  if (error) return fail(error)!;
  refresh();
  return { ok: true };
}
