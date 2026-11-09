import Link from "next/link";
import { serverClient } from "@/lib/cms/server";
import { workCategories } from "@/lib/work-categories";

export const dynamic = "force-dynamic";

export default async function WorksIndexPage() {
  const sb = await serverClient();
  const counts = await Promise.all(
    workCategories.map(async (c) => {
      const { count } = await sb.from("work_photos").select("id", { count: "exact", head: true }).eq("service", c.slug);
      return count ?? 0;
    }),
  );

  return (
    <div className="adm-page">
      <h1 className="adm-title">รูปผลงาน</h1>
      <p className="adm-sub">
        เพิ่ม ลบ เปลี่ยน และเรียงรูปในหน้าผลงานแต่ละประเภท การแก้ในส่วนนี้ขึ้นเว็บจริงทันที ไม่ต้องกดเผยแพร่
      </p>
      <section className="adm-group">
        <ul className="adm-card">
          {workCategories.map((c, i) => (
            <li key={c.slug}>
              <Link href={`/admin/works/${c.slug}`} className="adm-row">
                <span className="adm-row-main">
                  <b>{c.title}</b>
                  <code>/works/{c.slug}</code>
                </span>
                <span className="adm-count">{counts[i]} รูป</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
