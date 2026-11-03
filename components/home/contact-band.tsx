import { Icon } from "@/components/icons";
import { site } from "@/lib/site";

export function ContactBand() {
  return (
    <section className="cband" id="contact">
      <div className="container">
        <h2>ติดต่อสอบถามบริการรับเหมาก่อสร้าง</h2>
        <div className="row">
          <a href={site.phoneHref} className="cbtn cb-phone">
            <Icon name="phone" />
            <div>
              นัดสำรวจหน้างาน
              <br />
              <b>โทร: {site.phone}</b>
            </div>
          </a>
          <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-line">
            <span className="lg">LINE</span>
            <div>
              ส่งรูปหน้างานทางไลน์
              <br />
              <b>LINE ID: {site.line}</b>
            </div>
          </a>
          <a href={site.mapHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-map">
            <Icon name="pin" />
            <div>
              ดูเส้นทาง Google Map
              <br />
              <b>สำนักงาน NAVINYA</b>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
