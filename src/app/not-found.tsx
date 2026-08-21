import { Container, PrimaryButton } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-widest text-accent">
          404
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-semibold text-ink">
          We couldn&apos;t find that page.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] text-ink-muted">
          It may have moved, or the link might be out of date.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryButton href="/">Back to home</PrimaryButton>
        </div>
      </Container>
    </section>
  );
}
