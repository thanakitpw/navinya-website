import { site } from "@/lib/site";
import { Icon } from "./icons";

export function BottomBar() {
  return (
    <nav className="bbar" aria-label="ติดต่อด่วน">
      <a href="/contact#quote" className="bb-quote">
        <Icon name="quote" />
        <span>ขอใบเสนอราคา</span>
      </a>
      <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="bb-line">
        <Icon name="chat" />
        <span>แอดไลน์</span>
      </a>
      <a href={site.phoneHref} className="bb-phone">
        <Icon name="phone" />
        <span>โทรเลย</span>
      </a>
      <a href={site.mapHref} target="_blank" rel="noopener noreferrer" className="bb-map">
        <Icon name="pin" />
        <span>แผนที่หน้าร้าน</span>
      </a>
      <a href={site.facebookHref} target="_blank" rel="noopener noreferrer" className="bb-fb">
        <Icon name="facebook" />
        <span>Facebook</span>
      </a>
    </nav>
  );
}
