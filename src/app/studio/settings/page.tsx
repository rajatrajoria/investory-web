import { getSiteSettings } from "@/lib/content";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Site settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Site settings</h1>
      <p className="mt-1 text-[14.5px] text-ink-muted">
        Copy shown across the homepage, about page, and footer.
      </p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
