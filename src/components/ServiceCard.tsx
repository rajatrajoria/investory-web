import { SERVICE_ICONS, CompassIcon } from "./Icons";
import type { Service } from "@/lib/content";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = SERVICE_ICONS[service.icon] || CompassIcon;
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-rule bg-surface p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-ink">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-[19px] font-semibold text-ink">
        {service.title}
      </h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-muted">
        {service.description}
      </p>
    </div>
  );
}
