"use client";

import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/cms/browser";

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await browserClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button type="button" onClick={signOut} className="adm-btn adm-btn-wide">
      ออกจากระบบ
    </button>
  );
}
