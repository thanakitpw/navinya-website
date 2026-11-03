import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/page-head";
import { Gallery } from "@/components/works/gallery";
import { getCategory, getProjects, workCategories } from "@/lib/works";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return workCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).slug);
  return category ? { title: `${category.heading} | บริษัท นวิญญา 1979 จำกัด`, description: category.intro } : {};
}

export default async function WorkCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <PageHead
        title={category.heading}
        lead={category.intro}
        crumbs={[{ label: "ผลงาน", href: "/works" }, { label: category.title }]}
      />
      <section className="works">
        <div className="container">
          <div className="wk-tabs">
            {workCategories.map((c) => (
              <Link href={`/works/${c.slug}`} key={c.slug} className={c.slug === slug ? "on" : undefined}>
                {c.title}
              </Link>
            ))}
          </div>
          {(await getProjects(slug)).map((p) => (
            <div className="proj" key={p.title}>
              <h2>
                {p.title} <small>{p.photos.length} รูป</small>
              </h2>
              <Gallery photos={p.photos} title={p.title} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
