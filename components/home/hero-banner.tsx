import Image from "next/image";
import { Carousel } from "@/components/carousel";

// Ready-made 940x415 banners from the client; the text and contacts are part of the image.
const banners = [
  {
    src: "/images/hero/hero-1.webp",
    alt: "บริษัท นวิญญา 1979 จำกัด รับเหมา รื้อถอน ทุบตึก ก่อสร้าง ต่อเติม รีโนเวท ผ้าม่าน วอลเปเปอร์ ประตูม้วน ครบวงจร",
  },
  {
    src: "/images/hero/hero-2.webp",
    alt: "ควบคุมงานด้วยช่างที่มีประสบการณ์และวิศวกร รับเหมา รื้อถอน ทุบตึก ก่อสร้าง ต่อเติม รีโนเวท",
  },
  {
    src: "/images/hero/hero-3.webp",
    alt: "ทีมงานและช่างที่มีประสบการณ์ คัดสรรทีมงานมืออาชีพ ดูแลทุกขั้นตอน",
  },
  {
    src: "/images/hero/hero-4.webp",
    alt: "ผลงานจริง รีวิวจากลูกค้า งานคุณภาพโดยทีมงานมืออาชีพ ครบวงจร",
  },
];

export function HeroBanner() {
  const slides = banners.map((b, k) => (
    <Image
      key={b.src}
      className="hero-img"
      src={b.src}
      alt={b.alt}
      width={940}
      height={415}
      // Already sized and compressed WebP at the slide's max width; skip re-optimizing.
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
