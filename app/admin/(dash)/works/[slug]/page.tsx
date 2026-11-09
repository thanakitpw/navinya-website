import Link from "next/link";
import { notFound } from "next/navigation";
import { WorksManager, type AdminPhoto } from "@/components/admin/works-manager";
import { serverClient } from "@/lib/cms/server";
import { storageUrl } from "@/lib/supabase-rest";
import { getCategory } from "@/lib/works";

export const dynamic = "force-dynamic";

const PAGE = 1000;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ project?: string }> };

export default async function WorksCategoryAdminPage({ params, searchParams }: Props) {
  const [{ slug }, { project: focus }] = await Promise.all([params, searchParams]);
  const category = getCategory(slug);
  if (!category) notFound();

  const sb = await serverClient();
  const photos: AdminPhoto[] = [];
  // Same order as the public page (lib/works.ts); read in pages since PostgREST caps at 1,000 rows.
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from("work_photos")
      .select("id, project, path, width, height")
      .eq("service", slug)
      .order("sort_order")
      .order("path")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    photos.push(...data.map((r) => ({ id: r.id, project: r.project, src: storageUrl("works", r.path), w: r.width, h: r.height })));
    if (data.length < PAGE) break;
  }

  return (
    <>
      <div className="adm-edit-head">
        <Link href="/admin/works">← กลับไปรายการประเภทผลงาน</Link>
        <h1 className="adm-title">รูปผลงาน · {category.title}</h1>
      </div>
      <WorksManager service={slug} path={`/works/${slug}`} photos={photos} focus={focus} />
    </>
  );
}
