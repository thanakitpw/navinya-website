import { CmsImage } from "@/components/cms-image";
import { getCopy } from "@/lib/cms/read";

export async function Clients() {
  const { clients: c } = await getCopy("home");
  return (
    <section className="clients" id="clients">
      <div className="container">
        <span className="uline" />
        <h3>{c.title}</h3>
        <div className="logos">
          {c.list.map((l) => (
            <div className="cl" key={l.file}>
              <CmsImage src={`/clients/${l.file}.webp`} alt={l.name} title={l.name} width={l.width} height={l.height} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
