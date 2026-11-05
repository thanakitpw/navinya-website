import Link from "next/link";
import { COPY_PAGES, CONTENT } from "@/lib/content";
import { collectCopy } from "@/lib/cms/copy";
import { serverClient } from "@/lib/cms/server";

export const dynamic = "force-dynamic";

export default async function CopyIndexPage() {
  const sb = await serverClient();
  const { data } = await sb.from("site_copy").select("page, key, draft_value, published_value");
  const rows = data ?? [];

  const pages = Object.entries(COPY_PAGES).map(([key, meta]) => {
    const inScope = (path: string) => !meta.focus || path === meta.focus || path.startsWith(`${meta.focus}.`);
    const own = rows.filter((r) => r.page === meta.scope && inScope(r.key));
    return {
      key,
      ...meta,
      total: collectCopy(CONTENT[meta.scope]).filter((e) => inScope(e.path)).length,
      edited: own.filter((r) => r.draft_value !== null).length,
      dirty: own.filter((r) => r.draft_value !== r.published_value).length,
    };
  });
  const groups = [...new Set(pages.map((p) => p.group))];
  const total = Object.values(CONTENT).reduce((n, c) => n + collectCopy(c).length, 0);

  return (
    <div className="adm-page">
      <h1 className="adm-title">ข้อความและรูปในหน้าเว็บ</h1>
      <p className="adm-sub">เลือกหน้าที่ต้องการแก้ แก้แล้วกดเผยแพร่ขึ้นเว็บได้ทันที โดยไม่ต้องแก้โค้ด รวมทั้งหมด {total} จุด</p>

      {groups.map((g) => (
        <section key={g} className="adm-group">
          <h2>{g}</h2>
          <ul className="adm-card">
            {pages
              .filter((p) => p.group === g)
              .map((p) => (
                <li key={p.key}>
                  <Link href={`/admin/copy/${p.key}`} className="adm-row">
                    <span className="adm-row-main">
                      <b>{p.label}</b>
                      <code>
                        {p.path}
                        {p.note ? ` · ${p.note}` : ""}
                      </code>
                    </span>
                    {p.dirty > 0 && <span className="adm-chip adm-chip-draft">ร่าง {p.dirty} จุด</span>}
                    {p.edited > 0 && <span className="adm-chip adm-chip-live">แก้แล้ว {p.edited} จุด</span>}
                    <span className="adm-count">{p.total} จุด</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
