import { cache } from "react";
import { getCopy } from "@/lib/cms/read";
import { stripMarks } from "@/lib/cms/copy";
import { site } from "@/lib/site";

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

/** Site-wide data for rendering. Links are built from clean text, so preview marks never reach an href. */
export const getSiteData = cache(async () => {
  const g = await getCopy("global");
  const c = g.contact;
  const phones = c.phones
    .filter((label) => stripMarks(label).trim())
    .map((label) => ({ label, href: `tel:${stripMarks(label).replace(/[^\d+]/g, "")}` }));

  const serviceLinks: NavLink[] = g.services.map((s) => ({ label: s.name, href: s.href }));
  const nav: NavItem[] = [
    { label: g.nav.home, href: "/" },
    {
      label: g.nav.about,
      href: "/about",
      children: [
        { label: g.nav.history, href: "/about" },
        { label: g.nav.team, href: "/about/team" },
        { label: g.nav.certificates, href: "/about/certificates" },
      ],
    },
    { label: g.nav.services, href: "/#services", children: serviceLinks },
    {
      label: g.nav.works,
      href: "/works",
      children: g.works.map((w) => ({ label: w.title, href: `/works/${w.slug}` })),
    },
    { label: g.nav.contact, href: "/contact" },
  ];

  return {
    ...g,
    company: c.company,
    companyEn: c.companyEn,
    address: c.address,
    phones,
    phone: phones[0]?.label ?? "",
    phoneHref: phones[0]?.href ?? "/contact",
    line: c.line,
    lineHref: `https://line.me/ti/p/~${encodeURIComponent(stripMarks(c.line).trim())}`,
    email: c.email,
    emailHref: `mailto:${stripMarks(c.email).trim()}`,
    facebookHref: site.facebookHref,
    mapHref: site.mapHref,
    mapEmbed: site.mapEmbed,
    navItems: nav,
  };
});

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;
