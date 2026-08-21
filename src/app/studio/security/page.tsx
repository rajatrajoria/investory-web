import { redirect } from "next/navigation";
import { getSession, getCurrentAdminTotpStatus } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { TotpSetup } from "@/components/admin/TotpSetup";

export const metadata = { title: "Security" };

export default async function AdminSecurityPage() {
  const session = await getSession();
  if (!session) redirect("/studio/login");

  const totpEnabled = await getCurrentAdminTotpStatus(session.sub);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Security</h1>
        <p className="mt-1 text-[14.5px] text-ink-muted">
          Manage how you sign in to the studio.
        </p>
      </div>

      <section>
        <h2 className="font-display text-[17px] font-semibold text-ink">Change password</h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </section>

      <section>
        <h2 className="font-display text-[17px] font-semibold text-ink">Two-factor authentication</h2>
        <p className="mt-1 max-w-sm text-[13.5px] text-ink-muted">
          Adds a second step at login using an authenticator app — strongly recommended given
          this account controls everything shown on the public site.
        </p>
        <div className="mt-4">
          <TotpSetup enabled={totpEnabled} />
        </div>
      </section>
    </div>
  );
}
