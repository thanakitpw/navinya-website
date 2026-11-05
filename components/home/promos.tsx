import { CmsImage } from "@/components/cms-image";
import { Icon } from "@/components/icons";
import { getCopy } from "@/lib/cms/read";
import { getSiteData } from "@/lib/site-data";

export async function Promos() {
  const [{ promos }, site] = await Promise.all([getCopy("home"), getSiteData()]);
  return (
    <section className="promos">
      <div className="container">
        <div className="row">
          {promos.map((p) => {
            const href = p.link === "line" ? site.lineHref : p.link;
            return (
              <a
                href={href}
                className="promo"
                key={p.image}
                {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
              >
                <CmsImage src={p.image} alt="" width={800} height={600} sizes="(max-width: 640px) 100vw, 400px" />
                <span className="ph">
                  <Icon name="phone" />
                  {site.phone}
                </span>
                <div className="t">
                  <small>{p.label}</small>
                  <b>
                    {p.title1}
                    <br />
                    {p.title2}
                  </b>
                  <span>{p.note}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
