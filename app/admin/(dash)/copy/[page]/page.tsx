import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyEditor, type EntryView } from "@/components/admin/copy-editor";
import { COPY_PAGES, CONTENT, labelOfKey, type Scope } from "@/lib/content";
import { collectCopy, hashText } from "@/lib/cms/copy";
import { serverClient } from "@/lib/cms/server";

export const dynamic = "force-dynamic";

export default async function EditCopyPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!Object.hasOwn(COPY_PAGES, page)) notFound();
  const meta = COPY_PAGES[page];
  const scopes = [...new Set<Scope>([meta.scope, "global"])];

  const sb = await serverClient();
  const [{ data: copyRows }, { data: imageRows }] = await Promise.all([
    sb.from("site_copy").select("page, key, draft_value, source_hash").in("page", scopes),
    sb.from("site_images").select("src, draft_url"),
  ]);
  const saved = new Map((copyRows ?? []).map((r) => [`${r.page}:${r.key}`, r]));

  const entries: EntryView[] = scopes.flatMap((scope) =>
    collectCopy(CONTENT[scope]).map((d) => {
      const key = `${scope}:${d.path}`;
      const hit = saved.get(key);
      // A default rewritten in code wins over an older edit, so show what the live page shows.
      const stale = Boolean(hit?.source_hash && hit.source_hash !== hashText(d.value));
      const focused = Boolean(meta.focus && (d.path === meta.focus || d.path.startsWith(`${meta.focus}.`)));
      return {
        key,
        label: labelOfKey(key),
        fallback: d.value,
        value: !stale && hit?.draft_value != null ? hit.draft_value : d.value,
        stale,
        // Own text always shows. Shared text shows when it appears on this page.
        always: page === "global" || focused || (scope !== "global" && scope === meta.scope),
        attributeOnly: /(^|\.)(alt|imageAlt|heroAlt|registrationAlt|areaPlaceholder|detailPlaceholder)$/.test(d.path),
      };
    }),
  );

  const images = Object.fromEntries((imageRows ?? []).filter((r) => r.draft_url).map((r) => [r.src, r.draft_url as string]));

  return (
    <>
      <div className="adm-edit-head">
        <Link href="/admin/copy">← กลับไปรายการหน้าเว็บ</Link>
        <h1 className="adm-title">{meta.label}</h1>
      </div>
      <CopyEditor page={page} label={meta.label} path={meta.path} entries={entries} images={images} />
    </>
  );
}
