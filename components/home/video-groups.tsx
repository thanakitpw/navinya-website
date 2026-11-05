import { getCopy } from "@/lib/cms/read";
import { VideoGrid } from "./video-card";

export async function VideoGroups() {
  const { videoGroups: c } = await getCopy("home");
  return (
    <section className="vgroups">
      <div className="container">
        <h2 className="sec-title">
          {c.title}
          <span className="uline" />
        </h2>
        {c.groups.map((g, k) => (
          <div key={k}>
            <h4>{g.title}</h4>
            <VideoGrid videos={g.videos} cols={g.cols} />
          </div>
        ))}
      </div>
    </section>
  );
}
