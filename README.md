# Dr. Ahmad Bakhach Physiotherapy

A bilingual landing page (Arabic at `/`, English at `/en/`) with online booking and a password-protected clinic dashboard at `/admin/`. It runs as a Next.js (App Router) Node.js server with a SQLite database.

```sh
npm ci
cp .env.example .env.local   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev                  # http://localhost:3000, dashboard at /admin/
npm run check                # type-check
npm run build && npm start   # production
```

The database (`data/clinic.db`) is created, migrated and filled with the site's original content on the first request.

## Booking

- The **Book a session** section lists the next free times. These come from the weekly hours, minus closed dates, minus bookings that are pending or approved, minus the minimum notice, minus busy times in Google Calendar when it's connected.
- A patient chooses a day and a time, then enters name, phone, service and an optional note. The request is saved as **Pending**, and that time stops being offered at once, so two patients can't request the same time.
- Requests are limited to 6 per hour per IP address and 3 pending per phone number. A hidden field filters out simple bots.
- Times are wall-clock times in `CLINIC_TIMEZONE` (default `Asia/Beirut`), whatever time zone the server runs in.

## Google Calendar

Connecting Dr. Ahmad's Google Calendar is optional; bookings work without it. Once it's connected:

- Each booking request is added to his calendar right away as a **tentative** (yellow) event, "⏳ طلب حجز: name", with phone, service, note and a link to the dashboard.
- Approving it makes the event **confirmed** (green, "جلسة: name"). Declining, cancelling or deleting it removes the event, and restoring it to pending adds it back.
- Anything shown as busy in the calendar, including events he adds himself, is not offered on the website. The website checks his calendar again just before saving each request.
- If Google can't be reached, requests are still accepted (the database holds the time). The booking card then shows "Not in Google Calendar" with a **Sync** button.

The connection uses a Google service account, so nobody signs in through a browser and there's no token that expires:

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Google Calendar API**.
2. Under *IAM & Admin → Service accounts*, create a service account. Under *Keys → Add key → JSON*, download its key file and keep it private.
3. In Google Calendar, open Dr. Ahmad's calendar → *Settings and sharing* → *Share with specific people*. Add the service account's email (`…@….iam.gserviceaccount.com`) with **Make changes to events**.
4. On the server, set `GOOGLE_CALENDAR_ID` (in *Integrate calendar*; for his main calendar it's his Gmail address) and either `GOOGLE_SERVICE_ACCOUNT_FILE` (path to the key file) or `GOOGLE_SERVICE_ACCOUNT_JSON` (its contents). Then restart.
5. Under **Dashboard → Availability → Google Calendar**, press **Test connection**.

All-day events count as busy only when they're marked *Busy* in Google Calendar; use **Closed dates** for days off. Busy times are cached for a minute between checks.

## Dashboard (`/admin/`)

The dashboard is in Arabic and English (switch at the bottom of the sidebar) and needs `ADMIN_PASSWORD`.

| Page | What it does |
| --- | --- |
| Overview | Pending requests, approved sessions in the next 7 days, free times this week, content counts |
| Bookings | Approve, decline, cancel or restore requests; WhatsApp the patient a pre-filled message in their language; call; delete; add a session arranged by phone (saved as approved and blocks that time) |
| Availability | Weekly hours per weekday, with several ranges for breaks; session length; how many days ahead to show; minimum notice; pause online booking; closed dates (holidays) |
| Articles, Services, Testimonials, Cases | Add, edit, hide, reorder and delete. Arabic is required, and English falls back to Arabic when empty. Articles and cases accept an uploaded image (JPG, PNG or WebP up to 5 MB) or a bundled photo. |

Article text uses a blank line between paragraphs, and `## ` at the start of a line makes a subheading. Testimonials and cases have an **Illustrative example** box; while any published item has it ticked, the site shows an "illustrative" label. Publish patient cases only with the patient's written consent and without identifying details.

## Animations (GSAP)

Motion uses [GSAP](https://gsap.com) with ScrollTrigger and DrawSVG, following the official GSAP skills in `.claude/skills/`.

- `src/components/page-motion.tsx`
  - The hero entrance: the arch and portrait open, the name rises line by line, then the tagline and button.
  - Section content rises as it scrolls into view.
  - The profile photo is uncovered from its leading edge.
  - The practice figures count up.
  - Photos drift gently on larger screens.
- `src/components/landing-navigation.tsx` draws the scroll progress line under the header.
- `src/components/booking-widget.tsx`:
  - free times fall into place when a day is chosen;
  - the details step opens;
  - a check mark is drawn to confirm the request.

Everything respects `prefers-reduced-motion`: with it on, nothing moves and all content shows at rest. Animated parts are hidden before hydration only when JavaScript runs, and a CSS fallback shows them after 3 s if the script never loads. Mark new elements with `data-reveal` to give them the scroll reveal.

## Content and contact

- UI text, values, FAQs, figures and related concerns: `src/lib/content.ts`. Articles, services, testimonials and cases live in the database and are edited in the dashboard; `content.ts` only seeds them on first run.
- The clinic number is **76 937 274**. WhatsApp links go to **+961 76 937 274**. `PRACTICE_PHONE` and `PRACTICE_WHATSAPP` override them.
- `SITE_URL` sets canonical URLs. The demo stays `noindex` until `SITE_INDEXABLE=true`. `/admin/` is excluded in `robots.txt` and sends `noindex`.

## Deployment

The site needs a Node.js 20+ host that keeps files between restarts, for example a VPS, Railway, Render, or cPanel's **Setup Node.js App**:

1. Set `ADMIN_PASSWORD` and `SESSION_SECRET` (see `.env.example`). Optionally set `DATA_DIR` to a folder outside the app.
2. Run `npm ci && npm run build`, then start with `npm start` (respects `PORT`).
3. Serve it over HTTPS: the admin cookie is `Secure` in production. Behind a proxy without HTTPS, set `ADMIN_COOKIE_INSECURE=true` only as a temporary measure.
4. **Back up `DATA_DIR`** (database and uploaded images) regularly.

On Vercel or another serverless host, point `DATABASE_URL`/`DATABASE_AUTH_TOKEN` at a Turso (libSQL) database. Uploaded images need persistent storage there; bundled photos work anywhere.

Rate limits and the booking lock are kept in memory, so they assume one server process.

## Database changes

The schema is in `src/db/schema.ts`. After changing it, run `npm run db:generate` and commit the new file in `drizzle/`. Migrations run automatically when the server starts, so restart a running dev server after adding one.

## Design and demo material

The palette is in `src/app/theme.css` (site) and `src/app/(admin)/admin/admin.css` (dashboard). English uses DM Sans and Arabic uses Noto Sans Arabic, both self-hosted. Photography is in `public/images/`; the portraits depict a fictional clinician. Replace the demo portraits, institution wordmarks, illustrative testimonials and cases with approved material, and add the clinic's confirmed cancellation terms and licensing details.
