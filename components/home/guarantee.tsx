import Image from "next/image";

const cards = [
  {
    title: "ตัวอย่างผลงาน",
    text: "ผลงานของเรา ทั้งงานรื้อถอน ก่อสร้าง รีโนเวท ต่อเติม และงานตกแต่งภายใน ทุกชิ้นงานผ่านการควบคุมคุณภาพอย่างดี",
    cta: "ดูผลงานของเรา",
    href: "/works",
    image: "/images/extension/patio-roof.webp",
  },
  {
    title: "ส่งมอบงานด้วยความประทับใจ",
    text: "รายชื่อลูกค้าและคู่ค้าของเรา (บางส่วน) ขอขอบคุณลูกค้าทุกท่านที่ไว้วางใจให้เราดูแล",
    cta: "ดูลูกค้าทั้งหมด",
    href: "#clients",
    image: "/images/construction/thonglor-parking.webp",
  },
  {
    title: "ความรู้เรื่องบ้านและการก่อสร้าง",
    text: "สาระน่ารู้บทความเกี่ยวกับการรื้อถอน การก่อสร้าง การรีโนเวท และการดูแลรักษาบ้าน",
    cta: "ดูบทความทั้งหมด",
    href: "/blog",
    image: "/images/builtin/shelves.webp",
  },
];

export function Guarantee() {
  return (
    <section className="guar">
      <div className="container">
        <div className="head">
          <div>
            <h2>
              <span>การันตี</span>คุณภาพด้านต่างๆ
            </h2>
            <span className="uline left" />
          </div>
          <p>
            <b>บริษัท นวิญญา 1979 จำกัด</b> มีบริการดังต่อไปนี้ งานรื้อถอนทุบตึก งานก่อสร้าง งานรีโนเวท งานต่อเติม งานบิ้วอิน ผ้าม่าน
            วอลเปเปอร์ และประตูม้วน ครบวงจรในที่เดียว
          </p>
        </div>
        <div className="g-grid">
          {cards.map((c) => (
            <div className="g-card" key={c.title}>
              <Image src={c.image} alt="" width={600} height={375} sizes="(max-width: 640px) 100vw, 340px" />
              <div className="b">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <a href={c.href} className="pill-btn">
                  {c.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
