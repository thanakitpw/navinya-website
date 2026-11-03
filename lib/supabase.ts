import { createClient } from "@supabase/supabase-js";

// Publishable key only: row level security limits visitors to submitting quotes and reading published content.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false } },
);
