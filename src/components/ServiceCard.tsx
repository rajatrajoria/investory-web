import Image from "next/image";
import { SERVICE_ICONS, CompassIcon } from "./Icons";
import type { Service } from "@/lib/content";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = SERVICE_ICONS[service.icon] || CompassIcon;
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {service.image_url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
          <Image
            src={service.image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7">
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
    </div>
  );
}
