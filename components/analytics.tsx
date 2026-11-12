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

/** Loads the GTM containers and reports clicks on phone and LINE links anywhere on the page as conversion events. */
export function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      const href = link?.getAttribute("href");
      if (!href) return;
      if (href.startsWith("tel:")) track("phone_click", { phone_number: href.slice(4) });
      else if (href.startsWith("https://line.me/")) track("line_click", { link_url: href });
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
