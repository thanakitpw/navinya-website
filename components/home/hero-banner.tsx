import { Carousel } from "@/components/carousel";
import { CmsImage } from "@/components/cms-image";
import { getCopy } from "@/lib/cms/read";

export async function HeroBanner() {
  const { banners } = await getCopy("home");
  const slides = banners.map((b, k) => (
    <CmsImage
      key={b.src}
      className="hero-img"
      src={b.src}
      alt={b.alt}
      width={940}
      height={415}
      // Already sized and compressed WebP at 2x the slide's max width; skip re-optimizing.
      unoptimized
      loading={k === 0 ? "eager" : "lazy"}
      fetchPriority={k === 0 ? "high" : "auto"}
    />
  ));

  return (
    <section className="banner">
      <Carousel slides={slides} dots />
    </section>
  );
}
