import { getCopy } from "@/lib/cms/read";
import { getSiteData } from "@/lib/site-data";

// Filled white icons, matching the client's reference contact band.
function PhoneIcon() {
  return (
    <svg className="cb-ic" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"
      />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg className="cb-ic" viewBox="0 0 48 46" aria-hidden="true">
      <path
        fill="#fff"
        d="M24 1C11.3 1 1 9.4 1 19.7c0 9.3 8.2 17 19.3 18.5.8.2 1.8.5 2 1.2.2.6.2 1.5.1 2.1l-.3 2c-.1.6-.5 2.3 2 1.3 2.5-1 13.3-7.8 18.1-13.4C45.6 27.7 47 23.9 47 19.7 47 9.4 36.7 1 24 1z"
      />
      <text
        x="24"
        y="24.5"
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="800"
        fill="var(--line-green)"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        LINE
      </text>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="cb-ic" viewBox="0 0 24 28" aria-hidden="true">
      <path fill="currentColor" d="M12 1a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
      <ellipse cx="12" cy="24.5" rx="9" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export async function ContactBand() {
  const [{ contactBand: c }, site] = await Promise.all([getCopy("home"), getSiteData()]);
  return (
    <section className="cband" id="contact">
      <div className="container">
        <h2>{c.title}</h2>
        <div className="row">
          <a href={site.phoneHref} className="cbtn cb-phone">
            <PhoneIcon />
            <div>
              {c.phoneTitle}
              <br />
              {c.phonePrefix}
              <b>{site.phone}</b>
            </div>
          </a>
          <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-line">
            <LineIcon />
            <div>
              {c.lineTitle}
              <br />
              {c.linePrefix}
              <b>{site.line}</b>
            </div>
          </a>
          <a href={site.mapHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-map">
            <PinIcon />
            <div>
              {c.mapTitle}
              <br />
              {c.mapNote}
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
