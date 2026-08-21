import type { Metadata } from "next";
import Image from "next/image";
import { Container, Eyebrow, SectionHeading, PrimaryButton, SecondaryButton, JsonLd } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { AdvisorPhoto } from "@/components/AdvisorPhoto";
import { GrowthLine } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings, listServices, listTestimonials } from "@/lib/content";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Wealth Management You Can Actually Trust",
  description:
    "Investory is an Odisha-based wealth management practice helping individuals and families build lasting financial security through honest, personalized financial planning.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

const WHO_WE_SERVE = [
  "Corporate & non-corporate professionals",
  "Pre-retired and retired individuals",
  "HNIs, UHNIs, and their families",
  "Business owners",
];

export default async function HomePage() {
  const [settings, services, testimonials] = await Promise.all([
    getSiteSettings(),
    listServices({ publishedOnly: true }),
    listTestimonials({ publishedOnly: true }),
  ]);

  const siteUrl = process.env.SITE_URL || "https://www.investory.co.in";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FinancialService",
          name: settings.site_name || "Investory",
          description: settings.hero_subtext,
          url: siteUrl,
          email: settings.contact_email,
          telephone: settings.contact_phone,
          areaServed: "IN",
          address: {
            "@type": "PostalAddress",
            addressRegion: "Odisha",
            addressCountry: "IN",
          },
          founder: {
            "@type": "Person",
            name: settings.advisor_name,
          },
          foundingDate: settings.founded_year,
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule">
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-brand-soft blur-3xl"
        />
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -bottom-32 left-[-8%] h-[380px] w-[380px] rounded-full bg-accent-soft blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
        <Container className="relative py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Reveal>
                <Eyebrow>Odisha-based &middot; Since {settings.founded_year}</Eyebrow>
                <h1 className="mt-5 text-balance font-display text-[clamp(2.1rem,5.2vw,3.6rem)] font-semibold leading-[1.08] text-ink">
                  {settings.hero_headline}
                </h1>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-muted">
                  {settings.hero_subtext}
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <PrimaryButton href="/contact">Book a conversation</PrimaryButton>
                  <SecondaryButton href="/services">Explore our services</SecondaryButton>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-rule pt-10 sm:grid-cols-4">
                  {[
                    { value: settings.founded_year, label: "Founded" },
                    { value: `${settings.families_served}+`, label: "Families served" },
                    { value: "1:1", label: "Advisor relationship" },
                    { value: "100%", label: "Independent advice" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="font-mono text-2xl font-semibold tabular-nums text-ink">
                        {stat.value}
                      </dd>
                      <dd className="mt-1 text-[13px] text-ink-faint">{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={100} className="relative">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-rule bg-surface shadow-lg sm:max-w-md">
                {settings.hero_image_url ? (
                  <Image
                    src={settings.hero_image_url}
                    alt={settings.advisor_name || settings.site_name}
                    fill
                    sizes="(min-width: 1024px) 420px, 90vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-6 bg-brand-deep p-10 text-brand-ink">
                    <GrowthLine className="h-24 w-full" />
                    <p className="text-center font-display text-lg font-medium leading-snug">
                      Every plan starts with your goals, not a product to sell.
                    </p>
                  </div>
                )}
              </div>
              <div
                aria-hidden
                className="absolute -bottom-5 -left-5 h-24 w-24 rounded-2xl border border-rule bg-accent-soft sm:h-28 sm:w-28"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Who we serve */}
      <section className="border-b border-rule bg-surface">
        <Container className="py-14">
          <Reveal>
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Who we work with
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WHO_WE_SERVE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-ink">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="What we do"
                title="Efficient, reliable wealth management"
                lede="We start by understanding your vision for yourself, your family, and your legacy — then build a plan around it, not around a product we need to sell."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.id} delay={(i % 3) * 90}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* About snippet */}
      <section className="relative overflow-hidden border-y border-rule bg-brand-deep py-20 text-brand-ink sm:py-24">
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ "--rule-strong": "var(--brand-ink)" } as React.CSSProperties}
        />
        <Container className="relative">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-ink/70">
                  Our commitment
                </span>
                <h2 className="mt-3 text-balance font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.2]">
                  We manage your portfolio as if it were our own.
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-brand-ink/80">
                  {settings.about_text}
                </p>

                <div className="mt-7 flex items-center gap-3.5 border-t border-brand-ink/15 pt-6">
                  <AdvisorPhoto
                    photoUrl={settings.advisor_photo_url}
                    name={settings.advisor_name}
                    size={52}
                    className="border-brand-ink/20"
                  />
                  <div>
                    <div className="font-display text-[15.5px] font-semibold">
                      {settings.advisor_name}
                    </div>
                    <div className="text-[13px] text-brand-ink/70">
                      Founder &amp; Wealth Advisor — the person you&apos;ll actually talk to
                    </div>
                  </div>
                </div>
              </div>
              <SecondaryButton
                href="/about"
                className="w-fit border-brand-ink/30 bg-transparent text-brand-ink hover:border-brand-ink hover:text-brand-ink"
              >
                More about Investory
              </SecondaryButton>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Client stories"
                title="Trust and consistency since inception"
                align="center"
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 90}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
            {testimonials.length > 6 && (
              <div className="mt-10 text-center">
                <SecondaryButton href="/testimonials">Read every story</SecondaryButton>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-rule py-20 sm:py-24">
        <Container className="text-center">
          <Reveal>
            <h2 className="mx-auto max-w-xl text-balance font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold leading-[1.15] text-ink">
              Ready to put a real plan behind your money?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15.5px] text-ink-muted">
              A first conversation costs you nothing but a little time — and tells you exactly where you stand.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <PrimaryButton href="/contact">Book a conversation</PrimaryButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
