"use client";

import { useActionState } from "react";
import { saveServiceAction } from "@/lib/actions/content";
import type { Service } from "@/lib/content";
import { SERVICE_ICONS } from "@/components/Icons";
import { AdminField, AdminInput, AdminTextarea, AdminSelect, AdminCheckbox, AdminSubmit, AdminError } from "./fields";

export function ServiceForm({ service }: { service?: Service }) {
  const action = saveServiceAction.bind(null, service?.id ?? null);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <AdminField label="Title" htmlFor="title">
        <AdminInput id="title" name="title" required defaultValue={service?.title} maxLength={160} />
      </AdminField>

      <AdminField label="Description" htmlFor="description">
        <AdminTextarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={service?.description}
          maxLength={2000}
        />
      </AdminField>

      <AdminField label="Icon" htmlFor="icon">
        <AdminSelect id="icon" name="icon" defaultValue={service?.icon || "compass"}>
          {Object.keys(SERVICE_ICONS).map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Display order" htmlFor="display_order">
        <AdminInput
          id="display_order"
          name="display_order"
          type="number"
          min={0}
          defaultValue={service?.display_order ?? 0}
        />
      </AdminField>

      <AdminCheckbox
        id="published"
        name="published"
        label="Published (visible on the public site)"
        defaultChecked={service ? Boolean(service.published) : true}
      />

      <AdminError message={state?.error} />
      <AdminSubmit pending={pending}>{service ? "Save changes" : "Create service"}</AdminSubmit>
    </form>
  );
}
