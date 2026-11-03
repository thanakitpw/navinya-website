import Image from "next/image";
import Link from "next/link";

const types = [
  { label: "งานรื้อถอนพร้อมขนเศษวัสดุออกทั้งหมด", href: "/works/demolition", image: "/images/demolition/debris-truck.webp" },
  { label: "งานรื้อถอนพร้อมปรับพื้นที่ให้พร้อมก่อสร้าง", href: "/works/landfill", image: "/images/landfill/aerial.webp" },
  { label: "งานรื้อถอนสำนักงานก่อนส่งคืนพื้นที่เช่า", href: "/blog/office-strip-out", image: "/images/renovate/office-strip.webp" },
  { label: "งานรื้อถอนโรงงานและโกดังเก่า", href: "/blog/building-demolition-process", image: "/images/demolition/scg-plant.webp" },
  { label: "งานรื้อถอนควบคู่กับงานก่อสร้าง รีโนเวท และต่อเติม", href: "/works/construction", image: "/images/construction/crane-lift.webp" },
  { label: "งานรื้อถอนตาม BOQ พร้อมเสนอราคาและแผนดำเนินงาน", href: "/contact", image: "/images/demolition/site-survey.webp" },
];

export function DemolitionTypes() {
  return (
    <section className="types">
      <div className="container">
        <div className="row">
          <div>
            <h2>
              บริการ<span>งานรื้อถอน</span>
            </h2>
            <span className="uline left" />
          </div>
          <div>
            <p>
              <Link href="/works/demolition" className="hl">
                งานรื้อถอน
              </Link>{" "}
              คือ การรื้อหรือทุบโครงสร้างอาคารเดิมออกทั้งหมดหรือบางส่วน เพื่อเตรียมพื้นที่สำหรับการ{" "}
              <Link href="/works/construction" className="hl">
                ก่อสร้างใหม่
              </Link>{" "}
              หรือ{" "}
              <Link href="/works/renovate" className="hl">
                รีโนเวท
              </Link>
            </p>
            <p>
              การรื้อถอนที่ถูกต้องต้องมีการวางแผนลำดับงาน ป้องกันผลกระทบต่อเพื่อนบ้าน จัดการฝุ่นและเสียง
              รวมถึงขนย้ายเศษวัสดุออกจากพื้นที่อย่างเป็นระบบ ที่ <b>บริษัท นวิญญา 1979 จำกัด</b>{" "}
              เราดูแลตั้งแต่การยื่นขออนุญาตรื้อถอนกับหน่วยงานท้องถิ่น ไปจนถึงเคลียร์พื้นที่ให้พร้อมสำหรับงานถัดไป
            </p>
            <p>
              การเลือกวิธี <b>รื้อถอน</b> ขึ้นอยู่กับขนาดและประเภทอาคาร ไม่ว่าจะเป็นบ้านพักอาศัย อาคารพาณิชย์ หรือโรงงาน
              ทีมงานจะประเมินหน้างานและเลือกใช้เครื่องจักรที่เหมาะสม เพื่อให้งานรวดเร็ว ปลอดภัย และคุ้มค่าที่สุด
            </p>
          </div>
        </div>
        <div className="type-grid">
          {types.map((t) => (
            <Link href={t.href} className="tp" key={t.label}>
              <Image src={t.image} alt="" width={400} height={300} sizes="(max-width: 900px) 50vw, 340px" />
              <span>{t.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
