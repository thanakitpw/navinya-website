import { CmsImage } from "./cms-image";
import { site } from "@/lib/site";

export function LogoBadge({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={className ? `logo-badge ${className}` : "logo-badge"}>
      <CmsImage
        src="/logo.webp"
        alt={site.company}
        width={240}
        height={240}
        preload={priority}
      />
    </div>
  );
}
