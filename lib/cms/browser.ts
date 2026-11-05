import { createBrowserClient } from "@supabase/ssr";

// Browser client carrying the editor's session cookie, for login and direct image uploads.
export const browserClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
