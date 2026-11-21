# Dr. Ahmad Bakhach Physiotherapy

The sky-blue design has an Arabic homepage at `/` and an English homepage at `/en/`. Switch languages from any page to open its counterpart. The Next.js App Router exports static HTML to `out/`.

```sh
npm ci
npm run dev
npm run check
npm run build
```

## Content and booking

- Edit the localized practice profile, services, seven FAQs, articles, figures and testimonials in `src/lib/content.ts`.
- The supplied Lebanese clinic number is **76 937 274**. Booking buttons open a localized WhatsApp message addressed to **+961 76 937 274**. The floating WhatsApp button opens a conversation without a preset message.
- `PRACTICE_PHONE` and `PRACTICE_WHATSAPP` override their respective destinations at build time. Use international numbers including country codes.
- The profile is at `/about-me/`. `/about/` remains available for existing links. Services, articles, first-visit guidance, contact and cancellation pages are available in both languages.
- `SITE_URL` configures canonical URLs. The demo defaults to `noindex`. Set `SITE_INDEXABLE=true` only once the production content is approved.

## Design and demo material

The palette is defined in `src/app/theme.css`. English uses DM Sans and Arabic uses Noto Sans Arabic, both self-hosted. Responsive photography is in `public/images/`. `blue-portrait-*.webp` is the hero and `demo-portrait-*.webp` is the profile image. Both depict a fictional clinician.

Replace the demo portraits, institution wordmarks and example testimonials with approved material. The cancellation page provides contact instructions. Add the clinic’s confirmed cancellation terms and licensing details when available.
