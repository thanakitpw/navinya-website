import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHead } from "@/components/page-head";
import { QuoteForm } from "@/components/quote-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "ติดต่อเรา | NAVINYA",
  description: `ติดต่อ ${site.company} โทร ${site.phones.map((p) => p.label).join(", ")} LINE ID: ${site.line}`,
};

const steps = [
  "ส่งรูปหน้างาน หรือแบบ / BOQ (ถ้ามี) ทาง LINE หรืออีเมล",
  "แจ้งที่ตั้งหน้างาน ขนาดพื้นที่ และประเภทงานที่ต้องการ",
  "ทีมงานติดต่อกลับเพื่อนัดสำรวจหน้างาน",
  "รับใบเสนอราคาพร้อมแผนดำเนินงาน",
];

export default function ContactPage() {
  return (
    <>
      <PageHead title="ติดต่อเรา" lead="สอบถามบริการ นัดสำรวจหน้างาน หรือขอใบเสนอราคา" crumbs={[{ label: "ติดต่อเรา" }]} />
      <section className="works">
        <div className="container">
          <div className="ct-card qf-card" id="quote">
            <h2>ขอใบเสนอราคา</h2>
            <p className="qf-lead">กรอกรายละเอียดงาน ทีมงานจะติดต่อกลับเพื่อนัดสำรวจหน้างานและเสนอราคา</p>
            <QuoteForm />
          </div>
        </div>
        <div className="container ct-grid">
          <div className="ct-card">
            <h2>{site.company}</h2>
            <p className="en">{site.companyEn}</p>
            <ul className="ct-list">
              {site.phones.map((p) => (
                <li key={p.href}>
                  <span className="c ct-phone">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <small>โทรศัพท์</small>
                    <a href={p.href}>{p.label}</a>
                  </div>
                </li>
              ))}
              <li>
                <span className="c ct-line">
                  <Icon name="chat" />
                </span>
                <div>
                  <small>LINE ID</small>
                  <a href={site.lineHref} target="_blank" rel="noopener noreferrer">
                    {site.line}
                  </a>
                </div>
              </li>
              <li>
                <span className="c ct-fb">
                  <Icon name="facebook" />
                </span>
                <div>
                  <small>Facebook</small>
                  <a href={site.facebookHref} target="_blank" rel="noopener noreferrer">
                    {site.company}
                  </a>
                </div>
              </li>
              <li>
                <span className="c ct-mail">
                  <Icon name="mail" />
                </span>
                <div>
                  <small>อีเมล</small>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              </li>
              <li>
                <span className="c ct-pin">
                  <Icon name="pin" />
                </span>
                <div>
                  <small>สำนักงาน</small>
                  <a href={site.mapHref} target="_blank" rel="noopener noreferrer">
                    {site.address}
                  </a>
                </div>
              </li>
            </ul>
            <div className="ct-actions">
              <a href={site.phoneHref} className="cbtn cb-phone">
                <Icon name="phone" />
                <div>
                  โทรเลย
                  <br />
                  <b>{site.phone}</b>
                </div>
              </a>
              <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-line">
                <span className="lg">LINE</span>
                <div>
                  เพิ่มเพื่อน
                  <br />
                  <b>{site.line}</b>
                </div>
              </a>
            </div>
          </div>
          <div className="ct-card">
            <h2>ขั้นตอนขอใบเสนอราคา</h2>
            <ol className="ct-steps">
              {steps.map((s, k) => (
                <li key={s}>
                  <b>{k + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
            <iframe
              className="ct-map"
              src={site.mapEmbed}
              title={`แผนที่ ${site.company}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={site.mapHref} target="_blank" rel="noopener noreferrer" className="ct-maplink">
              เปิดใน Google Maps ›
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
