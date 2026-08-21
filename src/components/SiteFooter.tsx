import Link from "next/link";
import { Logo } from "./Logo";
import { MailIcon, PhoneIcon, MapPinIcon } from "./Icons";

export function SiteFooter({ settings }: { settings: Record<string, string> }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-ink-muted">
            {settings.tagline || "Wealth management built on trust, not templates."}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
            Explore
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-[14.5px]">
            <li><Link href="/about" className="text-ink-muted hover:text-ink">About</Link></li>
            <li><Link href="/services" className="text-ink-muted hover:text-ink">Services</Link></li>
            <li><Link href="/testimonials" className="text-ink-muted hover:text-ink">Testimonials</Link></li>
            <li><Link href="/blog" className="text-ink-muted hover:text-ink">Insights</Link></li>
            <li><Link href="/privacy" className="text-ink-muted hover:text-ink">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
            Get in touch
          </h3>
          <ul className="mt-4 flex flex-col gap-3 text-[14.5px] text-ink-muted">
            <li className="flex items-start gap-2.5">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${settings.contact_email}`} className="hover:text-ink">
                {settings.contact_email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:${settings.contact_phone?.replace(/\s/g, "")}`} className="hover:text-ink">
                {settings.contact_phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{settings.contact_location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {year} Investory. All rights reserved.</p>
          <p>Serving families across India since {settings.founded_year || "2019"}.</p>
        </div>
      </div>
    </footer>
  );
}
