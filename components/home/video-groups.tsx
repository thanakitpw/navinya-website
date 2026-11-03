import { videoGroups } from "@/lib/videos";
import { VideoGrid } from "./video-card";

export function VideoGroups() {
  return (
    <section className="vgroups">
      <div className="container">
        <h2 className="sec-title">
          ผลงานจริงจากหน้างาน NAVINYA
          <span className="uline" />
        </h2>
        {videoGroups.map((g) => (
          <div key={g.title}>
            <h4>{g.title}</h4>
            <VideoGrid videos={g.videos} cols={g.cols} />
          </div>
        ))}
      </div>
    </section>
  );
}
