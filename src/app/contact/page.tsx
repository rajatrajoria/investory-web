import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { AdvisorPhoto } from "@/components/AdvisorPhoto";
import { getSiteSettings } from "@/lib/content";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Investory to start a conversation about your financial future.",
  alternates: { canonical: "/contact" },
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const details = [
    { icon: MailIcon, label: "Email", value: settings.contact_email, href: `mailto:${settings.contact_email}` },
    { icon: PhoneIcon, label: "Phone", value: settings.contact_phone, href: `tel:${settings.contact_phone?.replace(/\s/g, "")}` },
    { icon: ClockIcon, label: "Hours", value: settings.contact_hours },
    { icon: MapPinIcon, label: "Location", value: settings.contact_location },
  ];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>Get in touch</Eyebrow>
            <h1 className="mt-4 text-balance font-display text-[clamp(2rem,4.4vw,2.8rem)] font-semibold leading-[1.1] text-ink">
              Let&apos;s talk about your money.
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-muted">
              No obligation, no pressure — just a straightforward conversation about where you stand and where you want to be.
            </p>

            <div className="mt-8 flex items-center gap-3.5 rounded-2xl border border-rule bg-surface p-4">
              <AdvisorPhoto photoUrl={settings.advisor_photo_url} name={settings.advisor_name} size={48} />
              <div>
                <div className="font-display text-[15px] font-semibold text-ink">
                  {settings.advisor_name}
                </div>
                <div className="text-[13px] text-ink-faint">You&apos;ll be talking directly to them — not a call centre.</div>
              </div>
            </div>

            <dl className="mt-8 flex flex-col gap-5">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                    <d.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <dt className="text-[12.5px] font-medium uppercase tracking-wide text-ink-faint">
                      {d.label}
                    </dt>
                    <dd className="mt-0.5 text-[15px] text-ink">
                      {d.href ? (
                        <a href={d.href} className="hover:text-brand">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-rule bg-surface p-6 shadow-sm sm:p-9">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
