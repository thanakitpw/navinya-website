import Link from "next/link";
import { Fragment } from "react";
import { getSiteData } from "@/lib/site-data";

type Crumb = { label: string; href?: string };

export async function PageHead({ title, lead, crumbs = [] }: { title: string; lead?: string; crumbs?: Crumb[] }) {
  const site = await getSiteData();
  return (
    <section className="page-head">
      <div className="container">
        {crumbs.length > 0 && (
          <nav className="crumbs">
            <Link href="/">{site.nav.home}</Link>
            {crumbs.map((c) => (
              <Fragment key={c.href ?? c.label}>
                {" › "}
                {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              </Fragment>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
      </div>
    </section>
  );
}
