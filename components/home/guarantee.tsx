import { CmsBackground, CmsImage } from "@/components/cms-image";
import { Rich } from "@/components/rich";
import { getCopy } from "@/lib/cms/read";

export async function Guarantee() {
  const { guarantee: c } = await getCopy("home");
  return (
    <section className="guar has-bg">
      <CmsBackground src="/images/demolition/khaosan.webp" />
      <div className="container">
        <div className="head">
          <div>
            <h2>
              <span>{c.title}</span>
              {c.titleEnd}
            </h2>
            <span className="uline left" />
          </div>
          <p>
            <Rich parts={c.text} />
          </p>
        </div>
        <div className="g-grid">
          {c.cards.map((card) => (
            <div className="g-card" key={card.href}>
              <CmsImage src={card.image} alt="" width={600} height={375} sizes="(max-width: 640px) 100vw, 340px" />
              <div className="b">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <a href={card.href} className="pill-btn">
                  {card.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
