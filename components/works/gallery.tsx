"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { WorkPhoto } from "@/lib/works";

export function Gallery({ photos, title }: { photos: WorkPhoto[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((k) => (k === null ? k : (k + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <div className="gal">
        {photos.map((p, k) => (
          <button type="button" key={p.src} onClick={() => setOpen(k)} aria-label={`ดูรูปที่ ${k + 1} ${title}`}>
            <Image src={p.src} alt={`${title} รูปที่ ${k + 1}`} width={p.w} height={p.h} sizes="(max-width: 640px) 50vw, 260px" />
          </button>
        ))}
      </div>
      {current && (
        <div className="lb" role="dialog" aria-modal="true" aria-label={title} onClick={close}>
          <Image
            key={current.src}
            src={current.src}
            alt={`${title} รูปที่ ${(open ?? 0) + 1}`}
            width={current.w}
            height={current.h}
            sizes="100vw"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="lb-count">
            {(open ?? 0) + 1} / {photos.length}
          </span>
          <button type="button" className="lb-close" onClick={close} aria-label="ปิด">
            ×
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="lb-nav prev"
                aria-label="รูปก่อนหน้า"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="lb-nav next"
                aria-label="รูปถัดไป"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
