import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const baseInput =
  "w-full rounded-lg border border-rule-strong bg-paper px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition-colors focus:border-brand";

export function AdminField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13.5px] font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[12.5px] text-ink-faint">{hint}</p>}
    </div>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function AdminCheckbox({
  id,
  name,
  label,
  defaultChecked,
}: {
  id: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 text-[14px] text-ink">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-rule-strong accent-brand"
      />
      {label}
    </label>
  );
}

export function AdminError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded-lg bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger">{message}</p>;
}

export function AdminSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded-lg bg-success-soft px-3.5 py-2.5 text-[13.5px] text-success">{message}</p>;
}

export function AdminSubmit({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-brand-ink shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
