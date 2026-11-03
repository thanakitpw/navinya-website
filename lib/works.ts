import { storageUrl, supabaseGet } from "./supabase-rest";
import { workCategories } from "./work-categories";

export { workCategories };

// Photos live in the public Supabase "works" bucket; the work_photos table holds their category and project.
export type WorkPhoto = { service: string; project: string; src: string; w: number; h: number };
export type WorkProject = { title: string; photos: WorkPhoto[] };

type Row = { service: string; project: string; path: string; width: number; height: number };

const pageSize = 1000;

// PostgREST caps a response at 1,000 rows, so read the table in pages.
async function getAllPhotos(): Promise<WorkPhoto[]> {
  const rows: Row[] = [];
  for (let from = 0; ; from += pageSize) {
    const page = await supabaseGet<Row[]>(
      "work_photos?select=service,project,path,width,height&order=sort_order.asc,path.asc",
      ["work_photos"],
      [from, from + pageSize - 1],
    );
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows.map((r) => ({
    service: r.service,
    project: r.project,
    src: storageUrl("works", r.path),
    w: r.width,
    h: r.height,
  }));
}

export function getCategory(slug: string) {
  return workCategories.find((c) => c.slug === slug);
}

export async function countPhotos() {
  const counts = new Map<string, number>();
  for (const p of await getAllPhotos()) counts.set(p.service, (counts.get(p.service) ?? 0) + 1);
  return counts;
}

export async function getProjects(slug: string): Promise<WorkProject[]> {
  const projects = new Map<string, WorkPhoto[]>();
  for (const p of await getAllPhotos()) {
    if (p.service !== slug) continue;
    projects.set(p.project, [...(projects.get(p.project) ?? []), p]);
  }
  return [...projects].map(([title, list]) => ({ title, photos: list }));
}
