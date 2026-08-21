"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadImageAction } from "@/lib/actions/upload";
import { AdminError } from "./fields";

/**
 * Deliberately not a nested <form>: this component lives inside other
 * admin forms (TestimonialForm, BlogPostForm, SettingsForm), and an
 * <form> inside another <form> is invalid HTML that browsers silently
 * mishandle — it's why the upload button previously did nothing. This
 * calls the server action directly as a function instead, and uploads
 * as soon as a file is chosen.
 */
export function ImageUpload({
  name,
  defaultValue,
  label = "Image",
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(undefined);

    const fd = new FormData();
    fd.set("file", file);

    startTransition(async () => {
      const result = await uploadImageAction(undefined, fd);
      if (result?.error) setError(result.error);
      if (result?.url) setUrl(result.url);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div>
      <span className="mb-1.5 block text-[13.5px] font-medium text-ink">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-center gap-4">
        {url && (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-rule bg-surface-2">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rule-strong px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-brand hover:text-brand has-disabled:cursor-not-allowed has-disabled:opacity-60">
          {pending ? "Uploading…" : url ? "Replace image" : "Choose image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            disabled={pending}
            className="sr-only"
          />
        </label>
      </div>

      <AdminError message={error} />
    </div>
  );
}
