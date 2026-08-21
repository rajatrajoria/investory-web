"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/lib/actions/upload";
import { AdminError } from "./fields";

export function ImageUpload({
  name,
  defaultValue,
  label = "Image",
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState(uploadImageAction, undefined);
  const [url, setUrl] = useState(defaultValue || "");

  if (state?.url && state.url !== url) {
    setUrl(state.url);
  }

  return (
    <div>
      <span className="mb-1.5 block text-[13.5px] font-medium text-ink">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-xl border border-rule bg-surface-2">
          <Image src={url} alt="" fill className="object-cover" />
        </div>
      )}

      <form action={formAction} className="flex items-center gap-3">
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required
          className="text-[13px] text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3.5 file:py-2 file:text-[13px] file:font-medium file:text-ink"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full border border-rule-strong px-3.5 py-2 text-[13px] font-medium text-ink hover:border-brand hover:text-brand disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </form>
      <AdminError message={state?.error} />
    </div>
  );
}
