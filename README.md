# Dr. Ahmad Bakhach Physiotherapy

The Arabic site opens at `/` and the English site at `/en/`. Both languages have static pages for conditions, individual assessments, the clinician profile, the first visit and contact. The demo uses local previews for WhatsApp, phone and directions until real destinations are configured. Dr. Ahmad confirms appointments directly.

```sh
npm ci
npm run dev
npm run check
npm run build
```

The production export is in `out/`.

## Edit the design or content

- `src/app/theme.css` holds the colors, font families, and layout variables. The site self-hosts Noto Sans Arabic and DM Sans through Fontsource.
- `src/lib/content.ts` contains the localized profile, condition entries, example qualification, hours, fees, duration, clinic address and access notes. Confirm these details and the Arabic spelling of the name before launch. Replace the demo location label in the homepage and retire the demo notices when using verified details.
- `.agents/skills/taste-skill/` contains the project-local Taste skill.

Provide site settings in `.env.local` and in the deployment build environment. These values become public in the static output.

| Setting | Value |
| --- | --- |
| `PRACTICE_PHONE` | Confirmed, dialable clinic number including country code |
| `PRACTICE_WHATSAPP` | Confirmed WhatsApp number including country code |
| `PRACTICE_MAP_URL` | Full directions URL to the confirmed location |
| `SITE_URL` | Production origin including `https://` |
| `SITE_INDEXABLE` | Set to `true` once the production copy and practice details are approved |

The draft uses `noindex` by default. Supplying one contact setting enables that channel independently of the others.

## Imagery

The four editorial images are illustrative scenes, saved as responsive WebP files in `public/images/`. Replace them with approved practice photography when it becomes available.

- `demo-portrait-*.webp` depicts a fictional clinician. `demo-entrance-*.webp` depicts a fictional clinic entrance.

- `movement-assessment-*.webp` uses a horizontal, collarbones-down photo of an adult patient in dark olive exercise clothes on a charcoal bench with a sage-scrubbed clinician supporting their upper arm and hand. Keep the hands and shoulder near the center. Use soft window daylight, warm off-white and olive walls, oak slats, and natural textures. Exclude faces, text, logos, borders, overlays, and equipment clutter.
- `first-visit-*.webp` uses a horizontal side view of a seated patient in cream and olive and a sage-scrubbed clinician explaining the next steps. Keep knees and hands near the center, with soft light, limestone, and pale wood. Exclude faces, writing, logos, borders, and overlays.
