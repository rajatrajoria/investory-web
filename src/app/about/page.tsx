import type { Metadata } from "next";
import { Container, Eyebrow, PrimaryButton, JsonLd } from "@/components/ui";
import { getSiteSettings } from "@/lib/content";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Investory was founded in 2019 to simplify the complexities of finance for retail investors who deserve institutional-quality advice.",
  alternates: { canonical: "/about" },
};

export const dynamic = "force-dynamic";

const VALUES = [
  {
    title: "Your vision first",
    body: "Every relationship starts with understanding your goals for yourself, your family, and your legacy — not with a product pitch.",
  },
  {
    title: "Honest risk assessment",
    body: "We evaluate your current situation and risk tolerance in today's market before recommending anything, and we say so plainly when a strategy isn't right for you.",
  },
  {
    title: "One advisor, one relationship",
    body: "Your portfolio is managed the way we'd manage our own — with the same attention whether markets are calm or volatile.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          about: {
            "@type": "Organization",
            name: settings.site_name,
            foundingDate: settings.founded_year,
          },
        }}
      />
      <section className="border-b border-rule">
        <Container className="py-16 sm:py-24">
          <Eyebrow>About Investory</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.1] text-ink">
            Simplifying finance for people who deserve better than a sales pitch.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            {settings.about_text}
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-rule bg-surface p-7">
                <CheckIcon className="h-6 w-6 text-brand" />
                <h2 className="mt-4 font-display text-[18px] font-semibold text-ink">
                  {v.title}
                </h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-rule bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-balance font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold text-ink">
            {settings.advisor_name} has been managing client portfolios personally since {settings.founded_year}.
          </h2>
          <PrimaryButton href="/contact">Start a conversation</PrimaryButton>
        </Container>
      </section>
    </>
  );
}
