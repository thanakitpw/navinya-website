import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AboutTabs } from "@/components/about-tabs";
import { PageHead } from "@/components/page-head";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "ประวัติบริษัท | บริษัท นวิญญา 1979 จำกัด",
  description: `${site.company} (${site.companyEn}) ผู้รับเหมารื้อถอน ก่อสร้าง รีโนเวท ต่อเติม บิ้วอิน ผ้าม่าน และประตูม้วน`,
};

const milestones = [
  { year: "พ.ศ. 2560", text: "จดทะเบียนเป็นนิติบุคคลในชื่อ บริษัท เดอะวัน กรุ๊ป 1979 จำกัด (23 พฤษภาคม 2560)" },
  { year: "พ.ศ. 2563", text: "เปลี่ยนชื่อเป็น บริษัท นวิญญา 1979 จำกัด (27 กุมภาพันธ์ 2563)" },
  { year: "พ.ศ. 2565", text: "รื้อถอนอาคาร NT เพลินจิต พื้นที่ประมาณ 18 ไร่ มูลค่าสัญญา 34 ล้านบาท ระยะเวลา 8 เดือน" },
];

const facts = [
  { value: "9", label: "ประเภทงานที่ให้บริการ" },
  { value: "79", label: "โครงการในหน้าผลงาน" },
  { value: "17", label: "ลูกค้าองค์กร" },
  { value: "2560", label: "ปีที่จดทะเบียนบริษัท" },
];

const info = [
  ["ชื่อบริษัท", `${site.company} (${site.companyEn})`],
  ["เลขทะเบียนนิติบุคคล", "0115560011940"],
  ["วันที่จดทะเบียน", "23 พฤษภาคม พ.ศ. 2560"],
  ["ชื่อเดิม", "บริษัท เดอะวัน กรุ๊ป 1979 จำกัด (เปลี่ยนชื่อ 27 กุมภาพันธ์ พ.ศ. 2563)"],
  ["ที่ตั้งสำนักงาน", site.address],
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="ประวัติบริษัท"
        lead={`${site.company} ผู้รับเหมารื้อถอน ก่อสร้าง และงานตกแต่ง`}
        crumbs={[{ label: "เกี่ยวกับเรา" }]}
      />
      <section className="works">
        <div className="container">
          <AboutTabs current="/about" />
          <div className="ab-intro">
            <div>
              <h2>{site.company}</h2>
              <p>
                {site.company} ({site.companyEn}) รับงานรื้อถอนทุบตึก ก่อสร้าง รีโนเวท ต่อเติม บิ้วอิน ผ้าม่าน วอลเปเปอร์
                ประตูม้วน และงานถมดินปรับพื้นที่ ให้ทั้งเจ้าของบ้าน ผู้ประกอบการ และหน่วยงานรัฐ
              </p>
              <p>
                ผลงานที่ผ่านมามีทั้งงานรื้อถอนอาคารขนาดใหญ่ในกรุงเทพฯ เช่น NT เพลินจิต และ MBK งานโรงงานในนิคมอุตสาหกรรมอมตะ
                และ SCG ทุ่งสง ไปจนถึงงานติดตั้งประตูม้วนในต่างจังหวัด เช่น มหาสารคาม บึงกาฬ และบุรีรัมย์
              </p>
              <Link href="/works" className="pill-btn">
                ดูผลงานทั้งหมด
              </Link>
            </div>
            <Image
              src="/images/renovate/team.webp"
              alt="ทีมงาน บริษัท นวิญญา 1979 จำกัด"
              width={1477}
              height={1108}
              sizes="(max-width: 900px) 100vw, 480px"
            />
          </div>

          <div className="ab-facts">
            {facts.map((f) => (
              <div key={f.label}>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <div className="ab-cols">
            <div className="ct-card">
              <h2>เส้นทางของเรา</h2>
              <ol className="ab-time">
                {milestones.map((m) => (
                  <li key={m.text}>
                    <b>{m.year}</b>
                    {m.text}
                  </li>
                ))}
              </ol>
            </div>
            <div className="ct-card">
              <h2>ข้อมูลบริษัท</h2>
              <table className="ab-table">
                <tbody>
                  {info.map(([k, v]) => (
                    <tr key={k}>
                      <th>{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
