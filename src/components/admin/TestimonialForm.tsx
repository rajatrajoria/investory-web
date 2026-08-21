"use client";

import { useActionState } from "react";
import { saveTestimonialAction } from "@/lib/actions/content";
import type { Testimonial } from "@/lib/content";
import { ImageUpload } from "./ImageUpload";
import { AdminField, AdminInput, AdminTextarea, AdminCheckbox, AdminSubmit, AdminError } from "./fields";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const action = saveTestimonialAction.bind(null, testimonial?.id ?? null);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <AdminField label="Client name" htmlFor="name">
        <AdminInput id="name" name="name" required defaultValue={testimonial?.name} maxLength={120} />
      </AdminField>

      <AdminField label="Role / company" htmlFor="role_company" hint="Optional">
        <AdminInput id="role_company" name="role_company" defaultValue={testimonial?.role_company ?? ""} maxLength={200} />
      </AdminField>

      <AdminField label="Quote" htmlFor="quote">
        <AdminTextarea id="quote" name="quote" required rows={5} defaultValue={testimonial?.quote} maxLength={2000} />
      </AdminField>

      <ImageUpload name="photo_url" defaultValue={testimonial?.photo_url} label="Photo (optional)" />

      <AdminField label="Display order" htmlFor="display_order">
        <AdminInput id="display_order" name="display_order" type="number" min={0} defaultValue={testimonial?.display_order ?? 0} />
      </AdminField>

      <AdminCheckbox
        id="published"
        name="published"
        label="Published (visible on the public site)"
        defaultChecked={testimonial ? Boolean(testimonial.published) : true}
      />

      <AdminError message={state?.error} />
      <AdminSubmit pending={pending}>{testimonial ? "Save changes" : "Add testimonial"}</AdminSubmit>
    </form>
  );
}
