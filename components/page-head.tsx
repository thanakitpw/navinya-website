import Link from "next/link";
import { Fragment } from "react";

type Crumb = { label: string; href?: string };

export function PageHead({ title, lead, crumbs = [] }: { title: string; lead?: string; crumbs?: Crumb[] }) {
  return (
    <section className="page-head">
      <div className="container">
        {crumbs.length > 0 && (
          <nav className="crumbs">
            <Link href="/">หน้าแรก</Link>
            {crumbs.map((c) => (
              <Fragment key={c.label}>
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
