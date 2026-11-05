import { Rich } from "@/components/rich";
import { getCopy } from "@/lib/cms/read";

export async function Intro() {
  const { intro: c } = await getCopy("home");
  return (
    <section className="intro">
      <div className="container">
        <h1>
          <span className="co">{c.company}</span>
          {c.line1}
          <br />
          {c.line2} <span className="nw">{c.accent}</span>
        </h1>
        <h2>{c.subtitle}</h2>
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
