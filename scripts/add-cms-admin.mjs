// Gives an email access to /admin. Creates the account with a random password if it does not exist.
// Usage: npm run cms:add-admin -- someone@example.com
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error("Usage: npm run cms:add-admin -- someone@example.com");
  process.exit(1);
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const { data: list, error: listError } = await sb.auth.admin.listUsers({ perPage: 1000 });
if (listError) throw listError;

let user = list.users.find((u) => u.email?.toLowerCase() === email);
let password = null;
if (!user) {
  password = randomBytes(12).toString("base64url");
  const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  user = data.user;
}

const { error } = await sb.from("cms_users").upsert({ id: user.id, email });
if (error) throw error;

console.log(`${email} can now sign in at /admin/login`);
console.log(password ? `Password (shown once): ${password}` : "Existing account: password unchanged.");
