import type { Metadata } from "next";
import { AboutTabs } from "@/components/about-tabs";
import { CmsImage } from "@/components/cms-image";
import { PageHead } from "@/components/page-head";
import { getCopy, getImageOverrides } from "@/lib/cms/read";
import { getSiteData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "ใบรับรอง / ใบอนุญาต | บริษัท นวิญญา 1979 จำกัด",
  description: "หนังสือรับรองการจดทะเบียนบริษัท นวิญญา 1979 จำกัด",
};

export default async function CertificatesPage() {
  const [c, site, images] = await Promise.all([getCopy("certificates"), getSiteData(), getImageOverrides()]);
  const registration = c.registration;
  return (
    <>
      <PageHead
        title={c.head.title}
        lead={c.head.lead}
        crumbs={[{ label: site.nav.about, href: "/about" }, { label: site.nav.certificates }]}
      />
      <section className="works">
        <div className="container">
          <AboutTabs current="/about/certificates" />
          <div className="ab-docs">
            <div className="ct-card">
              <a href={images[registration.image] ?? registration.image} target="_blank" rel="noopener noreferrer" className="ab-doc ab-doc-real">
                <CmsImage
                  src={registration.image}
                  alt={`${registration.title} ${site.company}`}
                  width={1111}
                  height={1400}
                  sizes="(max-width: 640px) 100vw, 340px"
                />
              </a>
              <b>{registration.title}</b>
              <p>{registration.detail}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
