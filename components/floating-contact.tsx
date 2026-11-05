"use client";

import { useState } from "react";
import type { globalCopy } from "@/lib/content/global";
import { Icon } from "./icons";

type Props = {
  line: string;
  lineHref: string;
  phones: { label: string; href: string }[];
  facebookHref: string;
  emailHref: string;
  copy: typeof globalCopy.floating;
};

export function FloatingContact({ line, lineHref, phones, facebookHref, emailHref, copy }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className={open ? "fab open" : "fab"}>
      <div className="fab-list" id="fab-list" inert={!open}>
        <a href={lineHref} target="_blank" rel="noopener noreferrer" className="fab-line">
          <span>{copy.linePrefix}{line}</span>
          <i>
            <Icon name="chat" />
          </i>
        </a>
        {phones.map((p) => (
          <a href={p.href} className="fab-phone" key={p.href}>
            <span>{copy.phonePrefix}{p.label}</span>
            <i>
              <Icon name="phone" />
            </i>
          </a>
        ))}
        <a href={facebookHref} target="_blank" rel="noopener noreferrer" className="fab-fb">
          <span>{copy.facebook}</span>
          <i>
            <Icon name="facebook" />
          </i>
        </a>
        <a href={emailHref} className="fab-mail">
          <span>{copy.email}</span>
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
        {!open && <span>{copy.open}</span>}
      </button>
    </div>
  );
}
