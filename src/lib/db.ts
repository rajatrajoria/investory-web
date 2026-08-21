import mysql from "mysql2/promise";

// Cached on `globalThis` (not just a module-level variable) so that Next.js
// dev-mode hot-reloading — which re-evaluates this module on every edit —
// reuses the same pool instead of creating a new one each time and leaking
// the old pool's background connection retries in the process.
const globalForDb = globalThis as unknown as { __investoryDbPool?: mysql.Pool };

/**
 * Single shared connection pool. mysql2 parameterizes every query passed
 * through execute()/query() with a `params` array — never build SQL by
 * string concatenation anywhere in this codebase.
 */
export function getPool(): mysql.Pool {
  if (!globalForDb.__investoryDbPool) {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 8,
      maxIdle: 4,
      idleTimeout: 60_000,
      queueLimit: 0,
      dateStrings: true,
      connectTimeout: 5_000,
    });
    // mysql2's Pool is an EventEmitter — an unhandled 'error' event (e.g. a
    // dropped idle connection, or the DB being briefly unreachable) is
    // fatal to the whole Node process by default. A listener here turns
    // that into a logged warning instead of crashing the app.
    // mysql2's promise-wrapper Pool type doesn't expose the inherited
    // EventEmitter's "error" event in its typings, even though it emits
    // one — cast is required to attach the listener.
    (pool as unknown as { on(event: "error", cb: (err: Error) => void): void }).on(
      "error",
      (err: Error) => {
        console.error("MySQL pool error:", err.message);
      }
    );
    globalForDb.__investoryDbPool = pool;
  }
  return globalForDb.__investoryDbPool;
}

type QueryParam = string | number | boolean | null | Date | Buffer;

export async function query<T = unknown>(
  sql: string,
  params: ReadonlyArray<QueryParam> = []
): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params as QueryParam[]);
  return rows as T[];
}

export async function queryOne<T = unknown>(
  sql: string,
  params: ReadonlyArray<QueryParam> = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(
  sql: string,
  params: ReadonlyArray<QueryParam> = []
): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params as QueryParam[]);
  return result as mysql.ResultSetHeader;
}
