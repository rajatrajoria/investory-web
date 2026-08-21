"use client";

export function DeleteButton({
  action,
  confirmMessage = "Delete this item? This can't be undone.",
}: {
  action: () => void | Promise<void>;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-[13px] font-medium text-danger hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
