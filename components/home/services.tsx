import Image from "next/image";
import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="svc-box">
          <h2>
            บริการของเรา <span>ครบวงจร</span>
          </h2>
          <p>
            NAVINYA มีบริการดังต่อไปนี้ งานรื้อถอนทุบตึก งานก่อสร้าง งานรีโนเวท งานต่อเติม งานบิ้วอิน ผ้าม่าน วอลเปเปอร์
            <span className="nw">และประตูม้วน</span>
          </p>
          <span className="uline" />
          <div className="svc-grid">
            {services.map((s) => (
              <div className="svc-card" key={s.name}>
                <Image src={s.image} alt={s.name} width={600} height={400} sizes="(max-width: 640px) 100vw, 340px" />
                <div className="b">
                  <h3>{s.name}</h3>
                  <p>{s.summary}</p>
                  <a href={s.href} className="pill-btn">
                    ดูข้อมูลเพิ่มเติม
                  </a>
                </div>
              </div>
            ))}
            <div className="svc-last">
              <Image
                src={"/images/demolition/nonthaburi-aerial.webp"}
                alt=""
                width={1000}
                height={667}
                sizes="(max-width: 640px) 100vw, 720px"
              />
              <div className="badge">
                <b>
                  ครบ จบ
                  <br />
                  ในทีมเดียว
                </b>
                <span>{services.length} บริการ ดูแลโดย NAVINYA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
