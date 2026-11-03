import type { Metadata } from "next";
import Image from "next/image";
import { AboutTabs } from "@/components/about-tabs";
import { PageHead } from "@/components/page-head";

export const metadata: Metadata = {
  title: "ทีมงานของเรา | บริษัท นวิญญา 1979 จำกัด",
  description: "ทีมวิศวกรและทีมช่างของ บริษัท นวิญญา 1979 จำกัด ที่ดูแลงานรื้อถอน ก่อสร้าง และงานตกแต่ง",
};

const photos = [
  { src: "/images/renovate/briefing.webp", alt: "ประชุมทีมช่างก่อนเริ่มงานรีโนเวทออฟฟิศ ตึกธนิยะ" },
  { src: "/images/construction/lift-install.webp", alt: "ทีมช่างติดตั้งลิฟต์" },
  { src: "/images/demolition/site-survey.webp", alt: "ทีมงานสำรวจหน้างานก่อนรื้อถอน" },
];

export default function TeamPage() {
  return (
    <>
      <PageHead
        title="ทีมงานของเรา"
        lead="ทีมวิศวกรและทีมช่างของ บริษัท นวิญญา 1979 จำกัด"
        crumbs={[{ label: "เกี่ยวกับเรา", href: "/about" }, { label: "ทีมงานของเรา" }]}
      />
      <section className="works">
        <div className="container">
          <AboutTabs current="/about/team" />
          <div className="ab-hero">
            <Image src="/images/renovate/team.webp" alt="ทีมงาน บริษัท นวิญญา 1979 จำกัด" width={1477} height={1108} sizes="(max-width: 1080px) 100vw, 1040px" />
          </div>

          <h2 className="ab-title">บรรยากาศการทำงาน</h2>
          <div className="ab-photos">
            {photos.map((p) => (
              <figure key={p.src}>
                <Image src={p.src} alt={p.alt} width={600} height={450} sizes="(max-width: 640px) 100vw, 340px" />
                <figcaption>{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
