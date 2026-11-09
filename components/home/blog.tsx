import { CmsImage } from "@/components/cms-image";
import Link from "next/link";
import { formatDate, getPosts } from "@/lib/blog";
import { getCopy } from "@/lib/cms/read";

export async function Blog() {
  const [posts, { blog: c }] = await Promise.all([getPosts(), getCopy("home")]);
  return (
    <section className="blog">
      <div className="container">
        <div className="bh">
          <h3>
            {c.title}
            <span className="uline left" />
          </h3>
          <Link href="/blog">{c.more}</Link>
        </div>
        <div className="b-grid">
          {posts.slice(0, 4).map((p) => (
            <Link href={`/blog/${p.slug}`} className="bp" key={p.slug}>
              <CmsImage src={p.cover} alt={p.coverAlt} width={500} height={313} sizes="(max-width: 900px) 50vw, 250px" />
              <div className="b">
                <h4>{p.title}</h4>
                <small>{formatDate(p.date)}</small>
                <span className="rm">{c.readMore}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
