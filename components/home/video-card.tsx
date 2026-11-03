"use client";

import Image from "next/image";
import { useState } from "react";
import { videoSrc, type Video } from "@/lib/videos";

// Shows the poster until clicked, so no video bytes load with the page.
function VideoItem({ v }: { v: Video }) {
  const [playing, setPlaying] = useState(false);
  const cls = v.vertical ? "vid v" : "vid";

  if (playing) {
    return (
      <div className={cls}>
        <video src={videoSrc(v.file)} poster={v.poster} controls autoPlay playsInline />
      </div>
    );
  }

  return (
    <button type="button" className={cls} onClick={() => setPlaying(true)} aria-label={`เล่นวิดีโอ ${v.caption}`}>
      <Image
        src={v.poster}
        alt=""
        width={v.vertical ? 540 : 960}
        height={v.vertical ? 960 : 540}
        sizes={v.vertical ? "(max-width: 640px) 50vw, 260px" : "(max-width: 640px) 100vw, 360px"}
      />
      <span className="cap">{v.caption}</span>
    </button>
  );
}

export function VideoGrid({ videos, cols = 3 }: { videos: Video[]; cols?: 2 | 3 | 4 }) {
  return (
    <div className={`vids c${cols}`}>
      {videos.map((v) => (
        <VideoItem v={v} key={v.file} />
      ))}
    </div>
  );
}
