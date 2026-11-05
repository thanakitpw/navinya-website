import type { ReactNode } from "react";
import { CmsImage } from "@/components/cms-image";
import { getCopy } from "@/lib/cms/read";

function Card({ title, sub, image, children }: { title: string; sub?: string; image: string; children: ReactNode }) {
  return (
    <div className="pk">
      <div className="art">
        <CmsImage src={image} alt="" width={500} height={333} sizes="(max-width: 640px) 100vw, 270px" />
        <b>
          {title}
          {sub && <small>{sub}</small>}
        </b>
      </div>
      <div className="d">{children}</div>
    </div>
  );
}

export async function Packages() {
  const { packages: c } = await getCopy("home");
  return (
    <section className="gray">
      <div className="container">
        <h2 className="sec-title">
          {c.title}
          <span className="uline" />
        </h2>
        <div className="pk-grid">
          {c.items.map((p) => (
            <Card key={p.image} title={p.title} sub={p.sub} image={p.image}>
              <strong>{c.highlightLabel}</strong>
              {p.highlight}
              <strong>{c.stepsLabel}</strong>
              <ol>
                {p.steps.map((step, k) => (
                  <li key={k}>
                    {k + 1}.{step}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
