import { Rich } from "@/components/rich";
import { getCopy } from "@/lib/cms/read";

export async function SeoText() {
  const { seo: c } = await getCopy("home");
  return (
    <section className="seo">
      <div className="container">
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
    </section>
  );
}
