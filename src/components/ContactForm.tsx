"use client";

import { useState, FormEvent } from "react";
import { SubmitButton } from "./ui";
import { CheckIcon } from "./Icons";

type Status = "idle" | "pending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("pending");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-rule bg-surface p-10 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-success-soft text-success">
          <CheckIcon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-[19px] font-semibold text-ink">Message sent</h3>
        <p className="max-w-sm text-[14.5px] text-ink-muted">
          Thanks for reaching out — we&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-rule-strong bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-brand";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot field — hidden from real users via CSS, bots often fill every field they see in markup. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[13.5px] font-medium text-ink">
            Name
          </label>
          <input id="name" name="name" type="text" required maxLength={160} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13.5px] font-medium text-ink">
            Email
          </label>
          <input id="email" name="email" type="email" required maxLength={255} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-[13.5px] font-medium text-ink">
          Phone <span className="text-ink-faint">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" maxLength={40} className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[13.5px] font-medium text-ink">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-danger-soft px-4 py-3 text-[14px] text-danger">{errorMessage}</p>
      )}

      <SubmitButton pending={status === "pending"} className="w-fit">
        Send message
      </SubmitButton>
    </form>
  );
}
