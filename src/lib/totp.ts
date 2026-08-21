import * as OTPAuth from "otpauth";

export function generateTotpSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

export function totpUri(secret: string, username: string): string {
  const totp = new OTPAuth.TOTP({
    issuer: "Investory Admin",
    label: username,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  return totp.toString();
}

export function verifyTotpCode(secret: string, code: string): boolean {
  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  // Allow one 30s step of clock drift in either direction.
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}
