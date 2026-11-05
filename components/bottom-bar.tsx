import { getSiteData } from "@/lib/site-data";
import { Icon } from "./icons";

export async function BottomBar() {
  const site = await getSiteData();
  const c = site.bottomBar;
  return (
    <nav className="bbar" aria-label="ติดต่อด่วน">
      <a href="/contact#quote" className="bb-quote">
        <Icon name="quote" />
        <span>{site.nav.quote}</span>
      </a>
      <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="bb-line">
        <Icon name="chat" />
        <span>{c.line}</span>
      </a>
      <a href={site.phoneHref} className="bb-phone">
        <Icon name="phone" />
        <span>{c.phone}</span>
      </a>
      <a href={site.mapHref} target="_blank" rel="noopener noreferrer" className="bb-map">
        <Icon name="pin" />
        <span>{c.map}</span>
      </a>
      <a href={site.facebookHref} target="_blank" rel="noopener noreferrer" className="bb-fb">
        <Icon name="facebook" />
        <span>{c.facebook}</span>
      </a>
    </nav>
  );
}
