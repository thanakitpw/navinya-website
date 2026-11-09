import { CmsImage } from "@/components/cms-image";
import Link from "next/link";
import { Fragment } from "react";
import { getPosts } from "@/lib/blog";
import { getSiteData } from "@/lib/site-data";
import { Icon } from "./icons";
import { LogoBadge } from "./logo-badge";

export async function Footer() {
  const [posts, site] = await Promise.all([getPosts(), getSiteData()]);
  const c = site.footer;
  return (
    <footer>
      <div className="container ft">
        <div className="about">
          <LogoBadge className="ft-logo" />
          <b>{site.company}</b>
          {c.about}
        </div>
        <div>
          <h4>{c.servicesTitle}</h4>
          <span className="uline left" />
          <ul className="lnk">
            {site.services.map((s) => (
              <li key={s.href}>
                <a href={s.href}>{s.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{c.postsTitle}</h4>
          <span className="uline left" />
          <ul className="posts">
            {posts.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <CmsImage src={p.cover} alt="" width={36} height={36} />
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{c.contactTitle}</h4>
          <span className="uline left" />
          <ul className="ct">
            <li>
              <span className="c">
                <Icon name="pin" />
              </span>
              <div>
                {c.office}
                <br />
                <a href={site.mapHref} target="_blank" rel="noopener noreferrer">
                  {site.address}
                </a>
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="phone" />
              </span>
              <div>
                <b>{c.survey}</b>
                {site.phones.map((p) => (
                  <Fragment key={p.href}>
                    <br />
                    <a href={p.href}>{p.label}</a>
                  </Fragment>
                ))}
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="chat" />
              </span>
              <div>
                <b>{c.linePhotos}</b>
                <br />
                <a href={site.lineHref} target="_blank" rel="noopener noreferrer">{c.linePrefix}{site.line}</a>
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="facebook" />
              </span>
              <div>
                <b>{c.facebook}</b>
                <br />
                <a href={site.facebookHref} target="_blank" rel="noopener noreferrer">
                  {site.company}
                </a>
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="mail" />
              </span>
              <div>
                <b>{c.email}</b>
                <br />
                <a href={site.emailHref}>{site.email}</a>
              </div>
            </li>
          </ul>
          <div className="soc">
            <a href={site.emailHref} className="soc-mail" aria-label="Email">
              <Icon name="mail" />
            </a>
            <a href={site.facebookHref} target="_blank" rel="noopener noreferrer" className="soc-fb" aria-label="Facebook">
              <Icon name="facebook" />
            </a>
            <a href={site.phoneHref} className="soc-phone" aria-label="โทร">
              <Icon name="phone" />
            </a>
          </div>
        </div>
      </div>
      <div className="copy">
        Copyright {new Date().getFullYear()} © <Link href="/">{c.copyright}</Link> . All
        Rights Reserved
      </div>
    </footer>
  );
}
