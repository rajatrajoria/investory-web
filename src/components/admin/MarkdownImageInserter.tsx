"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImageAction } from "@/lib/actions/upload";
import { AdminError } from "./fields";

/**
 * Uploads an image and inserts its markdown at the cursor position of the
 * given textarea, rather than binding to a single field value — this is
 * for inline images within long-form content, where there can be any
 * number of them.
 */
export function MarkdownImageInserter({ targetId }: { targetId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(undefined);

    const fd = new FormData();
    fd.set("file", file);

    startTransition(async () => {
      const result = await uploadImageAction(undefined, fd);
      if (inputRef.current) inputRef.current.value = "";
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (!result?.url) return;

      const textarea = document.getElementById(targetId) as HTMLTextAreaElement | null;
      const snippet = `\n\n![](${result.url})\n\n`;
      if (!textarea) return;

      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      const next = textarea.value.slice(0, start) + snippet + textarea.value.slice(end);

      const setter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(textarea),
        "value"
      )!.set!;
      setter.call(textarea, next);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));

      const cursor = start + snippet.length;
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rule-strong px-3.5 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:border-brand hover:text-brand">
        {pending ? "Uploading…" : "Insert image into content"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFile}
          disabled={pending}
          className="sr-only"
        />
      </label>
      <AdminError message={error} />
    </div>
  );
}
