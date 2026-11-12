import { PreviewBridge } from "@/components/admin/preview-bridge";
import { Analytics } from "@/components/analytics";
import { BottomBar } from "@/components/bottom-bar";
import { CmsImageProvider } from "@/components/cms-image";
import { CookieConsent } from "@/components/cookie-consent";
import { FloatingContact } from "@/components/floating-contact";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { IconSprite } from "@/components/icons";
import { getImageOverrides } from "@/lib/cms/read";
import { inPreview } from "@/lib/cms/server";
import { getSiteData } from "@/lib/site-data";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [site, overrides, preview] = await Promise.all([getSiteData(), getImageOverrides(), inPreview()]);
  return (
    <CmsImageProvider value={{ overrides, preview }}>
      <IconSprite />
      <Header nav={site.navItems} quoteLabel={site.nav.quote} />
      <main>{children}</main>
      <Footer />
      <FloatingContact
        line={site.line}
        lineHref={site.lineHref}
        phones={site.phones}
        facebookHref={site.facebookHref}
        emailHref={site.emailHref}
        copy={site.floating}
      />
      <BottomBar />
      <CookieConsent copy={site.cookie} />
      {/* Editors previewing drafts would count as visitors and leads, so they are not tracked. */}
      {preview ? <PreviewBridge /> : <Analytics />}
    </CmsImageProvider>
  );
}
