import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { BottomBar } from "@/components/bottom-bar";
import { FloatingContact } from "@/components/floating-contact";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { IconSprite } from "@/components/icons";
import { site } from "@/lib/site";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={kanit.variable}>
      <body>
        <IconSprite />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
        <BottomBar />
      </body>
    </html>
  );
}
