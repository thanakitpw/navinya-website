import { CmsImage } from "@/components/cms-image";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { formatDate, getPosts } from "@/lib/blog";
import { getCopy } from "@/lib/cms/read";

export const metadata: Metadata = {
  title: "บทความ | บริษัท นวิญญา 1979 จำกัด",
  description: "บทความเรื่องงานรื้อถอน ขออนุญาตรื้อถอน ถมดิน รีโนเวท และประตูม้วน จากงานจริงของ บริษัท นวิญญา 1979 จำกัด",
};

export default async function BlogPage() {
  const [posts, c] = await Promise.all([getPosts(), getCopy("blog")]);
  return (
    <>
      <PageHead
        title={c.head.title}
        lead={c.head.lead}
        crumbs={[{ label: c.head.title }]}
      />
      <section className="works">
        <div className="container">
          <div className="wk-grid">
            {posts.map((p) => (
              <Link href={`/blog/${p.slug}`} className="wk-card bl-card" key={p.slug}>
                <CmsImage src={p.cover} alt={p.coverAlt} width={600} height={400} sizes="(max-width: 640px) 100vw, 340px" />
                <div className="b">
                  <small>
                    {p.category} · {formatDate(p.date)}
                  </small>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <span className="pill-btn">{c.readMore}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
