import Link from "next/link";

const tabs = [
  { label: "ประวัติบริษัท", href: "/about" },
  { label: "ทีมงานของเรา", href: "/about/team" },
  { label: "ใบรับรอง / ใบอนุญาต", href: "/about/certificates" },
];

export function AboutTabs({ current }: { current: string }) {
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
