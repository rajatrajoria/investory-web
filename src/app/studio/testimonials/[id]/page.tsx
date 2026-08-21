import { notFound } from "next/navigation";
import { getTestimonial } from "@/lib/content";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonial(Number(id));
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Edit testimonial</h1>
      <div className="mt-6">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}
