import { QuoteIcon } from "./Icons";
import type { Testimonial } from "@/lib/content";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-rule bg-surface p-7 shadow-sm">
      <QuoteIcon className="h-7 w-7 text-accent/70" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-rule pt-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[13px] font-semibold text-brand">
          {initials(testimonial.name)}
        </div>
        <div>
          <div className="text-[14.5px] font-semibold text-ink">{testimonial.name}</div>
          {testimonial.role_company && (
            <div className="text-[13px] text-ink-faint">{testimonial.role_company}</div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
