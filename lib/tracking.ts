// Google Tag Manager runs the GA4 and Google Ads tags; the site only loads the containers,
// tells Google what the visitor consented to, and pushes the events those tags convert on.

// Two containers share one dataLayer: one holds the Google Ads tags, the other GA4.
export const GTM_IDS = ["GTM-M42T5LSW", "GTM-5Q4X8FFZ"];
export const CONSENT_KEY = "navinya-cookie-consent";

export type Consent = { analytics: boolean; marketing: boolean };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** The visitor's saved choice, or null when they still have to be asked. */
export function readConsent(): Consent | null {
  try {
    const v = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null");
    // Answers saved before the advertising choice existed don't cover ads, so those visitors are asked again.
    if (v && typeof v.analytics === "boolean" && typeof v.marketing === "boolean") {
      return { analytics: v.analytics, marketing: v.marketing };
    }
  } catch {}
  return null;
}

export function saveConsent(c: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, at: new Date().toISOString() }));
  } catch {}
  // gtag only exists while the container is loaded (not in CMS preview).
  const g = (on: boolean) => (on ? "granted" : "denied");
  window.gtag?.("consent", "update", {
    analytics_storage: g(c.analytics),
    ad_storage: g(c.marketing),
    ad_user_data: g(c.marketing),
    ad_personalization: g(c.marketing),
  });
}

export function track(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer?.push({ event, ...params });
}

/** "081-496-0564" becomes "+66814960564", the E.164 form Google Ads enhanced conversions expects. */
export function toE164(phone: string | null) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (!digits) return undefined;
  if (digits.startsWith("66")) return `+${digits}`;
  return `+66${digits.replace(/^0/, "")}`;
}
