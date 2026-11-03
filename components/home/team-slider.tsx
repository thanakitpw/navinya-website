import Image from "next/image";
import { Fragment } from "react";
import { Carousel } from "@/components/carousel";

const slides = [
  { title: "ทีมช่างประสบการณ์ตรง", accent: "ดูแลจนถึงวันส่งมอบ", image: "/images/renovate/briefing.webp" },
  { title: "ควบคุมงานโดยวิศวกร", accent: "ทุกโครงการ", image: "/images/demolition/ploenchit-excavators.webp" },
  { title: "งานตกแต่งภายใน", accent: "บิ้วอิน ผ้าม่าน วอลเปเปอร์", image: "/images/builtin/tv-wall.webp" },
];

export function TeamSlider() {
  return (
    <section className="team">
      <Carousel
        arrows
        slides={slides.map((s) => (
          <Fragment key={s.title}>
            <Image src={s.image} alt="" width={1400} height={933} sizes="(max-width: 640px) 88vw, 64vw" />
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
