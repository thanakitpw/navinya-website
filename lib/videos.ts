import { storageUrl } from "./supabase-rest";

// Clips live in the public Supabase "videos" bucket under home/; posters are local webp frames.
export type Video = { caption: string; file: string; poster: string; vertical?: boolean };

export function videoSrc(file: string) {
  return storageUrl("videos", `home/${file}.mp4`);
}

const clip = (file: string, caption: string, vertical = false): Video => ({
  caption,
  file,
  poster: `/images/videos/${file}.webp`,
  vertical,
});

export const trustVideos = [
  clip("warehouse-aerial", "มุมสูงอาคารโกดังหลังคาเมทัลชีท"),
  clip("roof-truss-crane", "ยกโครงหลังคาเหล็กด้วยเครน"),
  clip("roof-frame-aerial", "มุมสูงงานขึ้นโครงหลังคาเหล็ก"),
];

export const videoGroups: { title: string; videos: Video[]; cols: 2 | 4 }[] = [
  {
    title: "งานโครงสร้างเหล็ก หลังคาเมทัลชีท",
    cols: 2,
    videos: [
      clip("metal-roof-structure", "โครงหลังคาเหล็กพร้อมแผ่นเมทัลชีท"),
      clip("open-shed-handover", "อาคารโล่งหลังคาเมทัลชีท พร้อมส่งมอบ"),
    ],
  },
  {
    title: "คลิปจากหน้างาน",
    cols: 4,
    videos: [
      clip("steel-frame-drone", "ขึ้นโครงเหล็กอาคาร มุมโดรน", true),
      clip("steel-frame-roadside", "ขึ้นโครงเหล็กอาคารริมถนน", true),
      clip("truss-delivery", "ขนส่งโครงหลังคาเหล็กเข้าหน้างาน", true),
      clip("demolition-debris", "รื้อถอนและขนเศษวัสดุด้วยรถขุด", true),
    ],
  },
];
