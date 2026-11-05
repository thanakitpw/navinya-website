"use client";

import { useRef, useState } from "react";
import { browserClient } from "@/lib/cms/browser";

const BUCKET = "site-media";
const MAX_BYTES = 10 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

const publicUrl = (path: string) => browserClient().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

export function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState<string[] | null>(null);

  async function upload(file: File) {
    setError(null);
    const ext = EXTENSIONS[file.type];
    if (!ext) return setError("รองรับเฉพาะไฟล์ JPG, PNG, WEBP และ AVIF");
    if (file.size > MAX_BYTES) return setError("ไฟล์ต้องมีขนาดไม่เกิน 10MB");
    setBusy(true);
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await browserClient().storage.from(BUCKET).upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) return setError("อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง");
    onChange(publicUrl(path));
  }

  async function openLibrary() {
    setError(null);
    setBusy(true);
    const { data, error } = await browserClient()
      .storage.from(BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    setBusy(false);
    if (error) return setError("เปิดคลังรูปไม่สำเร็จ");
    setLibrary((data ?? []).filter((f) => f.id).map((f) => publicUrl(f.name)));
  }

  return (
    <div className="adm-image">
      {/* Plain img on purpose: any uploaded file must show at once, whatever its size. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt="" className="adm-image-thumb" />
      <div className="adm-image-actions">
        <button type="button" className="adm-btn" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? "กำลังทำงาน…" : "อัปโหลดรูปใหม่"}
        </button>
        <button type="button" className="adm-btn" disabled={busy} onClick={openLibrary}>
          เลือกจากคลัง
        </button>
      </div>
      <input
        ref={input}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
      {error && (
        <p role="alert" className="adm-error">
          {error}
        </p>
      )}
      {library && (
        <div className="adm-library">
          {library.length === 0 && <p className="adm-hint">ยังไม่มีรูปในคลัง</p>}
          {library.map((url) => (
            <button
              type="button"
              key={url}
              onClick={() => {
                onChange(url);
                setLibrary(null);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
          <button type="button" className="adm-library-close" onClick={() => setLibrary(null)}>
            ปิดคลังรูป
          </button>
        </div>
      )}
    </div>
  );
}
