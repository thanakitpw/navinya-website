import Image from "next/image";
import Link from "next/link";
import { formatDate, getPosts } from "@/lib/blog";

export async function Blog() {
  const posts = await getPosts();
  return (
    <section className="blog">
      <div className="container">
        <div className="bh">
          <h3>
            บทความเกี่ยวกับงานก่อสร้างและตกแต่ง
            <span className="uline left" />
          </h3>
          <Link href="/blog">อ่านต่อ ›</Link>
        </div>
        <div className="b-grid">
          {posts.slice(0, 4).map((p) => (
            <Link href={`/blog/${p.slug}`} className="bp" key={p.slug}>
              <Image src={p.cover} alt={p.coverAlt} width={500} height={313} sizes="(max-width: 900px) 50vw, 250px" />
              <div className="b">
                <h4>{p.title}</h4>
                <small>{formatDate(p.date)}</small>
                <span className="rm">อ่านต่อ</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
