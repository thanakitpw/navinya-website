"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./icons";

export function FloatingContact() {
  const [open, setOpen] = useState(true);

  return (
    <div className={open ? "fab open" : "fab"}>
      <div className="fab-list" id="fab-list" inert={!open}>
        <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="fab-line">
          <span>LINE: {site.line}</span>
          <i>
            <Icon name="chat" />
          </i>
        </a>
        {site.phones.map((p) => (
          <a href={p.href} className="fab-phone" key={p.href}>
            <span>โทร {p.label}</span>
            <i>
              <Icon name="phone" />
            </i>
          </a>
        ))}
        <a href={site.facebookHref} target="_blank" rel="noopener noreferrer" className="fab-fb">
          <span>Facebook</span>
          <i>
            <Icon name="facebook" />
          </i>
        </a>
        <a href={`mailto:${site.email}`} className="fab-mail">
          <span>อีเมล</span>
          <i>
            <Icon name="mail" />
          </i>
        </a>
      </div>
      <button
        type="button"
        className="fab-toggle"
        aria-expanded={open}
        aria-controls="fab-list"
        aria-label={open ? "ยุบปุ่มติดต่อ" : "เปิดปุ่มติดต่อ"}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "x" : "chat"} />
        {!open && <span>ติดต่อเรา</span>}
      </button>
    </div>
  );
}
