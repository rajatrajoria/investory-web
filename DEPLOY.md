# Deploying to GlobalHost (cPanel)

This app runs as a persistent Node.js process under cPanel's **Setup Node.js
App** (Phusion Passenger), on the same GlobalHost account and domain the old
WordPress install used. The database is the same MySQL database
(`investor_wp341`) — WordPress's old tables (`wpiw_*`) can be dropped once
you're confident you no longer need them; this app's own tables use plain
names and don't collide with them.

## 1. Push to GitHub

```bash
cd investory-web
git remote add origin https://github.com/<you>/investory-web.git
git push -u origin main
```

## 2. Get the code onto the server

In cPanel, **Git Version Control** → **Create** → paste your GitHub repo URL,
set the repository path to something like `/home1/investor/investory-app`
(deliberately *outside* `public_html` — the Node app doesn't need to live in
the web root, and keeping it separate avoids any confusion with static
files). Pull/clone the repo there.

If you'd rather not use cPanel's Git integration, upload a zip of the repo
via File Manager and extract it to the same path instead.

## 3. Create the Node.js app

cPanel → **Setup Node.js App** → **Create Application**:

- **Node.js version**: pick the latest available (20.x or newer). If the
  version list doesn't go that high, ask GlobalHost support to enable it —
  do this before deploying, since an old Node version may not support
  everything this app uses.
- **Application mode**: Production
- **Application root**: `investory-app` (the path from step 2)
- **Application URL**: your domain (`investory.co.in`), root path
- **Application startup file**: leave as default initially — you'll run
  `npm run build` then use `next start` as the actual start command (see
  below).

cPanel gives you a "Enter to the virtual environment" command — run it, then
inside that shell:

```bash
cd ~/investory-app
npm install
```

## 4. Configure environment variables

In the same Setup Node.js App screen, add these under **Environment
Variables** (values matching your `.env.local`, but with production values):

| Variable | Value |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_USER` | `investor_wp341` |
| `DB_PASSWORD` | *(the MySQL user's current password)* |
| `DB_NAME` | `investor_wp341` |
| `SESSION_SECRET` | *(32+ random characters — `openssl rand -base64 32`)* |
| `SMTP_HOST` | `mail.investory.co.in` (or as given by GlobalHost) |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `ramankhandelwal@investory.co.in` |
| `SMTP_PASSWORD` | *(that mailbox's password)* |
| `SMTP_FROM` | `ramankhandelwal@investory.co.in` |
| `CONTACT_TO_EMAIL` | `ramankhandelwal@investory.co.in` |
| `SITE_URL` | `https://www.investory.co.in` |

Do **not** put real secrets in a committed file — this table is a checklist
for what to paste into cPanel's environment variable UI, not `.env.local`
itself.

## 5. First-time database setup

Already done for the current database — `db/schema.sql` has been run and
seeded. For a future fresh database, run it once via phpMyAdmin or:

```bash
mysql -u investor_wp341 -p investor_wp341 < db/schema.sql
```

Then create the admin login:

```bash
npm run create-admin -- <username>
```

Save the password it prints — it's shown once. Log in at
`https://www.investory.co.in/studio/login` and enable two-factor
authentication from the Security page immediately.

## 6. Build and start

```bash
npm run build
```

Set the Node app's **startup file** to a small wrapper, or configure the
"Application startup file" as `node_modules/.bin/next` with arguments
`start`, depending on what your cPanel version supports — the reliable
option is a one-line `server.js`:

```js
// server.js
process.env.PORT = process.env.PORT || 3000;
require("next/dist/bin/next");
process.argv[2] = "start";
```

Set that as the startup file, then click **Restart** in the Setup Node.js
App screen. cPanel/Passenger will keep the process alive and restart it if
it crashes.

## 7. Uploaded images

Blog and testimonial images are written to `public/uploads/` at runtime
(not part of the git repo — it's in `.gitignore`). This directory needs to
persist across deploys:

- Don't run `git clean` in the application root.
- If you redeploy by re-cloning into a fresh directory, copy `public/uploads/`
  over from the previous deploy first.

## 8. Verify

- Visit the homepage, About, Services, Testimonials, Blog, and Contact pages.
- Submit the contact form and confirm the notification email arrives.
- Log into `/studio`, edit a service, add a testimonial with a photo, and
  publish a blog post — confirm each shows up on the public site.
- Try 6+ rapid failed logins at `/studio/login` and confirm the lockout
  message appears.
- Check `https://www.investory.co.in/sitemap.xml` and `/robots.txt`.

## Recommended, outside this app: Cloudflare

Once live, consider putting the domain behind Cloudflare (free tier) for
network-level DDoS/WAF protection in front of GlobalHost. This means
changing the domain's nameservers at your registrar — plan it as a separate,
deliberate step, ideally during low-traffic hours, since DNS propagation can
take a few hours.
