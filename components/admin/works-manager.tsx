"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  addPhotos,
  deletePhotos,
  renameProject,
  reorderPhotos,
  replacePhoto,
  type ActionResult,
  type NewPhoto,
} from "@/app/admin/(dash)/works/actions";
import { uploadWorkPhoto } from "@/lib/cms/work-upload";

export type AdminPhoto = { id: string; project: string; src: string; w: number; h: number };
type Project = { name: string; photos: AdminPhoto[] };

const ACCEPT = "image/jpeg,image/png,image/webp";

// Projects show in the order of their first photo, the same rule as the public page.
function group(list: AdminPhoto[]): Project[] {
  const map = new Map<string, AdminPhoto[]>();
  for (const p of list) map.set(p.project, [...(map.get(p.project) ?? []), p]);
  return [...map].map(([name, photos]) => ({ name, photos }));
}

const move = <T,>(arr: T[], from: number, to: number) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export function WorksManager({
  service,
  path,
  photos,
  focus,
}: {
  service: string;
  path: string;
  photos: AdminPhoto[];
  focus?: string;
}) {
  const router = useRouter();
  const [list, setList] = useState(photos);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [renaming, setRenaming] = useState<{ from: string; to: string } | null>(null);
  const [newName, setNewName] = useState("");
  const picker = useRef<HTMLInputElement>(null);
  // What the next file pick is for: new photos in a project, or replacing one photo.
  const pickFor = useRef<{ kind: "add"; project: string } | { kind: "replace"; id: string } | null>(null);

  // Fresh rows after router.refresh() replace the optimistic list.
  const [seen, setSeen] = useState(photos);
  if (seen !== photos) {
    setSeen(photos);
    setList(photos);
  }

  useEffect(() => {
    if (!focus) return;
    document.getElementById(`proj-${focus}`)?.scrollIntoView({ block: "start" });
  }, [focus]);

  const projects = group(list);

  async function act(label: string, work: () => Promise<ActionResult>, done: string) {
    setBusy(label);
    setMsg(null);
    try {
      const res = await work();
      if (!res.ok) setMsg({ kind: "err", text: res.error });
      else setMsg({ kind: "ok", text: done });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" });
    }
    setBusy(null);
    router.refresh();
  }

  const saveOrder = (next: AdminPhoto[]) => {
    setList(next);
    void act("กำลังบันทึกลำดับ…", () => reorderPhotos(next.map((p) => p.id)), "บันทึกลำดับแล้ว ขึ้นเว็บจริงแล้ว");
  };

  const moveProject = (index: number, dir: -1 | 1) => {
    const next = move(projects, index, index + dir);
    saveOrder(next.flatMap((p) => p.photos));
  };

  const movePhoto = (project: Project, index: number, dir: -1 | 1) => {
    const reordered = move(project.photos, index, index + dir);
    saveOrder(projects.flatMap((p) => (p.name === project.name ? reordered : p.photos)));
  };

  async function uploadAll(files: File[]): Promise<{ done: NewPhoto[]; errors: string[] }> {
    const done: NewPhoto[] = [];
    const errors: string[] = [];
    for (const [i, file] of files.entries()) {
      setBusy(`กำลังอัปโหลด ${i + 1}/${files.length}…`);
      try {
        done.push(await uploadWorkPhoto(service, file));
      } catch (e) {
        errors.push(e instanceof Error ? e.message : file.name);
      }
    }
    return { done, errors };
  }

  async function onFiles(files: File[]) {
    const target = pickFor.current;
    pickFor.current = null;
    if (!target || !files.length) return;

    if (target.kind === "replace") {
      await act(
        "กำลังเปลี่ยนรูป…",
        async () => replacePhoto(target.id, await uploadWorkPhoto(service, files[0])),
        "เปลี่ยนรูปแล้ว ขึ้นเว็บจริงแล้ว",
      );
      return;
    }

    setMsg(null);
    const { done, errors } = await uploadAll(files);
    if (done.length) {
      await act("กำลังบันทึก…", () => addPhotos(service, target.project, done), `เพิ่ม ${done.length} รูปแล้ว ขึ้นเว็บจริงแล้ว`);
      if (target.project === newName.trim()) setNewName("");
    } else setBusy(null);
    if (errors.length) setMsg({ kind: "err", text: errors.join(" · ") });
  }

  const pick = (target: NonNullable<typeof pickFor.current>, multiple: boolean) => {
    pickFor.current = target;
    if (!picker.current) return;
    picker.current.multiple = multiple;
    picker.current.click();
  };

  const disabled = busy !== null;

  return (
    <div className="adm-works">
      <div className="adm-bar">
        <p role="status" className={msg ? `adm-msg-${msg.kind}` : undefined}>
          {busy ?? msg?.text ?? `${projects.length} โครงการ · ${list.length} รูป · แก้แล้วขึ้นเว็บจริงทันที`}
        </p>
        <a href={path} target="_blank" rel="noopener" className="adm-btn">
          เปิดหน้าจริง
        </a>
      </div>

      <div className="adm-page adm-works-body">
        <section className="adm-work-new">
          <h2>เพิ่มโครงการใหม่</h2>
          <p className="adm-hint">ใส่ชื่อโครงการแล้วเลือกรูป (เลือกได้หลายรูปพร้อมกัน) โครงการใหม่จะอยู่ท้ายหน้า เลื่อนขึ้นได้ภายหลัง</p>
          <div className="adm-work-new-row">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="เช่น ร้าน Swensen's แหลมบาลีฮาย พัทยา"
              className="adm-field"
              maxLength={200}
            />
            <button
              type="button"
              className="adm-btn adm-btn-solid"
              disabled={disabled || !newName.trim()}
              onClick={() => pick({ kind: "add", project: newName.trim() }, true)}
            >
              เลือกรูปและสร้าง
            </button>
          </div>
        </section>

        {projects.length === 0 && <p className="adm-empty">ยังไม่มีรูปผลงานในหมวดนี้</p>}

        {projects.map((project, pi) => (
          <section key={project.name} id={`proj-${project.name}`} className={`adm-proj${focus === project.name ? " on" : ""}`}>
            <div className="adm-proj-head">
              {renaming?.from === project.name ? (
                <form
                  className="adm-proj-rename"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const { from, to } = renaming;
                    setRenaming(null);
                    if (to.trim() && to.trim() !== from) {
                      void act("กำลังเปลี่ยนชื่อ…", () => renameProject(service, from, to), "เปลี่ยนชื่อโครงการแล้ว");
                    }
                  }}
                >
                  <input
                    autoFocus
                    value={renaming.to}
                    onChange={(e) => setRenaming({ from: project.name, to: e.target.value })}
                    className="adm-field"
                    maxLength={200}
                  />
                  <button type="submit" className="adm-btn adm-btn-solid">
                    บันทึก
                  </button>
                  <button type="button" className="adm-btn" onClick={() => setRenaming(null)}>
                    ยกเลิก
                  </button>
                </form>
              ) : (
                <h2>
                  {project.name} <small>{project.photos.length} รูป</small>
                </h2>
              )}
              <div className="adm-proj-tools">
                <button type="button" className="adm-btn" disabled={disabled || pi === 0} onClick={() => moveProject(pi, -1)} title="เลื่อนโครงการขึ้น">
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn"
                  disabled={disabled || pi === projects.length - 1}
                  onClick={() => moveProject(pi, 1)}
                  title="เลื่อนโครงการลง"
                >
                  ↓
                </button>
                <button type="button" className="adm-btn" disabled={disabled} onClick={() => setRenaming({ from: project.name, to: project.name })}>
                  เปลี่ยนชื่อ
                </button>
                <button type="button" className="adm-btn adm-btn-solid" disabled={disabled} onClick={() => pick({ kind: "add", project: project.name }, true)}>
                  + เพิ่มรูป
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-danger"
                  disabled={disabled}
                  onClick={() => {
                    if (!confirm(`ลบโครงการ "${project.name}" และรูปทั้ง ${project.photos.length} รูป?\nลบแล้วกู้คืนไม่ได้`)) return;
                    setList((l) => l.filter((p) => p.project !== project.name));
                    void act("กำลังลบ…", () => deletePhotos(project.photos.map((p) => p.id)), "ลบโครงการแล้ว");
                  }}
                >
                  ลบโครงการ
                </button>
              </div>
            </div>

            <ul className="adm-photos">
              {project.photos.map((photo, i) => (
                <li key={photo.id}>
                  <Image src={photo.src} alt="" width={200} height={Math.round((200 * photo.h) / photo.w)} sizes="200px" />
                  <span className="adm-photo-no">{i + 1}</span>
                  <div className="adm-photo-tools">
                    <button type="button" disabled={disabled || i === 0} onClick={() => movePhoto(project, i, -1)} title="เลื่อนไปก่อนหน้า">
                      ‹
                    </button>
                    <button type="button" disabled={disabled} onClick={() => pick({ kind: "replace", id: photo.id }, false)}>
                      เปลี่ยน
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      className="danger"
                      onClick={() => {
                        if (!confirm("ลบรูปนี้? ลบแล้วกู้คืนไม่ได้")) return;
                        setList((l) => l.filter((p) => p.id !== photo.id));
                        void act("กำลังลบ…", () => deletePhotos([photo.id]), "ลบรูปแล้ว");
                      }}
                    >
                      ลบ
                    </button>
                    <button
                      type="button"
                      disabled={disabled || i === project.photos.length - 1}
                      onClick={() => movePhoto(project, i, 1)}
                      title="เลื่อนไปถัดไป"
                    >
                      ›
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <input
        ref={picker}
        type="file"
        hidden
        accept={ACCEPT}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          void onFiles(files);
        }}
      />
    </div>
  );
}
