import { browserClient } from "./browser";

const BUCKET = "works";
const MAX_SIDE = 2000;
const QUALITY = 0.82;

export type UploadedPhoto = { path: string; width: number; height: number };

/**
 * Shrinks a photo to at most 2000px on its long side, converts it to WebP in the browser and
 * uploads it to the works bucket. Phone photos are 5-10MB; this keeps them a few hundred KB.
 */
export async function uploadWorkPhoto(service: string, file: File): Promise<UploadedPhoto> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`เปิดไฟล์ ${file.name} ไม่ได้ ใช้ได้เฉพาะ JPG, PNG, WEBP`);
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
  // Safari can't encode WebP and hands back a PNG instead, which would be far too big. Use JPEG there.
  let blob = await encode("image/webp");
  if (blob?.type !== "image/webp") blob = await encode("image/jpeg");
  if (!blob) throw new Error(`แปลงไฟล์ ${file.name} ไม่สำเร็จ`);

  const path = `${service}/${crypto.randomUUID()}.${blob.type === "image/webp" ? "webp" : "jpg"}`;
  const { error } = await browserClient().storage.from(BUCKET).upload(path, blob, { contentType: blob.type });
  if (error) throw new Error(`อัปโหลด ${file.name} ไม่สำเร็จ ลองใหม่อีกครั้ง`);
  return { path, width, height };
}
