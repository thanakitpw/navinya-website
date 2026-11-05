import type { Metadata } from "next";
import Link from "next/link";
import { AboutTabs } from "@/components/about-tabs";
import { CmsImage } from "@/components/cms-image";
import { PageHead } from "@/components/page-head";
import { getCopy } from "@/lib/cms/read";
import { site as defaults } from "@/lib/site";
import { getSiteData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "ประวัติบริษัท | บริษัท นวิญญา 1979 จำกัด",
  description: `${defaults.company} (${defaults.companyEn}) ผู้รับเหมารื้อถอน ก่อสร้าง รีโนเวท ต่อเติม บิ้วอิน ผ้าม่าน และประตูม้วน`,
};

export default async function AboutPage() {
  const [c, site] = await Promise.all([getCopy("about"), getSiteData()]);
  const info = [
    [c.info.companyLabel, `${site.company} (${site.companyEn})`],
    [c.info.regNoLabel, c.info.regNo],
    [c.info.regDateLabel, c.info.regDate],
    [c.info.oldNameLabel, c.info.oldName],
    [c.info.officeLabel, site.address],
  ];

  return (
    <>
      <PageHead
        title={c.head.title}
        lead={`${site.company}${c.head.leadEnd}`}
        crumbs={[{ label: site.nav.about }]}
      />
      <section className="works">
        <div className="container">
          <AboutTabs current="/about" />
          <div className="ab-intro">
            <div>
              <h2>{site.company}</h2>
              <p>
                {site.company} ({site.companyEn})
                {c.intro.p1}
              </p>
              <p>{c.intro.p2}</p>
              <Link href="/works" className="pill-btn">
                {c.intro.cta}
              </Link>
            </div>
            <CmsImage
              src="/images/renovate/team.webp"
              alt={c.intro.imageAlt}
              width={1477}
              height={1108}
              sizes="(max-width: 900px) 100vw, 480px"
            />
          </div>

          <div className="ab-facts">
            {c.facts.map((f, k) => (
              <div key={k}>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <div className="ab-cols">
            <div className="ct-card">
              <h2>{c.timeline.title}</h2>
              <ol className="ab-time">
                {c.timeline.items.map((m, k) => (
                  <li key={k}>
                    <b>{m.year}</b>
                    {m.text}
                  </li>
                ))}
              </ol>
            </div>
            <div className="ct-card">
              <h2>{c.info.title}</h2>
              <table className="ab-table">
                <tbody>
                  {info.map(([k, v], i) => (
                    <tr key={i}>
                      <th>{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
