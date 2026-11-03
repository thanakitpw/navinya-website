export type WorkCategory = { slug: string; title: string; heading: string; intro: string; cover: string };

export const workCategories: WorkCategory[] = [
  {
    slug: "demolition",
    title: "งานรื้อถอนทุบตึก",
    heading: "ผลงานรื้อถอนทุบตึก",
    intro: "รื้อถอนอาคาร ห้างสรรพสินค้า โรงงาน และงานรื้อระบบภายใน ทั้งในกรุงเทพฯ และต่างจังหวัด",
    cover: "/images/demolition/ploenchit-excavators.webp",
  },
  {
    slug: "construction",
    title: "งานก่อสร้าง",
    heading: "ผลงานก่อสร้าง",
    intro: "งานก่อสร้าง ลานจอดรถ ติดตั้งลิฟต์ และงานโครงสร้างสำหรับหน่วยงานและภาคเอกชน",
    cover: "/images/construction/crane-lift.webp",
  },
  {
    slug: "renovate",
    title: "งานรีโนเวท",
    heading: "ผลงานรีโนเวท",
    intro: "รีโนเวทออฟฟิศ งานฝ้า งานกระจก อะลูมิเนียม มุ้งลวด และกระเบื้องยาง",
    cover: "/images/renovate/glass-door.webp",
  },
  {
    slug: "extension",
    title: "งานต่อเติม",
    heading: "ผลงานต่อเติม",
    intro: "ต่อเติมห้อง กันสาด หลังคาเมทัลชีท ฝ้าอะลูมิเนียม และปรับปรุงร้านค้า",
    cover: "/images/extension/bedroom.webp",
  },
  {
    slug: "builtin",
    title: "งานบิ้วอิน",
    heading: "ผลงานบิ้วอิน",
    intro: "เฟอร์นิเจอร์บิ้วอิน ชุดครัว ตู้ทีวี ตู้เสื้อผ้า ผลิตและติดตั้งตามขนาดพื้นที่จริง",
    cover: "/images/builtin/tv-wall.webp",
  },
  {
    slug: "curtain",
    title: "ผ้าม่าน วอลเปเปอร์",
    heading: "ผลงานผ้าม่าน วอลเปเปอร์",
    intro: "ผ้าม่าน มู่ลี่ ม่านม้วน สำหรับบ้าน สำนักงาน ร้านค้า และโรงพยาบาล",
    cover: "/images/curtain/bedroom.webp",
  },
  {
    slug: "shutter",
    title: "ประตูม้วน",
    heading: "ผลงานประตูม้วน",
    intro: "ประตูม้วนสำหรับร้านค้า โกดัง อาคารพาณิชย์ ติดตั้งทั่วประเทศ",
    cover: "/images/shutter/warehouse.webp",
  },
  {
    slug: "landfill",
    title: "งานถมดิน ปรับพื้นที่",
    heading: "ผลงานถมดิน ปรับพื้นที่",
    intro: "ถมดิน ปรับระดับพื้นที่ เตรียมที่ดินสำหรับหมู่บ้านจัดสรรและโครงการก่อสร้าง",
    cover: "/images/landfill/aerial.webp",
  },
  {
    slug: "volunteer",
    title: "กิจกรรมจิตอาสา",
    heading: "กิจกรรมจิตอาสา",
    intro: "ทีมงาน บริษัท นวิญญา 1979 จำกัด ร่วมช่วยเหลือสังคมในเหตุการณ์ภัยพิบัติ",
    cover: "/images/volunteer/relief.webp",
  },
];
