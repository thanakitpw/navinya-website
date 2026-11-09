"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { publishPage, saveCopy, saveImages } from "@/app/admin/(dash)/copy/actions";
import { ImageField } from "./image-field";

export type EntryView = {
  key: string;
  label: string;
  fallback: string;
  value: string;
  stale: boolean;
  always: boolean;
  attributeOnly: boolean;
};

type Props = {
  page: string;
  label: string;
  path: string;
  entries: EntryView[];
  images: Record<string, string>;
};

const snapshot = (entries: EntryView[]) => Object.fromEntries(entries.map((e) => [e.key, e.value]));

/** Left: the real page rendered with drafts. Right: every field. Clicking either side finds the other. */
export function CopyEditor({ page, label, path, entries, images: initialImages }: Props) {
  const router = useRouter();
  const frame = useRef<HTMLIFrameElement>(null);

  const [values, setValues] = useState(() => snapshot(entries));
  const [savedValues, setSavedValues] = useState(values);
  const [images, setImages] = useState(initialImages);
  const [savedImages, setSavedImages] = useState(initialImages);
  const [active, setActive] = useState<string | null>(null);
  const [onPage, setOnPage] = useState<string[] | null>(null);
  const [onPageImages, setOnPageImages] = useState<string[]>([]);
  const [workProject, setWorkProject] = useState<string | null>(null);
  const workSlug = path.startsWith("/works/") ? path.slice("/works/".length) : null;
  const [q, setQ] = useState("");
  const [onlyEdited, setOnlyEdited] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const post = useCallback((data: unknown) => {
    frame.current?.contentWindow?.postMessage(data, window.location.origin);
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { type?: string; key?: string; keys?: string[]; images?: string[] };
      if (d?.type === "cms:select" && d.key) {
        setActive(d.key);
        const el = document.getElementById(`copy-${d.key}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.querySelector("textarea")?.focus({ preventScroll: true });
      }
      if (d?.type === "cms:select-image" && d.key) {
        setActive(d.key);
        document.getElementById(`img-${d.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (d?.type === "cms:select-work" && d.key) setWorkProject(d.key);
      if (d?.type === "cms:ready") {
        setOnPage(d.keys ?? []);
        setOnPageImages(d.images ?? []);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const textDirty = entries.some((e) => values[e.key] !== savedValues[e.key]);
  const imageKeys = new Set([...Object.keys(images), ...Object.keys(savedImages)]);
  const imagesDirty = [...imageKeys].some((k) => images[k] !== savedImages[k]);
  const dirty = textDirty || imagesDirty;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    post({ type: "cms:update", key, value });
  };
  const focusKey = (key: string) => {
    setActive(key);
    post({ type: "cms:focus", key });
  };
  const setImage = (src: string, url: string) => {
    setImages((prev) => {
      const next = { ...prev };
      if (url) next[src] = url;
      else delete next[src];
      return next;
    });
    post({ type: "cms:update-image", key: src, value: url || src });
  };

  const needle = q.trim().toLowerCase();
  const shown = entries.filter((e) => {
    if (!e.always && onPage && !onPage.includes(e.key)) return false;
    if (!e.always && !onPage) return false;
    if (onlyEdited && values[e.key] === e.fallback) return false;
    if (!needle) return true;
    return (
      e.label.toLowerCase().includes(needle) ||
      e.fallback.toLowerCase().includes(needle) ||
      (values[e.key] ?? "").toLowerCase().includes(needle)
    );
  });
  const own = shown.filter((e) => e.always);
  const shared = shown.filter((e) => !e.always);

  const changedText = entries.filter((e) => values[e.key] !== e.fallback).length;
  const changedImages = Object.keys(images).length;

  const run = (publish: boolean) =>
    start(async () => {
      setMsg(null);
      const edits = Object.fromEntries(
        entries.filter((e) => values[e.key] !== e.fallback).map((e) => [e.key, values[e.key]]),
      );
      const saved = await saveCopy(page, edits);
      if (!saved.ok) return setMsg({ kind: "err", text: saved.error });

      const changes = Object.fromEntries(
        [...imageKeys].filter((k) => images[k] !== savedImages[k]).map((k) => [k, images[k] ?? ""]),
      );
      if (Object.keys(changes).length) {
        const res = await saveImages(changes);
        if (!res.ok) return setMsg({ kind: "err", text: res.error });
      }
      setSavedValues(values);
      setSavedImages(images);

      if (publish) {
        const res = await publishPage(page, [...new Set([...onPageImages, ...imageKeys])]);
        if (!res.ok) return setMsg({ kind: "err", text: `บันทึกร่างแล้ว แต่เผยแพร่ไม่สำเร็จ: ${res.error}` });
      }
      setMsg({ kind: "ok", text: publish ? "เผยแพร่ขึ้นเว็บจริงแล้ว" : "บันทึกร่างแล้ว เว็บจริงยังไม่เปลี่ยน" });
      router.refresh();
    });

  const field = (e: EntryView) => {
    const edited = values[e.key] !== e.fallback;
    const missing = onPage !== null && !onPage.includes(e.key) && !e.attributeOnly;
    return (
      <li key={e.key} id={`copy-${e.key}`} className={`adm-item${active === e.key ? " on" : edited ? " edited" : ""}`}>
        <div className="adm-item-head">
          <button type="button" onClick={() => focusKey(e.key)} title="ไปที่ข้อความนี้ในหน้าเว็บ">
            {e.label}
          </button>
          {e.attributeOnly && <span title="ข้อความนี้ไม่แสดงเป็นตัวหนังสือบนหน้า เช่น คำอธิบายรูปสำหรับ Google">ไม่แสดงบนหน้า</span>}
          {missing && <span title="อาจอยู่ในส่วนที่ซ่อนอยู่ เช่น ข้อความหลังส่งฟอร์ม">ซ่อนอยู่</span>}
          {e.stale && (
            <span className="adm-chip adm-chip-warn" title="ข้อความตั้งต้นในโค้ดถูกแก้หลังจากจุดนี้ถูกแก้ เว็บจึงกลับไปใช้ค่าจากโค้ด">
              ต้นฉบับเปลี่ยน
            </span>
          )}
          {edited && (
            <>
              <span className="adm-chip adm-chip-draft">แก้แล้ว</span>
              <button type="button" onClick={() => setValue(e.key, e.fallback)}>
                คืนค่าเดิม
              </button>
            </>
          )}
        </div>
        <textarea
          rows={Math.min(6, Math.max(1, Math.ceil(e.fallback.length / 42)))}
          value={values[e.key] ?? ""}
          onFocus={() => focusKey(e.key)}
          onChange={(ev) => setValue(e.key, ev.target.value)}
          className="adm-field"
        />
        {edited && (
          <p className="adm-old">
            <b>เดิม:</b> {e.fallback}
          </p>
        )}
      </li>
    );
  };

  return (
    <div className="adm-editor">
      <div className="adm-bar">
        <p role="status" className={msg ? `adm-msg-${msg.kind}` : undefined}>
          {msg?.text ??
            (changedText + changedImages > 0
              ? `แก้ไปแล้ว ${changedText} ข้อความ${changedImages ? ` · ${changedImages} รูป` : ""}`
              : `คลิกข้อความหรือรูปในหน้าเว็บด้านซ้ายเพื่อแก้${onPageImages.length ? ` · หน้านี้มีรูป ${onPageImages.length} รูป` : ""}`)}
        </p>
        <a href={path} target="_blank" rel="noopener" className="adm-btn">
          เปิดหน้าจริง
        </a>
        <button type="button" onClick={() => run(false)} disabled={pending} className="adm-btn">
          {pending ? "กำลังบันทึก…" : "บันทึกร่าง"}
        </button>
        <button type="button" onClick={() => run(true)} disabled={pending} className="adm-btn adm-btn-solid">
          เผยแพร่ขึ้นเว็บ
        </button>
      </div>

      <div className="adm-split">
        <div className="adm-preview">
          <iframe ref={frame} src={`/api/admin/preview?path=${encodeURIComponent(path)}`} title={`ตัวอย่างหน้า ${label}`} />
        </div>

        <div className="adm-panel">
          <div className="adm-panel-tools">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาข้อความ…" className="adm-field" />
            <label>
              <input type="checkbox" checked={onlyEdited} onChange={(e) => setOnlyEdited(e.target.checked)} />
              เฉพาะจุดที่แก้แล้ว
            </label>
          </div>

          {workSlug && (
            <div className={`adm-works-link${workProject ? " on" : ""}`}>
              <b>{workProject ? `รูปผลงาน "${workProject}"` : "รูปผลงานในหน้านี้"}</b>
              เพิ่ม ลบ เปลี่ยน หรือเรียงรูปผลงานได้ที่หน้า &ldquo;รูปผลงาน&rdquo; (ขึ้นเว็บทันที ไม่ต้องกดเผยแพร่)
              <br />
              <a
                href={`/admin/works/${workSlug}${workProject ? `?project=${encodeURIComponent(workProject)}` : ""}`}
                className="adm-btn adm-btn-solid"
              >
                จัดการรูปผลงาน →
              </a>
            </div>
          )}

          <ul className="adm-list">
            {own.map(field)}
            {shared.length > 0 && (
              <li className="adm-list-head">
                <b>ใช้ร่วมกันทุกหน้า</b>
                แก้ตรงนี้แล้วจะเปลี่ยนทุกหน้าที่ใช้ข้อความเดียวกัน
              </li>
            )}
            {shared.map(field)}
            {shown.length === 0 && <li className="adm-empty">ไม่พบข้อความ</li>}

            {onPageImages.length > 0 && (
              <li className="adm-list-head">
                <b>รูปภาพในหน้านี้</b>
                รูปเดียวกันที่ใช้หลายหน้าจะเปลี่ยนพร้อมกันทุกหน้า
              </li>
            )}
            {onPageImages.map((src) => (
              <li key={src} id={`img-${src}`} className={`adm-item${active === src ? " on" : images[src] ? " edited" : ""}`}>
                <div className="adm-item-head">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(src);
                      post({ type: "cms:focus-image", key: src });
                    }}
                    title="ไปที่รูปนี้ในหน้าเว็บ"
                  >
                    {src.split("/").pop()}
                  </button>
                  {images[src] && (
                    <>
                      <span className="adm-chip adm-chip-draft">เปลี่ยนแล้ว</span>
                      <button type="button" onClick={() => setImage(src, "")}>
                        คืนค่าเดิม
                      </button>
                    </>
                  )}
                </div>
                <ImageField value={images[src] ?? src} onChange={(url) => setImage(src, url)} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
