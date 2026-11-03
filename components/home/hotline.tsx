import { Icon } from "@/components/icons";
import { site } from "@/lib/site";

export function Hotline() {
  return (
    <>
      <section className="hot">
        <div className="container">
          <h2>รวดเร็ว บริการ ราคายุติธรรม รับประกันผลงาน</h2>
          <a href={site.phoneHref}>
            <Icon name="phone" /> HOTLINE : {site.phone}
          </a>
        </div>
      </section>
      <p className="disc container">
        ราคาที่แจ้งในเว็บไซต์เป็นราคาประเมินเบื้องต้น ณ ปัจจุบัน
        <br />
        ราคาจริงขึ้นอยู่กับพื้นที่หน้างาน วัสดุ และขอบเขตงาน กรุณาติดต่อทีมงานเพื่อสำรวจและเสนอราคาก่อนทุกครั้ง
      </p>
    </>
  );
}
