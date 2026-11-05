"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { browserClient } from "@/lib/cms/browser";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await browserClient().auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      // Same message either way, so nobody can probe which emails exist.
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    const next = params.get("next");
    router.replace(next?.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="adm-form">
      <label>
        <span>อีเมล</span>
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="adm-field" />
      </label>
      <label>
        <span>รหัสผ่าน</span>
        <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="adm-field" />
      </label>
      {error && (
        <p role="alert" className="adm-error">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="adm-btn adm-btn-solid">
        {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
