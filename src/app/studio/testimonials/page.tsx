import Link from "next/link";
import { listTestimonials } from "@/lib/content";
import { deleteTestimonialAction } from "@/lib/actions/content";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonials();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Testimonials</h1>
        <Link
          href="/studio/testimonials/new"
          className="rounded-full bg-brand px-4 py-2 text-[13.5px] font-semibold text-brand-ink"
        >
          + New testimonial
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-surface-2 text-[12px] uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Quote</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">{t.name}</td>
                <td className="max-w-xs truncate px-5 py-3.5 text-ink-muted">{t.quote}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                      t.published ? "bg-success-soft text-success" : "bg-surface-2 text-ink-faint"
                    }`}
                  >
                    {t.published ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/studio/testimonials/${t.id}`} className="text-[13px] font-medium text-brand hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={deleteTestimonialAction.bind(null, t.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-faint">
                  No testimonials yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
