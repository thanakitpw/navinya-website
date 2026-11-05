import Link from "next/link";
import { CmsImage } from "@/components/cms-image";
import { Rich } from "@/components/rich";
import { getCopy } from "@/lib/cms/read";

export async function DemolitionTypes() {
  const { demolition: c } = await getCopy("home");
  return (
    <section className="types">
      <div className="container">
        <div className="row">
          <div>
            <h2>
              {c.title}
              <span>{c.accent}</span>
            </h2>
            <span className="uline left" />
          </div>
          <div>
            <p>
              <Rich parts={c.p1} />
            </p>
            <p>
              <Rich parts={c.p2} />
            </p>
            <p>
              <Rich parts={c.p3} />
            </p>
          </div>
        </div>
        <div className="type-grid">
          {c.types.map((t) => (
            <Link href={t.href} className="tp" key={t.href + t.image}>
              <CmsImage src={t.image} alt="" width={400} height={300} sizes="(max-width: 900px) 50vw, 340px" />
              <span>{t.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
