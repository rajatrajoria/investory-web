import { notFound } from "next/navigation";
import { getService } from "@/lib/content";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(Number(id));
  if (!service) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Edit service</h1>
      <div className="mt-6">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
