import { createServerClient } from "@supabase/ssr";
import { cookies, draftMode, headers } from "next/headers";
import { cache } from "react";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** Supabase client acting as the signed-in user, so every query goes through RLS. */
export async function serverClient() {
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Server Components cannot write cookies; proxy.ts refreshes the session for them.
        }
      },
    },
  });
}

export type CmsUser = { id: string; email: string; display_name: string | null };

/** The signed-in user, only if they are listed in cms_users. A Supabase login alone is not enough. */
export const currentCmsUser = cache(async (): Promise<CmsUser | null> => {
  const sb = await serverClient();
  // getUser() verifies the token with Supabase and loads the session for the query below.
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await sb.from("cms_users").select("id, email, display_name").maybeSingle();
  if (error) {
    console.error("[cms] reading cms_users failed:", error.message);
    return null;
  }
  return data;
});

/**
 * True only for the preview iframe in the admin editor of a signed-in editor.
 * The Draft Mode cookie outlives the editor, so opening the site in a normal tab must still
 * show published content; browsers set Sec-Fetch-Dest and pages cannot forge it.
 */
export const inPreview = cache(async () => {
  if (!(await draftMode()).isEnabled) return false;
  if ((await headers()).get("sec-fetch-dest") !== "iframe") return false;
  return Boolean(await currentCmsUser());
});
