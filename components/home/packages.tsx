import Image from "next/image";
import type { ReactNode } from "react";

const packages = [
  {
    title: "รีโนเวทบ้าน",
    sub: "ทั้งหลัง / บางส่วน",
    image: "/images/renovate/window.webp",
    highlight: "ปรับปรุงได้ทั้งโครงสร้าง งานระบบ และงานตกแต่ง จบในทีมเดียว",
    steps: ["สำรวจและประเมินสภาพบ้านเดิม", "ออกแบบ 2D / 3D", "รื้อถอนและปรับปรุงโครงสร้าง", "งานระบบไฟฟ้า ประปา"],
  },
  {
    title: "บิ้วอินครัว",
    sub: "ท็อปหิน / ตู้บน-ล่าง",
    image: "/images/builtin/kitchen.webp",
    highlight: "ผลิตตามขนาดพื้นที่จริง เลือกวัสดุกันชื้นได้ตามการใช้งาน",
    steps: [
      "วัดพื้นที่หน้างาน",
      "เลือกวัสดุ HMR / WPC / อะลูมิเนียม",
      "ท็อปหินแกรนิต / ควอตซ์",
      "ติดตั้งพร้อมอุปกรณ์",
      "อุปกรณ์เสริม: ซิงค์ เครื่องดูดควัน",
    ],
  },
  {
    title: "ประตูม้วนไฟฟ้า",
    sub: "บ้าน / ร้านค้า / โกดัง",
    image: "/images/shutter/yellow.webp",
    highlight: "สะดวก ปลอดภัย ควบคุมด้วยรีโมต รองรับหน้ากว้างหลายขนาด",
    steps: ["วัดขนาดหน้างาน", "วัสดุ: เหล็ก / สแตนเลส", "มอเตอร์และรีโมต", "ติดตั้งและทดสอบระบบ"],
  },
];

function Card({ title, sub, image, children }: { title: string; sub?: string; image: string; children: ReactNode }) {
  return (
    <div className="pk">
      <div className="art">
        <Image src={image} alt="" width={500} height={333} sizes="(max-width: 640px) 100vw, 270px" />
        <b>
          {title}
          {sub && <small>{sub}</small>}
        </b>
      </div>
      <div className="d">{children}</div>
    </div>
  );
}

export function Packages() {
  return (
    <section className="gray">
      <div className="container">
        <h2 className="sec-title">
          บริการยอดนิยมประจำเดือน
          <span className="uline" />
        </h2>
        <div className="pk-grid">
          {packages.map((p) => (
            <Card key={p.title} title={p.title} sub={p.sub} image={p.image}>
              <strong>จุดเด่น</strong>
              {p.highlight}
              <strong>รายละเอียดงาน</strong>
              <ol>
                {p.steps.map((step, k) => (
                  <li key={step}>
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
