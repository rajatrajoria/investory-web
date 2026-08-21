"use client";

import { useEffect } from "react";
import { Container, PrimaryButton } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-widest text-danger">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-semibold text-ink">
          This page hit a snag.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] text-ink-muted">
          Please try again in a moment. If this keeps happening, reach out and let us know.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full border border-rule-strong bg-surface px-6 py-3 text-[15px] font-semibold text-ink hover:border-brand hover:text-brand"
          >
            Try again
          </button>
          <PrimaryButton href="/">Back to home</PrimaryButton>
        </div>
      </Container>
    </section>
  );
}
