import type { Metadata } from "next";
import { AboutTabs } from "@/components/about-tabs";
import { CmsImage } from "@/components/cms-image";
import { PageHead } from "@/components/page-head";
import { getCopy } from "@/lib/cms/read";
import { getSiteData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "ทีมงานของเรา | บริษัท นวิญญา 1979 จำกัด",
  description: "ทีมวิศวกรและทีมช่างของ บริษัท นวิญญา 1979 จำกัด ที่ดูแลงานรื้อถอน ก่อสร้าง และงานตกแต่ง",
};

export default async function TeamPage() {
  const [c, { nav }] = await Promise.all([getCopy("team"), getSiteData()]);
  return (
    <>
      <PageHead
        title={c.head.title}
        lead={c.head.lead}
        crumbs={[{ label: nav.about, href: "/about" }, { label: nav.team }]}
      />
      <section className="works">
        <div className="container">
          <AboutTabs current="/about/team" />
          <div className="ab-hero">
            <CmsImage src="/images/renovate/team.webp" alt={c.heroAlt} width={1477} height={1108} sizes="(max-width: 1080px) 100vw, 1040px" />
          </div>

          <h2 className="ab-title">{c.photosTitle}</h2>
          <div className="ab-photos">
            {c.photos.map((p) => (
              <figure key={p.src}>
                <CmsImage src={p.src} alt={p.alt} width={600} height={450} sizes="(max-width: 640px) 100vw, 340px" />
                <figcaption>{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
