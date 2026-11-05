import { workCategories } from "@/lib/work-categories";
import { globalCopy } from "./global";
import { homeCopy } from "./home";
import { aboutCopy, blogCopy, certificatesCopy, contactCopy, teamCopy, worksCopy } from "./pages";

export const CONTENT = {
  global: globalCopy,
  home: homeCopy,
  about: aboutCopy,
  team: teamCopy,
  certificates: certificatesCopy,
  contact: contactCopy,
  works: worksCopy,
  blog: blogCopy,
};

export type Content = typeof CONTENT;
export type Scope = keyof Content;

/** One row on the admin page list. `scope` is where its own text is stored. */
export type CopyPage = {
  label: string;
  path: string;
  group: string;
  scope: Scope;
  /** Shared text that belongs to this page, for pages with no text of their own. */
  focus?: string;
  note?: string;
};

export const COPY_PAGES: Record<string, CopyPage> = {
  home: { label: "หน้าแรก", path: "/", group: "หน้าเว็บหลัก", scope: "home" },
  about: { label: "ประวัติบริษัท", path: "/about", group: "หน้าเว็บหลัก", scope: "about" },
  team: { label: "ทีมงานของเรา", path: "/about/team", group: "หน้าเว็บหลัก", scope: "team" },
  certificates: { label: "ใบรับรอง / ใบอนุญาต", path: "/about/certificates", group: "หน้าเว็บหลัก", scope: "certificates" },
  contact: { label: "ติดต่อเรา", path: "/contact", group: "หน้าเว็บหลัก", scope: "contact" },
  works: { label: "ผลงาน (หน้ารวม)", path: "/works", group: "หน้าเว็บหลัก", scope: "works" },
  blog: {
    label: "บทความ (หน้ารวม)",
    path: "/blog",
    group: "หน้าเว็บหลัก",
    scope: "blog",
    note: "เฉพาะหัวข้อและปุ่ม ไม่รวมเนื้อหาบทความ",
  },
  ...Object.fromEntries(
    workCategories.map((c, i) => [
      `work-${c.slug}`,
      {
        label: c.title,
        path: `/works/${c.slug}`,
        group: "หน้าผลงานแต่ละประเภท",
        scope: "global" as const,
        focus: `works.${i}`,
      },
    ]),
  ),
  global: {
    label: "ส่วนกลาง (ใช้ทุกหน้า)",
    path: "/",
    group: "ใช้ร่วมกันทั้งเว็บ",
    scope: "global",
    note: "เบอร์โทร ที่อยู่ เมนู ท้ายเว็บ ชื่อบริการ",
  },
};

const SECTIONS: Record<string, string> = {
  banners: "แบนเนอร์",
  intro: "แนะนำบริษัท",
  services: "บริการ",
  promos: "โปรโมชั่น",
  trust: "วิดีโอการันตี",
  awards: "ผลงานคุณภาพ",
  clients: "ลูกค้า",
  packages: "บริการยอดนิยม",
  videoGroups: "วิดีโอผลงาน",
  demolition: "บริการรื้อถอน",
  contactBand: "แถบติดต่อ",
  whyUs: "ทำไมต้องเรา",
  team: "สไลด์ทีมงาน",
  guarantee: "การันตีคุณภาพ",
  hotline: "ฮอตไลน์",
  blog: "บทความ",
  seo: "ข้อความท้ายหน้า",
  head: "หัวหน้า",
  facts: "ตัวเลข",
  timeline: "เส้นทางของเรา",
  info: "ข้อมูลบริษัท",
  photos: "รูปบรรยากาศ",
  registration: "เอกสาร",
  quote: "ฟอร์มใบเสนอราคา",
  form: "ช่องในฟอร์ม",
  details: "ช่องทางติดต่อ",
  steps: "ขั้นตอน",
  article: "ข้างบทความ",
  contact: "ข้อมูลติดต่อ",
  nav: "เมนู",
  works: "ประเภทผลงาน",
  workLabels: "หน้าผลงาน",
  footer: "ท้ายเว็บ",
  bottomBar: "แถบล่าง",
  floating: "ปุ่มลอย",
  cookie: "แจ้งเตือนคุกกี้",
};

/** "home:intro.p1.1.b" becomes "แนะนำบริษัท · p1 · ข้อ 2", readable without knowing the data shape. */
export function labelOfKey(key: string) {
  const [first, ...rest] = key.slice(key.indexOf(":") + 1).split(".");
  const tail = rest.filter((p, i) => !(i === rest.length - 1 && (p === "b" || p === "text")));
  return [SECTIONS[first] ?? first, ...tail.map((p) => (/^\d+$/.test(p) ? `ข้อ ${Number(p) + 1}` : p))].join(" · ");
}
