# Handoff notes

Context for whoever picks this project up next — human or AI.

## Why this exists

`investory.co.in` ran WordPress and was compromised for roughly a year via a
vulnerable file-manager plugin: webshells, six rogue admin accounts, and 76
black-hat SEO spam posts (casino/gambling content in 10+ languages) got
published under the legitimate admin account. Full incident detail is in the
separate RCA report delivered alongside this migration. This app is the
replacement — same domain, same hosting, same MySQL server, but a from-scratch
Next.js codebase with no PHP runtime anywhere in the request path and a much
smaller, self-audited dependency surface.

## Architecture decisions that matter

- **No PHP, anywhere.** The original compromise depended on uploading a PHP
  file and getting the web server to execute it. This app runs entirely on
  Node — there is no PHP interpreter in its request path, so that entire
  attack class doesn't apply even without extra filtering. Keep it that way;
  don't reintroduce a PHP proxy or CGI bridge without re-thinking this.
- **No third-party CMS/plugin ecosystem.** The admin panel (`/studio`) is
  hand-rolled — a handful of Server Actions and pages, not a plugin
  marketplace. This is a deliberate trade: less "batteries included," but a
  dramatically smaller and more auditable surface than WordPress had.
- **Parameterized SQL everywhere.** `src/lib/db.ts`'s `query`/`execute`
  helpers always take a separate params array — never string-concatenate
  user input into SQL. This is the one rule not to break.
- **Sanitize on the way out, not just the way in.** Blog content is
  markdown → sanitized HTML (`src/lib/markdown.ts`, via `marked` +
  `dompurify`) at render time, not just validated at save time. That means
  even a future compromised admin account can't plant a stored-XSS payload
  that executes for every visitor.
- **Uploaded images are always re-encoded** (`src/lib/actions/upload.ts`,
  via `sharp`) before being written to disk — strips EXIF/embedded payloads
  regardless of what the original file claimed to be.
- **Rate limiting is DB-backed, not in-memory** (`src/lib/rateLimit.ts`) —
  deliberate for a low-traffic site on shared hosting with no Redis. If
  traffic grows enough that this becomes a bottleneck, that's a good problem
  to have; revisit then.
- **Server Actions, not hand-rolled API routes, for all admin mutations.**
  Next.js Server Actions carry built-in same-origin CSRF protection. The
  contact form is the one exception — it's a public fetch from client JS
  with no session, so it's a plain API route (`src/app/api/contact`) instead.

## What still needs a human decision

- **Cloudflare in front of the domain** — recommended in the RCA report and
  `DEPLOY.md`, not done, since it requires a DNS/nameserver change at the
  registrar.
- **Google Search Console** — not checked as part of this build. Given the
  spam campaign ran for ~a year, assume a manual action or ranking
  demotion exists until verified, and use the Removals tool for any spam
  URLs still indexed from the old site.
- **Old WordPress database tables** (`wpiw_*` prefix, same database) are
  still present, unused. Safe to drop once you're confident nothing needs
  them — they don't collide with this app's tables.
- **Old WordPress files** were moved to cPanel's Trash during the incident
  cleanup, recoverable from there or from the full account backup taken
  before cleanup (`backup-8.20.2026_21-41-51_investor.tar.gz` in the
  account's home directory) if anything from the old site is ever needed
  again.
