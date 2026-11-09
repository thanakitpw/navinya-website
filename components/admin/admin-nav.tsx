"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/copy", label: "ข้อความและรูปในหน้าเว็บ" },
  { href: "/admin/works", label: "รูปผลงาน" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="adm-nav">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? "on" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
