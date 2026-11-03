// Server-side reads through PostgREST with the publishable key, cached by Next.js and refreshed hourly.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function supabaseGet<T>(query: string, tags: string[], range?: [number, number]): Promise<T> {
  const res = await fetch(`${url}/rest/v1/${query}`, {
    headers: { apikey: key, ...(range && { Range: `${range[0]}-${range[1]}` }) },
    next: { revalidate: 3600, tags },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

export function storageUrl(bucket: string, path: string) {
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}
