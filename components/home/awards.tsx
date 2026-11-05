import Link from "next/link";
import { CmsImage } from "@/components/cms-image";
import { getCopy } from "@/lib/cms/read";

export async function Awards() {
  const { awards: c } = await getCopy("home");
  return (
    <section className="award">
      <div className="container">
        <h3>{c.title}</h3>
        <div className="row">
          <div className="aw">
            <CmsImage src={"/images/builtin/handover.webp"} alt="" width={600} height={450} sizes="(max-width: 640px) 70vw, 360px" />
            <b>{c.handover}</b>
          </div>
          <Link href="/about/certificates" className="aw">
            <CmsImage
              src="/certs/company-registration.webp"
              alt={c.registrationAlt}
              width={1111}
              height={1400}
              sizes="(max-width: 640px) 70vw, 360px"
              className="doc-img"
            />
            <b>{c.registration}</b>
          </Link>
        </div>
      </div>
    </section>
  );
}
