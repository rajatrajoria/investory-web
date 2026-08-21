import { listFormSubmissions } from "@/lib/content";
import { markSubmissionReadAction } from "@/lib/actions/content";

export const metadata = { title: "Enquiries" };

function formatDate(iso: string): string {
  return new Date(iso.replace(" ", "T") + "Z").toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminSubmissionsPage() {
  const submissions = await listFormSubmissions();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Enquiries</h1>
      <p className="mt-1 text-[14.5px] text-ink-muted">
        Contact form submissions from the public site, most recent first.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {submissions.map((s) => (
          <div
            key={s.id}
            className={`rounded-2xl border p-5 ${
              s.read_at ? "border-rule bg-surface" : "border-brand/40 bg-brand-soft/40"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-ink">{s.name}</p>
                <p className="text-[13.5px] text-ink-muted">
                  <a href={`mailto:${s.email}`} className="hover:text-brand">{s.email}</a>
                  {s.phone && <> &middot; {s.phone}</>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-ink-faint">{formatDate(s.created_at)}</span>
                {!s.read_at && (
                  <form action={markSubmissionReadAction.bind(null, s.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-rule-strong px-3 py-1 text-[12px] font-medium text-ink hover:border-brand hover:text-brand"
                    >
                      Mark read
                    </button>
                  </form>
                )}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-ink">{s.message}</p>
            {!s.email_sent && (
              <p className="mt-3 text-[12.5px] text-danger">
                Note: the notification email for this enquiry failed to send — check SMTP configuration.
              </p>
            )}
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="rounded-2xl border border-rule bg-surface p-8 text-center text-ink-faint">
            No enquiries yet.
          </p>
        )}
      </div>
    </div>
  );
}
