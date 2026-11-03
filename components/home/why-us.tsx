import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

const reasons: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "users",
    title: "ทีมงานคุณภาพ",
    text: "ทีมวิศวกรและช่างประจำที่มีประสบการณ์ มีหัวหน้างานควบคุมทุกไซต์ พร้อมความรู้และความชำนาญในการทำงาน",
  },
  {
    icon: "shield",
    title: "รับประกันผลงานทุกงาน",
    text: "รับประกันงานโครงสร้างและงานติดตั้งตามเงื่อนไขในสัญญา มีทีมดูแลหลังส่งมอบ",
  },
  {
    icon: "thumb",
    title: "บริการดีกว่าที่คิด",
    text: "เพราะลูกค้าสำคัญที่สุด เราจึงรายงานความคืบหน้าทุกสัปดาห์ และพร้อมปรับแก้ให้ตรงความต้องการในทุกรายละเอียด",
  },
  {
    icon: "cert",
    title: "มีใบอนุญาตถูกต้อง",
    text: "ดำเนินงานถูกต้องตามกฎหมาย มีใบอนุญาตและประกันภัยงาน มั่นใจได้ทั้งความปลอดภัยและคุณภาพ",
  },
];

export function WhyUs() {
  return (
    <section className="why">
      <div className="container">
        <h2 className="sec-title">
          ใช้บริการ รับเหมาก่อสร้าง ของเราดีอย่างไร
          <span className="uline" />
        </h2>
        <div className="row">
          <div className="pic">
            <Image
              src={"/images/renovate/team.webp"}
              alt="ทีมงาน บริษัท นวิญญา 1979 จำกัด"
              width={900}
              height={675}
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </div>
          <div className="wl">
            {reasons.map((r) => (
              <div className="wi" key={r.title}>
                <span className="c">
                  <Icon name={r.icon} />
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
          <Link href="/about">ดูเกี่ยวกับเราเพิ่มเติม</Link>
        </div>
      </div>
    </section>
  );
}
