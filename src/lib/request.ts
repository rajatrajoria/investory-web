import { headers } from "next/headers";

/** Best-effort client IP resolution behind cPanel/Apache or Cloudflare. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const candidates = [
    h.get("cf-connecting-ip"),
    h.get("x-real-ip"),
    h.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ];
  const ip = candidates.find((v) => v && v.length > 0);
  return ip || "unknown";
}
