import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHead } from "@/components/page-head";
import { QuoteForm } from "@/components/quote-form";
import { getCopy } from "@/lib/cms/read";
import { site as defaults } from "@/lib/site";
import { getSiteData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "ติดต่อเรา | บริษัท นวิญญา 1979 จำกัด",
  description: `ติดต่อ ${defaults.company} โทร ${defaults.phones.map((p) => p.label).join(", ")} LINE ID: ${defaults.line}`,
};

export default async function ContactPage() {
  const [c, site] = await Promise.all([getCopy("contact"), getSiteData()]);
  const jobTypes = [...site.services.map((s) => s.name), ...c.form.jobExtra];

  return (
    <>
      <PageHead title={c.head.title} lead={c.head.lead} crumbs={[{ label: site.nav.contact }]} />
      <section className="works">
        <div className="container">
          <div className="ct-card qf-card" id="quote">
            <h2>{c.quote.title}</h2>
            <p className="qf-lead">{c.quote.lead}</p>
            <QuoteForm
              copy={c.form}
              jobTypes={jobTypes}
              company={site.company}
              line={site.line}
              lineHref={site.lineHref}
              phone={site.phone}
              phoneHref={site.phoneHref}
            />
          </div>
        </div>
        <div className="container ct-grid">
          <div className="ct-card">
            <h2>{site.company}</h2>
            <p className="en">{site.companyEn}</p>
            <ul className="ct-list">
              {site.phones.map((p) => (
                <li key={p.href}>
                  <span className="c ct-phone">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <small>{c.details.phone}</small>
                    <a href={p.href}>{p.label}</a>
                  </div>
                </li>
              ))}
              <li>
                <span className="c ct-line">
                  <Icon name="chat" />
                </span>
                <div>
                  <small>{c.details.line}</small>
                  <a href={site.lineHref} target="_blank" rel="noopener noreferrer">
                    {site.line}
                  </a>
                </div>
              </li>
              <li>
                <span className="c ct-fb">
                  <Icon name="facebook" />
                </span>
                <div>
                  <small>{c.details.facebook}</small>
                  <a href={site.facebookHref} target="_blank" rel="noopener noreferrer">
                    {site.company}
                  </a>
                </div>
              </li>
              <li>
                <span className="c ct-mail">
                  <Icon name="mail" />
                </span>
                <div>
                  <small>{c.details.email}</small>
                  <a href={site.emailHref}>{site.email}</a>
                </div>
              </li>
              <li>
                <span className="c ct-pin">
                  <Icon name="pin" />
                </span>
                <div>
                  <small>{c.details.office}</small>
                  <a href={site.mapHref} target="_blank" rel="noopener noreferrer">
                    {site.address}
                  </a>
                </div>
              </li>
            </ul>
            <div className="ct-actions">
              <a href={site.phoneHref} className="cbtn cb-phone">
                <Icon name="phone" />
                <div>
                  {c.details.callNow}
                  <br />
                  <b>{site.phone}</b>
                </div>
              </a>
              <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-line">
                <span className="lg">LINE</span>
                <div>
                  {c.details.addLine}
                  <br />
                  <b>{site.line}</b>
                </div>
              </a>
            </div>
          </div>
          <div className="ct-card">
            <h2>{c.steps.title}</h2>
            <ol className="ct-steps">
              {c.steps.items.map((s, k) => (
                <li key={k}>
                  <b>{k + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
            <iframe
              className="ct-map"
              src={site.mapEmbed}
              title={`แผนที่ ${site.company}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={site.mapHref} target="_blank" rel="noopener noreferrer" className="ct-maplink">
              {c.steps.mapLink}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
