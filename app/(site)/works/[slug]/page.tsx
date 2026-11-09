import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/page-head";
import { Gallery } from "@/components/works/gallery";
import { getSiteData } from "@/lib/site-data";
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
  const site = await getSiteData();
  const category = site.works.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <>
      <PageHead
        title={category.heading}
        lead={category.intro}
        crumbs={[{ label: site.nav.works, href: "/works" }, { label: category.title }]}
      />
      <section className="works">
        <div className="container">
          <div className="wk-tabs">
            {site.works.map((c) => (
              <Link href={`/works/${c.slug}`} key={c.slug} className={c.slug === slug ? "on" : undefined}>
                {c.title}
              </Link>
            ))}
          </div>
          {(await getProjects(slug)).map((p) => (
            <div className="proj" key={p.title} data-work-project={p.title}>
              <h2>
                {p.title}{" "}
                <small>
                  {p.photos.length} {site.workLabels.photoUnit}
                </small>
              </h2>
              <Gallery photos={p.photos} title={p.title} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
