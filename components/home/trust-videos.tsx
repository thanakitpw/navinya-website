import { trustVideos } from "@/lib/videos";
import { VideoGrid } from "./video-card";

export function TrustVideos() {
  return (
    <section className="trust">
      <div className="container">
        <h3>การันตีงานคุณภาพ ควบคุมงานโดยทีมวิศวกร</h3>
        <span className="mark">ดูบรรยากาศการทำงานจริงของทีม บริษัท นวิญญา 1979 จำกัด</span>
        <VideoGrid videos={trustVideos} />
      </div>
    </section>
  );
}
