"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/auth";
import { AdminField, AdminInput, AdminSubmit, AdminError, AdminSuccess } from "./fields";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, undefined);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <AdminField label="Current password" htmlFor="currentPassword">
        <AdminInput id="currentPassword" name="currentPassword" type="password" required />
      </AdminField>
      <AdminField label="New password" htmlFor="newPassword" hint="At least 12 characters, mixing upper/lowercase, numbers, and symbols.">
        <AdminInput id="newPassword" name="newPassword" type="password" required minLength={12} />
      </AdminField>
      <AdminField label="Confirm new password" htmlFor="confirmPassword">
        <AdminInput id="confirmPassword" name="confirmPassword" type="password" required minLength={12} />
      </AdminField>

      <AdminError message={state?.error} />
      {state?.success && <AdminSuccess message="Password updated." />}
      <AdminSubmit pending={pending}>Update password</AdminSubmit>
    </form>
  );
}
