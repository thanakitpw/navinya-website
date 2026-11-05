import { getCopy } from "@/lib/cms/read";
import { VideoGrid } from "./video-card";

export async function TrustVideos() {
  const { trust: c } = await getCopy("home");
  return (
    <section className="trust">
      <div className="container">
        <h3>{c.title}</h3>
        <span className="mark">{c.note}</span>
        <VideoGrid videos={c.videos} />
      </div>
    </section>
  );
}
