"use client";

import { useActionState } from "react";
import { saveSiteSettingsAction } from "@/lib/actions/content";
import { AdminField, AdminInput, AdminTextarea, AdminSubmit, AdminError, AdminSuccess } from "./fields";

const FIELDS: Array<{
  key: string;
  label: string;
  type: "text" | "textarea";
  hint?: string;
}> = [
  { key: "site_name", label: "Site name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text", hint: "Shown in the footer." },
  { key: "hero_headline", label: "Homepage headline", type: "text" },
  { key: "hero_subtext", label: "Homepage subtext", type: "textarea" },
  { key: "about_text", label: "About / commitment paragraph", type: "textarea" },
  { key: "advisor_name", label: "Advisor name", type: "text" },
  { key: "founded_year", label: "Founded year", type: "text" },
  { key: "families_served", label: "Families served (number)", type: "text" },
  { key: "contact_email", label: "Contact email", type: "text" },
  { key: "contact_phone", label: "Contact phone", type: "text" },
  { key: "contact_hours", label: "Contact hours", type: "text" },
  { key: "contact_location", label: "Contact location", type: "text" },
];

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(saveSiteSettingsAction, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {FIELDS.map((field) => (
        <AdminField key={field.key} label={field.label} htmlFor={field.key} hint={field.hint}>
          {field.type === "textarea" ? (
            <AdminTextarea
              id={field.key}
              name={field.key}
              rows={3}
              defaultValue={settings[field.key] || ""}
              maxLength={5000}
            />
          ) : (
            <AdminInput
              id={field.key}
              name={field.key}
              defaultValue={settings[field.key] || ""}
              maxLength={500}
            />
          )}
        </AdminField>
      ))}

      <AdminError message={state?.error} />
      {state?.success && <AdminSuccess message="Settings saved." />}
      <AdminSubmit pending={pending}>Save settings</AdminSubmit>
    </form>
  );
}
