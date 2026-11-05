"use client";

import { useState, type FormEvent } from "react";
import type { contactCopy } from "@/lib/content/pages";
import { supabase } from "@/lib/supabase";

const maxFiles = 10;
const maxFileSize = 10 * 1024 * 1024;

type Status = "idle" | "sending" | "sent" | "error";

type Props = {
  copy: typeof contactCopy.form;
  jobTypes: string[];
  company: string;
  line: string;
  lineHref: string;
  phone: string;
  phoneHref: string;
};

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

function Fallback({ copy, line, lineHref, phone, phoneHref }: Pick<Props, "copy" | "line" | "lineHref" | "phone" | "phoneHref">) {
  return (
    <div className="ct-actions">
      <a href={lineHref} target="_blank" rel="noopener noreferrer" className="cbtn cb-line">
        <span className="lg">LINE</span>
        <div>
          <b>{line}</b>
        </div>
      </a>
      <a href={phoneHref} className="cbtn cb-phone">
        <div>
          {copy.callPrefix}<b>{phone}</b>
        </div>
      </a>
    </div>
  );
}

export function QuoteForm({ copy, jobTypes, company, line, lineHref, phone, phoneHref }: Props) {
  const contact = { copy, line, lineHref, phone, phoneHref };
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
        <b>{copy.doneTitle}</b>
        <p>{copy.doneText}</p>
        <Fallback {...contact} />
      </div>
    );
  }

  return (
    <form className="qf" onSubmit={onSubmit}>
      <div className="qf-row">
        <label>
          <span>
            {copy.name} <i>*</i>
          </span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>{copy.company}</span>
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <div className="qf-row">
        <label>
          <span>
            {copy.phone} <i>*</i>
          </span>
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
        </label>
        <label>
          <span>{copy.email}</span>
          <input name="email" type="email" autoComplete="email" />
        </label>
      </div>
      <div className="qf-row">
        <label>
          <span>{copy.line}</span>
          <input name="line" />
        </label>
        <label>
          <span>
            {copy.job} <i>*</i>
          </span>
          <select name="job" required defaultValue="">
            <option value="" disabled>
              {copy.jobPlaceholder}
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
            {copy.location} <i>*</i>
          </span>
          <input name="location" required />
        </label>
        <label>
          <span>{copy.area}</span>
          <input name="area" placeholder={copy.areaPlaceholder} />
        </label>
      </div>
      <label>
        <span>
          {copy.detail} <i>*</i>
        </span>
        <textarea name="detail" rows={5} required placeholder={copy.detailPlaceholder} />
      </label>
      <label>
        <span>{copy.files}</span>
        <input name="files" type="file" multiple accept="image/*,.pdf" />
      </label>
      <fieldset>
        <legend>{copy.channelLegend}</legend>
        {copy.channels.map((c, k) => (
          <label className="qf-radio" key={c}>
            <input type="radio" name="channel" value={c} defaultChecked={k === 0} />
            {c}
          </label>
        ))}
      </fieldset>
      <label className="qf-check">
        <input type="checkbox" name="consent" required />
        {copy.consentStart}{company}{copy.consentEnd}
      </label>
      {status === "error" && (
        <div className="qf-done qf-err" role="alert">
          <b>{error}</b>
          <p>{copy.errorText}</p>
          <Fallback {...contact} />
        </div>
      )}
      <button type="submit" className="qf-submit" disabled={status === "sending"}>
        {status === "sending" ? copy.sending : copy.submit}
      </button>
    </form>
  );
}
