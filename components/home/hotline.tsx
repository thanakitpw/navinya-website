import { Icon } from "@/components/icons";
import { getCopy } from "@/lib/cms/read";
import { getSiteData } from "@/lib/site-data";

export async function Hotline() {
  const [{ hotline: c }, site] = await Promise.all([getCopy("home"), getSiteData()]);
  return (
    <>
      <section className="hot">
        <div className="container">
          <h2>{c.title}</h2>
          <a href={site.phoneHref}>
            <Icon name="phone" />
            {c.label}
            {site.phone}
          </a>
        </div>
      </section>
      <p className="disc container">
        {c.disclaimer1}
        <br />
        {c.disclaimer2}
      </p>
    </>
  );
}
