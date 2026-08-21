/**
 * Next.js runs this once when the server process starts (any runtime).
 * The safety net below exists for one reason: a database hiccup (a dropped
 * connection, a brief network blip) should show visitors a "try again"
 * page, not take the entire Node process down. Without a listener here,
 * certain async errors from connection-pool libraries are treated by
 * Node as fatal even though the request that triggered them already
 * failed gracefully through its own try/catch.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.on("uncaughtException", (err) => {
      console.error("[uncaughtException]", err);
    });
    process.on("unhandledRejection", (reason) => {
      console.error("[unhandledRejection]", reason);
    });
  }
}
