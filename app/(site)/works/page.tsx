import type { Metadata } from "next";
import Link from "next/link";
import { CmsImage } from "@/components/cms-image";
import { PageHead } from "@/components/page-head";
import { getCopy } from "@/lib/cms/read";
import { getSiteData } from "@/lib/site-data";
import { countPhotos } from "@/lib/works";

export const metadata: Metadata = {
  title: "ผลงานของเรา | บริษัท นวิญญา 1979 จำกัด",
  description: "รวมผลงานจริงของ บริษัท นวิญญา 1979 จำกัด งานรื้อถอน ก่อสร้าง รีโนเวท ต่อเติม บิ้วอิน ผ้าม่าน และประตูม้วน",
};

export default async function WorksPage() {
  const [counts, c, site] = await Promise.all([countPhotos(), getCopy("works"), getSiteData()]);
  return (
    <>
      <PageHead title={c.head.title} lead={c.head.lead} crumbs={[{ label: site.nav.works }]} />
      <section className="works">
        <div className="container">
          <div className="wk-grid">
            {site.works.map((w) => (
              <Link href={`/works/${w.slug}`} className="wk-card" key={w.slug}>
                <CmsImage src={w.cover} alt={w.title} width={600} height={400} sizes="(max-width: 640px) 100vw, 340px" />
                <div className="b">
                  <h2>{w.title}</h2>
                  <p>{w.intro}</p>
                  <span className="pill-btn">
                    {c.viewStart}
                    {counts.get(w.slug) ?? 0}
                    {c.viewEnd}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
