"use server";

import { redirect } from "next/navigation";
import { queryOne, execute } from "@/lib/db";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
  hashPassword,
  isStrongPassword,
  getSession,
} from "@/lib/auth";
import { getClientIp } from "@/lib/request";
import {
  checkRateLimit,
  getLoginLockoutSeconds,
  recordFailedLogin,
  clearFailedLogins,
} from "@/lib/rateLimit";
import { verifyTotpCode, generateTotpSecret, totpUri } from "@/lib/totp";
import { loginSchema } from "@/lib/validation";

type AdminUserRow = {
  id: number;
  username: string;
  password_hash: string;
  totp_secret: string | null;
  totp_enabled: number;
};

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = await getClientIp();

  const lockedFor = await getLoginLockoutSeconds(ip);
  if (lockedFor > 0) {
    return { error: `Too many failed attempts. Try again in ${lockedFor} seconds.` };
  }

  // General ceiling independent of the failure-based lockout above.
  const rl = await checkRateLimit(ip, "admin-login", 15, 60 * 15);
  if (!rl.allowed) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    totpCode: formData.get("totpCode") || undefined,
  });
  if (!parsed.success) {
    return { error: "Enter your username and password." };
  }

  const { username, password, totpCode } = parsed.data;

  const user = await queryOne<AdminUserRow>(
    `SELECT id, username, password_hash, totp_secret, totp_enabled FROM admin_users WHERE username = ?`,
    [username]
  );

  // Always run bcrypt.compare, even for an unknown user, against a dummy
  // hash — keeps response timing consistent so timing side-channels can't
  // reveal which usernames exist.
  const dummyHash = "$2a$12$C6UzMDM.H6dfI/f/IKcEeOfJmZ9r9M4pKfjV1e2fWuHzMcJ8s2rC.";
  const passwordOk = await verifyPassword(password, user?.password_hash ?? dummyHash);

  if (!user || !passwordOk) {
    await recordFailedLogin(ip);
    return { error: "Incorrect username or password." };
  }

  if (user.totp_enabled) {
    if (!totpCode) {
      return { error: "TOTP_REQUIRED" };
    }
    if (!verifyTotpCode(user.totp_secret!, totpCode)) {
      await recordFailedLogin(ip);
      return { error: "Incorrect authentication code." };
    }
  }

  await clearFailedLogins(ip);

  const token = await createSessionToken({
    sub: String(user.id),
    username: user.username,
    totpVerified: Boolean(user.totp_enabled),
  });
  await setSessionCookie(token);

  redirect("/studio");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/studio/login");
}

export async function changePasswordAction(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (!session) redirect("/studio/login");

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const user = await queryOne<AdminUserRow>(
    `SELECT id, password_hash FROM admin_users WHERE id = ?`,
    [session!.sub]
  );
  if (!user) return { error: "Session expired. Please log in again." };

  const ok = await verifyPassword(currentPassword, user.password_hash);
  if (!ok) return { error: "Current password is incorrect." };

  if (newPassword !== confirmPassword) return { error: "New passwords don't match." };
  if (!isStrongPassword(newPassword)) {
    return {
      error: "Use at least 12 characters with a mix of upper/lowercase, numbers, and symbols.",
    };
  }

  const hash = await hashPassword(newPassword);
  await execute(`UPDATE admin_users SET password_hash = ? WHERE id = ?`, [hash, user.id]);

  return { success: true };
}

export async function startTotpSetupAction(): Promise<{ secret: string; otpauthUri: string }> {
  const session = await getSession();
  if (!session) redirect("/studio/login");

  const secret = generateTotpSecret();
  await execute(`UPDATE admin_users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?`, [
    secret,
    session!.sub,
  ]);

  return { secret, otpauthUri: totpUri(secret, session!.username) };
}

export async function confirmTotpSetupAction(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (!session) redirect("/studio/login");

  const code = String(formData.get("code") || "");
  const user = await queryOne<AdminUserRow>(
    `SELECT totp_secret FROM admin_users WHERE id = ?`,
    [session!.sub]
  );
  if (!user?.totp_secret) return { error: "Start setup again." };

  if (!verifyTotpCode(user.totp_secret, code)) {
    return { error: "Incorrect code. Check your authenticator app and try again." };
  }

  await execute(`UPDATE admin_users SET totp_enabled = 1 WHERE id = ?`, [session!.sub]);
  return { success: true };
}

export async function disableTotpAction(): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/studio/login");
  await execute(`UPDATE admin_users SET totp_enabled = 0, totp_secret = NULL WHERE id = ?`, [
    session!.sub,
  ]);
}
