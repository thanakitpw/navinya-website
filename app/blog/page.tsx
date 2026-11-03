import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { formatDate, getPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "บทความ | บริษัท นวิญญา 1979 จำกัด",
  description: "บทความเรื่องงานรื้อถอน ขออนุญาตรื้อถอน ถมดิน รีโนเวท และประตูม้วน จากงานจริงของ บริษัท นวิญญา 1979 จำกัด",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHead
        title="บทความ"
        lead="ความรู้เรื่องงานรื้อถอน ก่อสร้าง รีโนเวท และงานติดตั้ง จากหน้างานจริง"
        crumbs={[{ label: "บทความ" }]}
      />
      <section className="works">
        <div className="container">
          <div className="wk-grid">
            {posts.map((p) => (
              <Link href={`/blog/${p.slug}`} className="wk-card bl-card" key={p.slug}>
                <Image src={p.cover} alt={p.coverAlt} width={600} height={400} sizes="(max-width: 640px) 100vw, 340px" />
                <div className="b">
                  <small>
                    {p.category} · {formatDate(p.date)}
                  </small>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <span className="pill-btn">อ่านต่อ</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
