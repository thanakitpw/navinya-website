import { CmsBackground, CmsImage } from "@/components/cms-image";
import { getCopy } from "@/lib/cms/read";
import { getSiteData } from "@/lib/site-data";

export async function Services() {
  const [{ services: c }, { services }] = await Promise.all([getCopy("home"), getSiteData()]);
  return (
    <section id="services">
      <div className="container">
        <div className="svc-box has-bg">
          <CmsBackground src="/images/construction/thonglor-parking.webp" />
          <h2>
            {c.title}
            <span>{c.accent}</span>
          </h2>
          <p>
            {c.text}
            <span className="nw">{c.textEnd}</span>
          </p>
          <span className="uline" />
          <div className="svc-grid">
            {services.map((s) => (
              <div className="svc-card" key={s.href}>
                <CmsImage src={s.image} alt={s.name} width={600} height={400} sizes="(max-width: 640px) 100vw, 340px" />
                <div className="b">
                  <h3>{s.name}</h3>
                  <p>{s.summary}</p>
                  <a href={s.href} className="pill-btn">
                    {c.more}
                  </a>
                </div>
              </div>
            ))}
            <div className="svc-last">
              <CmsImage
                src={"/images/demolition/nonthaburi-aerial.webp"}
                alt=""
                width={1000}
                height={667}
                sizes="(max-width: 640px) 100vw, 720px"
              />
              <div className="badge">
                <b>
                  {c.badge1}
                  <br />
                  {c.badge2}
                </b>
                <span>
                  {services.length}
                  {c.badgeNote}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
