import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata = { title: "New service" };

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New service</h1>
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}
