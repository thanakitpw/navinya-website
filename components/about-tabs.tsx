import Link from "next/link";
import { getSiteData } from "@/lib/site-data";

export async function AboutTabs({ current }: { current: string }) {
  const { nav } = await getSiteData();
  const tabs = [
    { label: nav.history, href: "/about" },
    { label: nav.team, href: "/about/team" },
    { label: nav.certificates, href: "/about/certificates" },
  ];

  return (
    <div className="wk-tabs">
      {tabs.map((t) => (
        <Link href={t.href} key={t.href} className={t.href === current ? "on" : undefined}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
