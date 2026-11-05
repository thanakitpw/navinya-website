import { Awards } from "@/components/home/awards";
import { Blog } from "@/components/home/blog";
import { Clients } from "@/components/home/clients";
import { ContactBand } from "@/components/home/contact-band";
import { DemolitionTypes } from "@/components/home/demolition-types";
import { Guarantee } from "@/components/home/guarantee";
import { HeroBanner } from "@/components/home/hero-banner";
import { Hotline } from "@/components/home/hotline";
import { Intro } from "@/components/home/intro";
import { Packages } from "@/components/home/packages";
import { Promos } from "@/components/home/promos";
import { SeoText } from "@/components/home/seo-text";
import { Services } from "@/components/home/services";
import { TeamSlider } from "@/components/home/team-slider";
import { TrustVideos } from "@/components/home/trust-videos";
import { VideoGroups } from "@/components/home/video-groups";
import { WhyUs } from "@/components/home/why-us";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <Intro />
      <Services />
      <Promos />
      <TrustVideos />
      <Awards />
      <Clients />
      <Packages />
      <VideoGroups />
      <DemolitionTypes />
      <ContactBand />
      <WhyUs />
      <TeamSlider />
      <Guarantee />
      <Hotline />
      <Blog />
      <SeoText />
    </>
  );
}
