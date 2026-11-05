import { Fragment } from "react";
import { Carousel } from "@/components/carousel";
import { CmsImage } from "@/components/cms-image";
import { getCopy } from "@/lib/cms/read";

export async function TeamSlider() {
  const { team } = await getCopy("home");
  return (
    <section className="team">
      <Carousel
        arrows
        slides={team.map((s) => (
          <Fragment key={s.image}>
            <CmsImage src={s.image} alt="" width={1400} height={933} sizes="(max-width: 640px) 88vw, 64vw" />
            <div className="ov">
              <b>
                {s.title}
                <br />
                <span>{s.accent}</span>
              </b>
            </div>
          </Fragment>
        ))}
      />
    </section>
  );
}
