import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Investory collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-semibold text-ink">
          Privacy Policy
        </h1>
        <p className="mt-2 text-[13.5px] text-ink-faint">Last updated: {new Date().getFullYear()}</p>

        <div className="prose-content mt-10">
          <h2>What we collect</h2>
          <p>
            When you submit our contact form, we collect the name, email address, phone number
            (if provided), and message you enter. We use this solely to respond to your enquiry —
            we don&apos;t sell, rent, or share it with third parties for marketing purposes.
          </p>

          <h2>How we use it</h2>
          <p>
            Submissions are stored securely and an email notification is sent to {settings.advisor_name}
            {" "}at {settings.contact_email} so we can follow up with you directly. We keep enquiry
            records only as long as reasonably needed to respond to and maintain a record of the conversation.
          </p>

          <h2>Cookies</h2>
          <p>
            This site uses only the minimum cookies required for it to function — for example, a
            session cookie if you are logged into the admin area. We do not use third-party
            advertising or tracking cookies.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us to access, correct, or delete any personal information we hold about you
            at any time by emailing {settings.contact_email}.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy can be sent to {settings.contact_email} or {settings.contact_phone}.
          </p>
        </div>
      </Container>
    </section>
  );
}
