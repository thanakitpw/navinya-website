import Image from "next/image";
import Link from "next/link";

export function Awards() {
  return (
    <section className="award">
      <div className="container">
        <h3>ผลงานคุณภาพ ได้รับความไว้วางใจจากลูกค้าทั่วกรุงเทพฯ และปริมณฑล</h3>
        <div className="row">
          <div className="aw">
            <Image src={"/images/builtin/handover.webp"} alt="" width={600} height={450} sizes="(max-width: 640px) 70vw, 360px" />
            <b>ทีมงานรับมอบงานและตรวจรับร่วมกับลูกค้า</b>
          </div>
          <Link href="/about/certificates" className="aw">
            <Image
              src="/certs/company-registration.webp"
              alt="หนังสือรับรองการจดทะเบียน บริษัท นวิญญา 1979 จำกัด"
              width={1111}
              height={1400}
              sizes="(max-width: 640px) 70vw, 360px"
              className="doc-img"
            />
            <b>หนังสือรับรองการจดทะเบียนบริษัท</b>
          </Link>
        </div>
      </div>
    </section>
  );
}
