import Image from "next/image";
import { Icon } from "@/components/icons";
import { site } from "@/lib/site";

const promos = [
  {
    label: "โปรโมชั่นประจำเดือน",
    title: ["รีโนเวท + บิ้วอิน", "จัดชุดคุ้มกว่า"],
    note: `สอบถามรายละเอียดโปรโมชั่นได้ที่ LINE ID: ${site.line}`,
    href: site.lineHref,
    image: "/images/builtin/dining.webp",
  },
  {
    label: "ผ้าม่าน วอลเปเปอร์",
    title: ["วัดพื้นที่ถึงบ้าน", "พร้อมตัวอย่างผ้า"],
    note: "นัดหมายวัดพื้นที่ได้ทุกวัน",
    href: "/works/curtain",
    image: "/images/curtain/living.webp",
  },
];

export function Promos() {
  return (
    <section className="promos">
      <div className="container">
        <div className="row">
          {promos.map((p) => (
            <a
              href={p.href}
              className="promo"
              key={p.label}
              {...(p.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Image src={p.image} alt="" width={800} height={600} sizes="(max-width: 640px) 100vw, 400px" />
              <span className="ph">
                <Icon name="phone" />
                {site.phone}
              </span>
              <div className="t">
                <small>{p.label}</small>
                <b>
                  {p.title[0]}
                  <br />
                  {p.title[1]}
                </b>
                <span>{p.note}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
