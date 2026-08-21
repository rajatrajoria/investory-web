import { QuoteIcon } from "./Icons";
import { AdvisorPhoto } from "./AdvisorPhoto";
import type { Testimonial } from "@/lib/content";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-rule bg-surface p-7 shadow-sm">
      <QuoteIcon className="h-7 w-7 text-accent/70" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-rule pt-5">
        <AdvisorPhoto photoUrl={testimonial.photo_url} name={testimonial.name} size={40} />
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
