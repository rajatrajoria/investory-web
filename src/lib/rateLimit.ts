import { execute, queryOne } from "./db";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Fixed-window rate limiter backed by MySQL. At the traffic level this
 * site expects, a DB round-trip per request is cheap and avoids needing
 * Redis. `identifier` is normally the caller's IP (see getClientIp).
 */
export async function checkRateLimit(
  identifier: string,
  route: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const bucketStartMs = Math.floor(now / (windowSeconds * 1000)) * (windowSeconds * 1000);
  const bucketStart = new Date(bucketStartMs).toISOString().slice(0, 19).replace("T", " ");

  await execute(
    `INSERT INTO rate_limits (identifier, route, bucket_start, count)
     VALUES (?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE count = count + 1`,
    [identifier, route, bucketStart]
  );

  const row = await queryOne<{ count: number }>(
    `SELECT count FROM rate_limits WHERE identifier = ? AND route = ? AND bucket_start = ?`,
    [identifier, route, bucketStart]
  );

  const count = row?.count ?? 1;
  const retryAfterSeconds = Math.ceil((bucketStartMs + windowSeconds * 1000 - now) / 1000);

  // Best-effort cleanup of old buckets; never blocks the request.
  void execute(
    `DELETE FROM rate_limits WHERE route = ? AND bucket_start < DATE_SUB(?, INTERVAL 1 HOUR)`,
    [route, bucketStart]
  ).catch(() => {});

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds,
  };
}

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_BASE_SECONDS = 30;

/** Returns the number of seconds the identifier must wait before another login attempt, or 0 if not locked. */
export async function getLoginLockoutSeconds(identifier: string): Promise<number> {
  const row = await queryOne<{ locked_until: string | null }>(
    `SELECT locked_until FROM login_attempts WHERE identifier = ?`,
    [identifier]
  );
  if (!row?.locked_until) return 0;
  const lockedUntil = new Date(row.locked_until + "Z").getTime();
  const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

export async function recordFailedLogin(identifier: string): Promise<void> {
  const row = await queryOne<{ failed_count: number }>(
    `SELECT failed_count FROM login_attempts WHERE identifier = ?`,
    [identifier]
  );
  const nextCount = (row?.failed_count ?? 0) + 1;

  let lockSeconds = 0;
  if (nextCount >= LOCKOUT_THRESHOLD) {
    // Exponential backoff beyond the threshold: 30s, 60s, 120s, 240s, capped at 1h.
    const exponent = nextCount - LOCKOUT_THRESHOLD;
    lockSeconds = Math.min(LOCKOUT_BASE_SECONDS * 2 ** exponent, 3600);
  }

  await execute(
    `INSERT INTO login_attempts (identifier, failed_count, locked_until)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       failed_count = ?,
       locked_until = ?`,
    [
      identifier,
      nextCount,
      lockSeconds ? new Date(Date.now() + lockSeconds * 1000) : null,
      nextCount,
      lockSeconds ? new Date(Date.now() + lockSeconds * 1000) : null,
    ]
  );
}

export async function clearFailedLogins(identifier: string): Promise<void> {
  await execute(`DELETE FROM login_attempts WHERE identifier = ?`, [identifier]);
}
