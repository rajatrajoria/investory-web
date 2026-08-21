import type { Metadata } from "next";
import { Container, Eyebrow, JsonLd } from "@/components/ui";
import { TestimonialCard } from "@/components/TestimonialCard";
import { getSiteSettings, listTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients say about working with Investory.",
  alternates: { canonical: "/testimonials" },
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    listTestimonials({ publishedOnly: true }),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: settings.site_name,
          review: testimonials.map((t) => ({
            "@type": "Review",
            author: { "@type": "Person", name: t.name },
            reviewBody: t.quote,
          })),
          aggregateRating:
            testimonials.length > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: "5",
                  reviewCount: String(testimonials.length),
                }
              : undefined,
        }}
      />
      <section className="border-b border-rule">
        <Container className="py-16 sm:py-24">
          <Eyebrow>Testimonials</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.1] text-ink">
            Building trust and consistency since inception
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
