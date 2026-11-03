import { workCategories } from "./work-categories";

const phones = [
  { label: "094-379-9187", href: "tel:0943799187" },
  { label: "081-496-0564", href: "tel:0814960564" },
];

const address = "417 ซอยรามอินทรา 39 แยก 2 แขวงท่าแร้ง เขตบางเขน กรุงเทพมหานคร 10220";

export const site = {
  name: "บริษัท นวิญญา 1979 จำกัด",
  company: "บริษัท นวิญญา 1979 จำกัด",
  companyEn: "NAVINYA 1979 COMPANY LIMITED",
  title: "บริษัท นวิญญา 1979 จำกัด | รับเหมาก่อสร้าง รื้อถอนทุบตึก รีโนเวท ต่อเติม บิ้วอิน",
  description:
    "รับรื้อถอนทุบตึก ก่อสร้าง รีโนเวท ต่อเติม บิ้วอิน ผ้าม่าน วอลเปเปอร์ และประตูม้วน ครบวงจร",
  url: "https://www.navinya1979.com",
  phones,
  phone: phones[0].label,
  phoneHref: phones[0].href,
  line: "navinya_1979",
  lineHref: "https://line.me/ti/p/~navinya_1979",
  facebookHref: "https://www.facebook.com/profile.php?id=61595478925526",
  mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`,
  email: "Navinya2522@gmail.com",
  address,
};

export type Service = { name: string; href: string; image: string; summary: string };

export const services: Service[] = [
  {
    name: "งานรื้อถอนทุบตึก",
    href: "/works/demolition",
    image: "/images/demolition/khaosan.webp",
    summary: "รับรื้อถอนบ้าน อาคาร ตึกแถว โรงงาน ด้วยเครื่องจักรหนัก ขนย้ายเศษวัสดุ เคลียร์พื้นที่พร้อมก่อสร้างใหม่",
  },
  {
    name: "งานก่อสร้าง",
    href: "/works/construction",
    image: "/images/construction/crane-lift.webp",
    summary: "รับสร้างบ้าน อาคารพาณิชย์ โกดัง โรงงาน ตั้งแต่งานฐานรากจนส่งมอบ ควบคุมงานโดยวิศวกร",
  },
  {
    name: "งานรีโนเวท",
    href: "/works/renovate",
    image: "/images/renovate/glass-door.webp",
    summary: "ปรับปรุงบ้านเก่า คอนโด ร้านค้า ออฟฟิศ ให้กลับมาสวยใหม่ ทั้งงานโครงสร้าง งานระบบ และงานตกแต่ง",
  },
  {
    name: "งานต่อเติม",
    href: "/works/extension",
    image: "/images/extension/bedroom.webp",
    summary: "ต่อเติมครัว โรงจอดรถ ห้องนอน ชั้นลอย กันสาด ออกแบบให้กลมกลืนกับบ้านเดิม ถูกหลักวิศวกรรม",
  },
  {
    name: "งานบิ้วอิน",
    href: "/works/builtin",
    image: "/images/builtin/tv-wall.webp",
    summary: "เฟอร์นิเจอร์บิ้วอินตามขนาดพื้นที่จริง ชุดครัว ตู้เสื้อผ้า ตู้ทีวี ตู้โชว์ เลือกวัสดุได้ตามงบประมาณ",
  },
  {
    name: "ผ้าม่าน วอลเปเปอร์",
    href: "/works/curtain",
    image: "/images/curtain/bedroom.webp",
    summary: "ม่านจีบ ม่านลอน ม่านม้วน มู่ลี่ และวอลเปเปอร์หลากหลายลาย บริการวัดพื้นที่และติดตั้งถึงบ้าน",
  },
  {
    name: "ประตูม้วน",
    href: "/works/shutter",
    image: "/images/shutter/warehouse.webp",
    summary: "ประตูม้วนเหล็ก สแตนเลส ประตูม้วนไฟฟ้า สำหรับบ้าน ร้านค้า โกดัง ติดตั้งใหม่ ซ่อม และบำรุงรักษา",
  },
];

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

const serviceLinks: NavLink[] = services.map((s) => ({ label: s.name, href: s.href }));

export const mainNav: NavItem[] = [
  { label: "หน้าแรก", href: "/" },
  {
    label: "เกี่ยวกับเรา",
    href: "/about",
    children: [
      { label: "ประวัติบริษัท", href: "/about" },
      { label: "ทีมงานของเรา", href: "/about/team" },
      { label: "ใบรับรอง / ใบอนุญาต", href: "/about/certificates" },
    ],
  },
  { label: "บริการของเรา", href: "/#services", children: serviceLinks },
  {
    label: "ผลงาน",
    href: "/works",
    children: workCategories.map((c) => ({ label: c.title, href: `/works/${c.slug}` })),
  },
  { label: "ติดต่อเรา", href: "/contact" },
];
