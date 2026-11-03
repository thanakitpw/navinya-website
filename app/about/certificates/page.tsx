import type { Metadata } from "next";
import Image from "next/image";
import { AboutTabs } from "@/components/about-tabs";
import { PageHead } from "@/components/page-head";

export const metadata: Metadata = {
  title: "ใบรับรอง / ใบอนุญาต | บริษัท นวิญญา 1979 จำกัด",
  description: "หนังสือรับรองการจดทะเบียนบริษัท นวิญญา 1979 จำกัด",
};

const registration = {
  title: "ใบสำคัญแสดงการจดทะเบียนห้างหุ้นส่วนบริษัท",
  detail: "กรมพัฒนาธุรกิจการค้า ทะเบียนเลขที่ 0115560011940 จดทะเบียนเมื่อ 23 พฤษภาคม พ.ศ. 2560",
  image: "/certs/company-registration.webp",
};

export default function CertificatesPage() {
  return (
    <>
      <PageHead
        title="ใบรับรอง / ใบอนุญาต"
        lead="เอกสารรับรองบริษัทและใบอนุญาตที่เกี่ยวข้องกับการดำเนินงาน"
        crumbs={[{ label: "เกี่ยวกับเรา", href: "/about" }, { label: "ใบรับรอง / ใบอนุญาต" }]}
      />
      <section className="works">
        <div className="container">
          <AboutTabs current="/about/certificates" />
          <div className="ab-docs">
            <div className="ct-card">
              <a href={registration.image} target="_blank" rel="noopener noreferrer" className="ab-doc ab-doc-real">
                <Image
                  src={registration.image}
                  alt={`${registration.title} บริษัท นวิญญา 1979 จำกัด`}
                  width={1111}
                  height={1400}
                  sizes="(max-width: 640px) 100vw, 340px"
                />
              </a>
              <b>{registration.title}</b>
              <p>{registration.detail}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
