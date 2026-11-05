import Link from "next/link";
import { CmsImage } from "@/components/cms-image";
import { Icon, type IconName } from "@/components/icons";
import { getCopy } from "@/lib/cms/read";

export async function WhyUs() {
  const { whyUs: c } = await getCopy("home");
  return (
    <section className="why">
      <div className="container">
        <h2 className="sec-title">
          {c.title}
          <span className="uline" />
        </h2>
        <div className="row">
          <div className="pic">
            <CmsImage
              src={"/images/renovate/team.webp"}
              alt={c.imageAlt}
              width={900}
              height={675}
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </div>
          <div className="wl">
            {c.reasons.map((r) => (
              <div className="wi" key={r.icon}>
                <span className="c">
                  <Icon name={r.icon as IconName} />
                </span>
                <div>
                  <h4>{r.title}</h4>
                  <p>{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="more">
          <Link href="/about">{c.more}</Link>
        </div>
      </div>
    </section>
  );
}
