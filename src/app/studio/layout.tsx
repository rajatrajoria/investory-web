import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s | Investory Studio" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/studio", label: "Dashboard" },
  { href: "/studio/services", label: "Services" },
  { href: "/studio/testimonials", label: "Testimonials" },
  { href: "/studio/blog", label: "Blog" },
  { href: "/studio/submissions", label: "Enquiries" },
  { href: "/studio/settings", label: "Site settings" },
  { href: "/studio/security", label: "Security" },
];

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page renders its own minimal shell.
  if (!session) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-paper font-sans text-ink">
      <aside className="hidden w-60 shrink-0 border-r border-rule bg-surface md:block">
        <div className="flex h-16 items-center border-b border-rule px-6">
          <span className="font-display text-lg font-semibold">
            Investo<span className="text-accent">₹</span>y
          </span>
          <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand">
            Studio
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-rule bg-surface px-6">
          <span className="text-[14px] text-ink-muted">
            Signed in as <span className="font-medium text-ink">{session.username}</span>
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-[13.5px] font-medium text-ink-muted hover:text-ink"
            >
              View site ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-rule-strong px-4 py-1.5 text-[13.5px] font-medium text-ink hover:border-danger hover:text-danger"
              >
                Log out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
