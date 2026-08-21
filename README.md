# Investory

The Investory website and admin studio — a Next.js rebuild replacing the
previous WordPress installation after a security compromise. Every piece of
content shown on the public site (pages, services, testimonials, blog posts)
is managed from a protected admin panel at `/studio`, backed by its own
MySQL database, with no third-party CMS or plugin ecosystem involved.

## Stack

- **Next.js** (App Router, TypeScript) — SSR for SEO, Server Actions for the
  admin panel, API routes only where a public fetch client needs one (the
  contact form).
- **MySQL** via `mysql2`, all queries parameterized.
- **Auth**: signed httpOnly session cookies (`jose`), `bcryptjs` password
  hashing, optional TOTP two-factor authentication.
- **Email**: `nodemailer` over SMTP, used only to notify of new contact-form
  submissions.
- **Tailwind CSS v4** for styling.

See `AI_HANDOFF.md` for the full security/architecture rationale — written
for whoever (human or AI) picks this project up next.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

The database schema lives in `db/schema.sql` — run it once against a fresh
database before first use. It also seeds the real starting content
(services, testimonials, site copy).

To create the first admin login:

```bash
npm run create-admin -- <username>
```

This prints a freshly generated password once — save it immediately, then
log in at `/studio/login` and set up two-factor authentication from the
Security page.

## Deployment

See `DEPLOY.md` for the full GlobalHost cPanel deployment walkthrough.

## Project structure

```
src/app/              Public pages + /studio admin panel + API routes
src/components/       Shared UI (public site + src/components/admin for the studio)
src/lib/               Data access (content.ts), auth, rate limiting, email,
                        markdown rendering, validation
src/lib/actions/       Server Actions — auth, content CRUD, image upload
db/schema.sql           Full schema + seed data
scripts/create-admin.mjs  One-time admin account setup
```
