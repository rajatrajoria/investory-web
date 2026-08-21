"use client";

import { useActionState, useState } from "react";
import QRCode from "qrcode";
import { startTotpSetupAction, confirmTotpSetupAction, disableTotpAction } from "@/lib/actions/auth";
import { AdminField, AdminInput, AdminSubmit, AdminError } from "./fields";

export function TotpSetup({ enabled }: { enabled: boolean }) {
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [confirmState, confirmAction, confirmPending] = useActionState(
    confirmTotpSetupAction,
    undefined
  );

  if (enabled) {
    return (
      <div className="flex max-w-sm flex-col gap-3">
        <p className="rounded-lg bg-success-soft px-3.5 py-2.5 text-[13.5px] text-success">
          Two-factor authentication is enabled on this account.
        </p>
        <form action={disableTotpAction}>
          <button
            type="submit"
            className="text-[13px] font-medium text-danger hover:underline"
            onClick={(e) => {
              if (!confirm("Disable two-factor authentication?")) e.preventDefault();
            }}
          >
            Disable 2FA
          </button>
        </form>
      </div>
    );
  }

  if (confirmState?.success) {
    return (
      <p className="max-w-sm rounded-lg bg-success-soft px-3.5 py-2.5 text-[13.5px] text-success">
        Two-factor authentication is now enabled. You&apos;ll need a code from your authenticator
        app the next time you sign in.
      </p>
    );
  }

  if (!qr) {
    return (
      <button
        type="button"
        disabled={starting}
        onClick={async () => {
          setStarting(true);
          const result = await startTotpSetupAction();
          setSecret(result.secret);
          setQr(await QRCode.toDataURL(result.otpauthUri, { width: 220, margin: 1 }));
          setStarting(false);
        }}
        className="w-fit rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-brand-ink disabled:opacity-60"
      >
        {starting ? "Preparing…" : "Enable two-factor authentication"}
      </button>
    );
  }

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <p className="text-[14px] text-ink-muted">
        Scan this with Google Authenticator, 1Password, or any TOTP app, then enter the 6-digit
        code it shows to confirm.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} alt="Scan this QR code with your authenticator app" width={220} height={220} className="rounded-xl border border-rule" />
      <p className="font-mono text-[12px] text-ink-faint">Manual entry key: {secret}</p>

      <form action={confirmAction} className="flex flex-col gap-4">
        <AdminField label="6-digit code" htmlFor="code">
          <AdminInput id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required maxLength={6} />
        </AdminField>
        <AdminError message={confirmState?.error} />
        <AdminSubmit pending={confirmPending}>Confirm and enable</AdminSubmit>
      </form>
    </div>
  );
}
