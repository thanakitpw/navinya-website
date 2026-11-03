import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { countPhotos, workCategories } from "@/lib/works";

export const metadata: Metadata = {
  title: "ผลงานของเรา | บริษัท นวิญญา 1979 จำกัด",
  description: "รวมผลงานจริงของ บริษัท นวิญญา 1979 จำกัด งานรื้อถอน ก่อสร้าง รีโนเวท ต่อเติม บิ้วอิน ผ้าม่าน และประตูม้วน",
};

export default async function WorksPage() {
  const counts = await countPhotos();
  return (
    <>
      <PageHead title="ผลงานของเรา" lead="รูปจากหน้างานจริงของทีม บริษัท นวิญญา 1979 จำกัด แยกตามประเภทงาน" crumbs={[{ label: "ผลงาน" }]} />
      <section className="works">
        <div className="container">
          <div className="wk-grid">
            {workCategories.map((c) => (
              <Link href={`/works/${c.slug}`} className="wk-card" key={c.slug}>
                <Image src={c.cover} alt={c.title} width={600} height={400} sizes="(max-width: 640px) 100vw, 340px" />
                <div className="b">
                  <h2>{c.title}</h2>
                  <p>{c.intro}</p>
                  <span className="pill-btn">ดูผลงาน {counts.get(c.slug) ?? 0} รูป</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
