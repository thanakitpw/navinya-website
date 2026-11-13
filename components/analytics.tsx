"use client";

import Script from "next/script";
import { useEffect } from "react";
import { CONSENT_KEY, GTM_IDS, track } from "@/lib/tracking";

// Consent defaults must reach the dataLayer before any gtm.js, so both happen in one script, in order.
// Everything starts denied until the visitor says otherwise (PDPA); a saved answer is applied up front.
const bootstrap = `
window.dataLayer=window.dataLayer||[];
window.gtag=function(){dataLayer.push(arguments);};
var c=null;try{c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}));}catch(e){}
if(!c||typeof c.marketing!=="boolean")c={};
var g=function(on){return on===true?"granted":"denied";};
gtag("consent","default",{analytics_storage:g(c.analytics),ad_storage:g(c.marketing),ad_user_data:g(c.marketing),ad_personalization:g(c.marketing)});
dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});
${JSON.stringify(GTM_IDS)}.forEach(function(id){var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtm.js?id="+id;document.head.appendChild(s);});
`;

/** Which kind of contact button a link is, judged by where it goes, so new buttons are tracked without extra markup. */
function eventFor(link: HTMLAnchorElement): string | null {
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("mailto:")) return "email_click";
  if (href.startsWith("https://line.me/")) return "line_click";
  if (/^https:\/\/(www\.|m\.)?facebook\.com\//.test(href)) return "facebook_click";
  if (/^https:\/\/(maps\.app\.goo\.gl|(www\.)?google\.[a-z.]+\/maps|goo\.gl\/maps)/.test(href)) return "map_click";
  // Quote buttons lead to the contact page; the plain "ติดต่อเรา" menu item does not count as one.
  if (href.startsWith("/contact") && (href.includes("#quote") || /เสนอราคา/.test(link.textContent ?? ""))) {
    return "quote_click";
  }
  return null;
}

// The same button appears in several places (header, bottom bar, floating button, page body);
// the first match here names the place, so reports can tell them apart.
const PLACES: [selector: string, name: string][] = [
  [".fab", "floating_button"],
  [".bbar", "bottom_bar"],
  ["header", "header"],
  ["footer", "footer"],
  [".qf-done", "quote_form_done"],
  [".bl-side", "blog_sidebar"],
];

function placeOf(el: Element) {
  for (const [selector, name] of PLACES) if (el.closest(selector)) return name;
  const section = el.closest("section");
  return section?.id || section?.classList[0] || "page";
}

/** Loads the GTM containers and reports every contact and quote button click as its own event. */
export function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const event = eventFor(link);
      if (!event) return;
      track(event, {
        button_location: placeOf(link),
        button_text: (link.textContent?.trim() || link.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 100),
        link_url: link.getAttribute("href"),
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <Script id="gtm" strategy="afterInteractive">
      {bootstrap}
    </Script>
  );
}
