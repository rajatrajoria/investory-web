import Link from "next/link";
import { listServices } from "@/lib/content";
import { deleteServiceAction } from "@/lib/actions/content";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await listServices();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Services</h1>
        <Link
          href="/studio/services/new"
          className="rounded-full bg-brand px-4 py-2 text-[13.5px] font-semibold text-brand-ink"
        >
          + New service
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-surface-2 text-[12px] uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {services.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3.5 font-medium text-ink">{s.title}</td>
                <td className="px-5 py-3.5 font-mono text-ink-muted">{s.display_order}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                      s.published ? "bg-success-soft text-success" : "bg-surface-2 text-ink-faint"
                    }`}
                  >
                    {s.published ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/studio/services/${s.id}`} className="text-[13px] font-medium text-brand hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={deleteServiceAction.bind(null, s.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-faint">
                  No services yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
