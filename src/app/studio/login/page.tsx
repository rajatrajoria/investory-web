"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const needsTotp = state?.error === "TOTP_REQUIRED";

  const inputClass =
    "w-full rounded-xl border border-rule-strong bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-brand";

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-semibold text-ink">
            Investo<span className="text-accent">₹</span>y
          </span>
          <p className="mt-1.5 text-[13.5px] text-ink-faint">Studio sign in</p>
        </div>

        <form action={formAction} className="rounded-2xl border border-rule bg-surface p-7 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-[13.5px] font-medium text-ink">
                Username
              </label>
              <input id="username" name="username" type="text" required autoFocus className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[13.5px] font-medium text-ink">
                Password
              </label>
              <input id="password" name="password" type="password" required className={inputClass} />
            </div>

            {needsTotp && (
              <div>
                <label htmlFor="totpCode" className="mb-1.5 block text-[13.5px] font-medium text-ink">
                  Authenticator code
                </label>
                <input
                  id="totpCode"
                  name="totpCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  className={inputClass}
                />
              </div>
            )}

            {state?.error && state.error !== "TOTP_REQUIRED" && (
              <p className="rounded-lg bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-1 w-full rounded-full bg-brand px-5 py-3 text-[15px] font-semibold text-brand-ink shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
