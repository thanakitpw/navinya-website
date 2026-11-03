import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { getPosts } from "@/lib/blog";
import { services, site } from "@/lib/site";
import { Icon } from "./icons";
import { LogoBadge } from "./logo-badge";

export async function Footer() {
  const posts = await getPosts();
  return (
    <footer>
      <div className="container ft">
        <div className="about">
          <LogoBadge className="ft-logo" />
          <b>{site.company}</b>
          รับเหมาก่อสร้าง รื้อถอนทุบตึก รีโนเวท ต่อเติม บิ้วอิน ผ้าม่าน วอลเปเปอร์ และประตูม้วน ครบวงจร
        </div>
        <div>
          <h4>บริการของเรา</h4>
          <span className="uline left" />
          <ul className="lnk">
            {services.map((s) => (
              <li key={s.name}>
                <a href={s.href}>{s.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>บทความล่าสุด</h4>
          <span className="uline left" />
          <ul className="posts">
            {posts.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Image src={p.cover} alt="" width={36} height={36} />
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>ติดต่อเรา</h4>
          <span className="uline left" />
          <ul className="ct">
            <li>
              <span className="c">
                <Icon name="pin" />
              </span>
              <div>
                สำนักงานใหญ่
                <br />
                <a href={site.mapHref} target="_blank" rel="noopener noreferrer">
                  {site.address}
                </a>
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="phone" />
              </span>
              <div>
                <b>นัดสำรวจหน้างาน</b>
                {site.phones.map((p) => (
                  <Fragment key={p.href}>
                    <br />
                    <a href={p.href}>{p.label}</a>
                  </Fragment>
                ))}
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="chat" />
              </span>
              <div>
                <b>ส่งรูปหน้างานทางไลน์</b>
                <br />
                <a href={site.lineHref} target="_blank" rel="noopener noreferrer">LINE ID: {site.line}</a>
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="facebook" />
              </span>
              <div>
                <b>ติดตามผลงานทาง Facebook</b>
                <br />
                <a href={site.facebookHref} target="_blank" rel="noopener noreferrer">
                  {site.company}
                </a>
              </div>
            </li>
            <li>
              <span className="c">
                <Icon name="mail" />
              </span>
              <div>
                <b>อีเมล</b>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </li>
          </ul>
          <div className="soc">
            <a href={`mailto:${site.email}`} className="soc-mail" aria-label="Email">
              <Icon name="mail" />
            </a>
            <a href={site.facebookHref} target="_blank" rel="noopener noreferrer" className="soc-fb" aria-label="Facebook">
              <Icon name="facebook" />
            </a>
            <a href={site.phoneHref} className="soc-phone" aria-label="โทร">
              <Icon name="phone" />
            </a>
          </div>
        </div>
      </div>
      <div className="copy">
        Copyright {new Date().getFullYear()} © <Link href="/">บริษัท นวิญญา 1979 จำกัด รับเหมาก่อสร้าง รื้อถอนทุบตึก รีโนเวท ต่อเติม</Link> . All
        Rights Reserved
      </div>
    </footer>
  );
}
