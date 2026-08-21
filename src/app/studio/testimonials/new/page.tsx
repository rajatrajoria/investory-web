import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata = { title: "New testimonial" };

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New testimonial</h1>
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
