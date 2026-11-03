"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mainNav } from "@/lib/site";
import { Icon } from "./icons";
import { LogoBadge } from "./logo-badge";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : href.startsWith("/") && pathname.startsWith(href));

  return (
    <>
      <header>
        <div className="wrap">
          <Link href="/" className="logo" aria-label="บริษัท นวิญญา 1979 จำกัด หน้าแรก">
            <LogoBadge priority />
          </Link>
          <nav className="main">
            <ul>
              {mainNav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={isActive(item.href) ? "active" : undefined}>
                    {item.label}
                    {item.children && <Icon name="down" className="caret" />}
                  </Link>
                  {item.children && (
                    <div className="drop">
                      {item.children.map((c) => (
                        <Link key={c.label} href={c.href}>
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/contact#quote" className="hd-quote">
            <Icon name="quote" />
            ขอใบเสนอราคา
          </Link>
          <button className="burger" aria-label="เมนู" aria-expanded={open} onClick={() => setOpen(true)}>
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <div
        className={open ? "mnav open" : "mnav"}
        inert={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <div className="p">
          {mainNav.map((item) => (
            <div key={item.label}>
              <Link href={item.href}>{item.label}</Link>
              {item.children?.map((c) => (
                <Link key={c.label} className="sub" href={c.href}>
                  {c.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
