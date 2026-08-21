import Link from "next/link";
import { listServices, listTestimonials, listBlogPosts, listFormSubmissions } from "@/lib/content";

export default async function StudioDashboard() {
  const [services, testimonials, posts, submissions] = await Promise.all([
    listServices(),
    listTestimonials(),
    listBlogPosts(),
    listFormSubmissions(),
  ]);

  const unread = submissions.filter((s) => !s.read_at).length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;

  const cards = [
    { label: "Services", value: services.length, href: "/studio/services" },
    { label: "Testimonials", value: testimonials.length, href: "/studio/testimonials" },
    { label: "Published posts", value: publishedPosts, href: "/studio/blog" },
    { label: "Unread enquiries", value: unread, href: "/studio/submissions", highlight: unread > 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-[14.5px] text-ink-muted">
        Everything shown on investory.co.in is managed from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-rule bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`font-mono text-3xl font-semibold tabular-nums ${
                card.highlight ? "text-accent" : "text-ink"
              }`}
            >
              {card.value}
            </div>
            <div className="mt-1.5 text-[13.5px] text-ink-muted">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-rule bg-surface p-6">
        <h2 className="font-display text-[17px] font-semibold text-ink">Recent enquiries</h2>
        {submissions.length === 0 ? (
          <p className="mt-3 text-[14px] text-ink-muted">No enquiries yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-rule">
            {submissions.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-medium text-ink">{s.name}</p>
                  <p className="truncate text-[13px] text-ink-faint">{s.email}</p>
                </div>
                <span className="shrink-0 font-mono text-[12px] text-ink-faint">
                  {new Date(s.created_at.replace(" ", "T") + "Z").toLocaleDateString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/studio/submissions"
          className="mt-4 inline-block text-[13.5px] font-medium text-brand hover:underline"
        >
          View all enquiries →
        </Link>
      </div>
    </div>
  );
}
