import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="works">
        <div className="container">
          <h1 className="sec-title">ไม่พบหน้าที่ต้องการ</h1>
          <p style={{ textAlign: "center", margin: "16px 0 24px" }}>
            <Link href="/" className="pill-btn">
              กลับหน้าแรก
            </Link>
          </p>
        </div>
      </section>
    </SiteChrome>
  );
}
