import type { NextConfig } from "next";

// Content-Security-Policy is intentionally conservative: no external
// script/style hosts beyond what the app itself needs, since a
// permissive CSP was part of how the previous WordPress install stayed
// exploitable for as long as it did.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.investory.co.in" },
    ],
  },
  // Shared hosting (CloudLinux LVE) caps this account's concurrent
  // process/thread count. Next.js's default build-time worker pool
  // (one per CPU core it detects on the host machine, not the LVE
  // limit) spawns far more child processes than the account is allowed,
  // crashing the build with spawn EAGAIN / kill EPERM. Capping to a
  // single worker keeps the build inside the account's process limit.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  webpack(config) {
    // The host's glibc is too old for Next's native SWC minifier, so
    // production builds fall back to a minifier that spawns one worker
    // process per CPU core it detects (~28 on this host's 29-core
    // machine, wrapped as an opaque function Next doesn't expose for
    // configuring down). That burst of processes, on top of what the
    // running app + hosting stack already uses, blows straight past
    // this account's LVE process ceiling and aborts the build every
    // time. Skipping minification removes the worker burst entirely —
    // a larger, unminified bundle is a fine trade for a build that
    // actually completes on this host.
    if (config.optimization) {
      config.optimization.minimize = false;
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
