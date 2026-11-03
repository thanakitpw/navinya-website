"use client";

import { useState, type FormEvent } from "react";
import { services, site } from "@/lib/site";
import { supabase } from "@/lib/supabase";

const jobTypes = [...services.map((s) => s.name), "งานถมดิน ปรับพื้นที่", "อื่น ๆ"];
const channels = ["โทรศัพท์", "LINE", "อีเมล"];
const maxFiles = 10;
const maxFileSize = 10 * 1024 * 1024;

type Status = "idle" | "sending" | "sent" | "error";

function text(form: FormData, key: string) {
  const v = String(form.get(key) ?? "").trim();
  return v || null;
}

// Files go to the private quote-uploads bucket first; the row stores their paths.
async function submit(form: FormData) {
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > maxFiles) throw new Error(`แนบไฟล์ได้ไม่เกิน ${maxFiles} ไฟล์`);
  if (files.some((f) => f.size > maxFileSize)) throw new Error("ไฟล์แนบต้องมีขนาดไม่เกิน 10MB ต่อไฟล์");

  const folder = `incoming/${crypto.randomUUID()}`;
  const attachments: string[] = [];
  for (const [k, file] of files.entries()) {
    const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    const path = `${folder}/${k + 1}${ext ? `.${ext}` : ""}`;
    const { error } = await supabase.storage.from("quote-uploads").upload(path, file, { contentType: file.type });
    if (error) throw new Error("อัปโหลดไฟล์แนบไม่สำเร็จ ลองใช้ไฟล์รูปหรือ PDF ที่เล็กลง");
    attachments.push(path);
  }

  const { error } = await supabase.from("quote_requests").insert({
    name: text(form, "name"),
    company: text(form, "company"),
    phone: text(form, "phone"),
    email: text(form, "email"),
    line_id: text(form, "line"),
    job_type: text(form, "job"),
    location: text(form, "location"),
    area: text(form, "area"),
    detail: text(form, "detail"),
    contact_channel: text(form, "channel"),
    attachments,
    consent: form.get("consent") === "on",
  });
  if (error) throw new Error("ส่งข้อมูลไม่สำเร็จ");
}

function Fallback() {
  return (
    <div className="ct-actions">
      <a href={site.lineHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-line">
        <span className="lg">LINE</span>
        <div>
          <b>{site.line}</b>
        </div>
      </a>
      <a href={site.phoneHref} className="cbtn cb-phone">
        <div>
          โทร <b>{site.phone}</b>
        </div>
      </a>
    </div>
  );
}

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submit(new FormData(e.currentTarget));
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ส่งข้อมูลไม่สำเร็จ");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="qf-done" role="status">
        <b>ได้รับคำขอใบเสนอราคาแล้ว</b>
        <p>ทีมงานจะติดต่อกลับตามช่องทางที่เลือกไว้ ถ้างานเร่งด่วน ทัก LINE หรือโทรหาเราได้ทันที</p>
        <Fallback />
      </div>
    );
  }

  return (
    <form className="qf" onSubmit={onSubmit}>
      <div className="qf-row">
        <label>
          <span>
            ชื่อ-นามสกุล <i>*</i>
          </span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>บริษัท / หน่วยงาน</span>
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <div className="qf-row">
        <label>
          <span>
            เบอร์โทรศัพท์ <i>*</i>
          </span>
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
        </label>
        <label>
          <span>อีเมล</span>
          <input name="email" type="email" autoComplete="email" />
        </label>
      </div>
      <div className="qf-row">
        <label>
          <span>LINE ID</span>
          <input name="line" />
        </label>
        <label>
          <span>
            ประเภทงาน <i>*</i>
          </span>
          <select name="job" required defaultValue="">
            <option value="" disabled>
              เลือกประเภทงาน
            </option>
            {jobTypes.map((j) => (
              <option key={j}>{j}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="qf-row">
        <label>
          <span>
            สถานที่หน้างาน (จังหวัด / เขต) <i>*</i>
          </span>
          <input name="location" required />
        </label>
        <label>
          <span>ขนาดพื้นที่โดยประมาณ</span>
          <input name="area" placeholder="เช่น 2 ไร่ / 300 ตร.ม. / 3 คูหา" />
        </label>
      </div>
      <label>
        <span>
          รายละเอียดงาน <i>*</i>
        </span>
        <textarea name="detail" rows={5} required placeholder="ขอบเขตงาน ช่วงเวลาที่ต้องการเริ่มงาน หรือมี BOQ / แบบอยู่แล้วหรือไม่" />
      </label>
      <label>
        <span>แนบรูปหน้างาน / แบบ / BOQ</span>
        <input name="files" type="file" multiple accept="image/*,.pdf" />
      </label>
      <fieldset>
        <legend>ช่องทางที่สะดวกให้ติดต่อกลับ</legend>
        {channels.map((c, k) => (
          <label className="qf-radio" key={c}>
            <input type="radio" name="channel" value={c} defaultChecked={k === 0} />
            {c}
          </label>
        ))}
      </fieldset>
      <label className="qf-check">
        <input type="checkbox" name="consent" required />
        ยินยอมให้ {site.company} เก็บและใช้ข้อมูลนี้เพื่อติดต่อกลับและจัดทำใบเสนอราคา
      </label>
      {status === "error" && (
        <div className="qf-done qf-err" role="alert">
          <b>{error}</b>
          <p>กรุณาลองส่งอีกครั้ง หรือส่งรายละเอียดทาง LINE หรือโทรหาเราโดยตรง</p>
          <Fallback />
        </div>
      )}
      <button type="submit" className="qf-submit" disabled={status === "sending"}>
        {status === "sending" ? "กำลังส่ง..." : "ส่งคำขอใบเสนอราคา"}
      </button>
    </form>
  );
}
