import type { Metadata } from "next";
import { Container, Eyebrow, PrimaryButton, JsonLd } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";
import { getSiteSettings, listServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Financial planning, retirement strategy, tax optimization, and long-term wealth management — built around your goals, not a product catalogue.",
  alternates: { canonical: "/services" },
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    listServices({ publishedOnly: true }),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Wealth management",
          provider: { "@type": "FinancialService", name: settings.site_name },
          areaServed: "IN",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Investory Services",
            itemListElement: services.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.title, description: s.description },
            })),
          },
        }}
      />
      <section className="border-b border-rule">
        <Container className="py-16 sm:py-24">
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.1] text-ink">
            Efficient and reliable wealth management
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-muted">
            We assist in realizing your wealth&apos;s full potential through a dedication to excellence — not a menu of financial products.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-rule bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-lg text-balance font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold text-ink">
            Not sure which of these you actually need? That&apos;s exactly what the first conversation is for.
          </h2>
          <PrimaryButton href="/contact">Book a conversation</PrimaryButton>
        </Container>
      </section>
    </>
  );
}
