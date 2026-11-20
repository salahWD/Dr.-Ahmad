# Dr. Ahmad Physiotherapy

The Arabic site opens at `/` and the English site at `/en/`. The Next.js App Router generates static HTML on both routes. Appointment links open WhatsApp or the phone dialer and Dr. Ahmad confirms appointments directly.

```sh
npm ci
npm run dev
npm run check
npm run build
```

The production export is in `out/`.

## Edit the design or content

- `src/app/theme.css` holds the colors, font families, and layout variables. The Arabic heading font is Alexandria and the Arabic body font is Noto Sans Arabic. Both are self-hosted through Fontsource.
- `src/lib/content.ts` contains the practice profile, service entries, and both languages. Confirm the three draft services, full name, credentials, address, and hours before launch.
- `.agents/skills/taste-skill/` contains the project-local Taste skill.

Provide site settings in `.env.local` and in the deployment build environment. These values become public in the static output.

| Setting | Value |
| --- | --- |
| `PRACTICE_PHONE` | Confirmed, dialable clinic number including country code |
| `PRACTICE_WHATSAPP` | Confirmed WhatsApp number including country code |
| `PRACTICE_MAP_URL` | Full directions URL to the confirmed location |
| `SITE_URL` | Production origin including `https://` |
| `SITE_INDEXABLE` | Set to `true` once the production copy and practice details are approved |

The draft uses `noindex` and shows a contact status until a real phone or WhatsApp number is configured.

## Imagery

The two editorial images were created with built-in ImageGen and saved as responsive WebP files in `public/images/`. They are illustrative scenes, with faces cropped out. Replace them with approved practice photography when it becomes available.

- `movement-assessment-*.webp` uses a horizontal, collarbones-down photo of an adult patient in dark olive exercise clothes on a charcoal bench with a sage-scrubbed clinician supporting their upper arm and hand. Keep the hands and shoulder near the center. Use soft window daylight, warm off-white and olive walls, oak slats, and natural textures. Exclude faces, text, logos, borders, overlays, and equipment clutter.
- `first-visit-*.webp` uses a horizontal side view of a seated patient in cream and olive and a sage-scrubbed clinician explaining the next steps. Keep knees and hands near the center, with soft light, limestone, and pale wood. Exclude faces, writing, logos, borders, and overlays.
