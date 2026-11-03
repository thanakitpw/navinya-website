import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/page-head";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Posts published after the build render on first request.
export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getPost((await params).slug);
  if (!found) return {};
  const { post } = found;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, images: [post.cover] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const found = await getPost((await params).slug);
  if (!found) notFound();
  const { post, html } = found;
  const related = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        image: new URL(post.cover, site.url).href,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: site.company, url: site.url },
        publisher: { "@type": "Organization", name: site.company, logo: new URL("/logo.webp", site.url).href },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าแรก", item: site.url },
          { "@type": "ListItem", position: 2, name: "บทความ", item: new URL("/blog", site.url).href },
          { "@type": "ListItem", position: 3, name: post.title },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead
        title={post.title}
        lead={`${post.category} · ${formatDate(post.date)} · อ่าน ${post.readTime}`}
        crumbs={[{ label: "บทความ", href: "/blog" }, { label: post.title }]}
      />
      <section className="works">
        <div className="container bl-layout">
          <article className="ct-card bl-article">
            <Image src={post.cover} alt={post.coverAlt} width={1600} height={1000} sizes="(max-width: 900px) 100vw, 720px" preload />
            {/* Article HTML comes from Markdown in the posts table, which only staff can write. */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          </article>
          <aside className="bl-side">
            <div className="ct-card">
              <h2>ขอใบเสนอราคา</h2>
              <p>ส่งรูปหน้างานและรายละเอียดทาง LINE ทีมงานจะติดต่อกลับเพื่อนัดสำรวจ</p>
              <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-line">
                <span className="lg">LINE</span>
                <div>
                  <b>{site.line}</b>
                </div>
              </a>
              <a href={site.phoneHref} className="cbtn cb-phone">
                <div>
                  โทร <b>{site.phone}</b>
                </div>
              </a>
            </div>
            <div className="ct-card">
              <h2>บทความอื่น</h2>
              <ul className="bl-related">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
