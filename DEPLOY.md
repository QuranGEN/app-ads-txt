# Deploy — QuranGen Labs studio site

Repo root = domain root. `index.html`, `app-ads.txt`, `robots.txt`,
`sitemap.xml` must all sit at the top level (they do).

## 1. Before first deploy — replace placeholders (5 min)

| Placeholder | Files | Replace with |
|---|---|---|
| `YOUR-DOMAIN` | `robots.txt`, `sitemap.xml` | `https://your-domain` (no trailing slash) |
| Play badge `href="#"` | `inkblade.html`, `pixel-space.html` | Live Play listing URLs (`com.inkblade.app`, `com.retrospace.app`) |
| `og:image` (missing) | all pages | Absolute URL to an uploaded screenshot once live |
| `app-ads.txt` TODO lines | `app-ads.txt` | AdMob publisher lines (AdMob console → Apps → app-ads.txt) |

## 2. Push (GitHub Pages)

```bash
git init && git add -A && git commit -m "studio site v1"
gh repo create qurangen-labs --public --source=. --push
# Settings → Pages → Deploy from branch → main → / (root)
# Settings → Pages → Custom domain → your-domain → Enforce HTTPS ✓
```

Cloudflare Pages works identically (build command: none, output: `/`).

## 3. Play Console (both games)

Store presence → Store listing → **Website URL** = `https://your-domain`.
Store listing → **Privacy Policy URL** = `https://your-domain/privacy-inkblade.html`
(resp. `privacy-pixel-space.html`). Required for ad-monetized apps.

## 4. Verify (the publisher-grade checks)

- `https://your-domain/` renders; `…/app-ads.txt` renders as **plain text** (no login/JS gate).
- Every footer link 200s; both Play badges go to live listings.
- AdMob: warning clears ≤24h after crawl.
- Appodeal (post-moderation): append their snippet to `app-ads.txt`, redeploy, dashboard warning clears.
- Mobile + desktop layouts; Lighthouse ≥95 (no frameworks, system fonts, 140KB assets).

## 5. Safety — never commit these here

`inkblade/android-source/keys/`, any `*.keystore`, `*-credentials.txt`,
`release/`, `sdk/`, `libs-aar/`, AAB/APK/mapping. This repo is public-safe
by construction — keep it that way. Game sources stay in their own folders;
only `assets/` copies live here.

## 6. Still open (not blocking launch)

- Inkblade screenshots: `aso-kit` holds copy only, no PNGs — gallery shows
  styled placeholders until re-exported. Replace each `.shot-placeholder`
  div with `<img src="assets/ink-X-*.png">` when ready.
- Inkblade trailer: paste YouTube URL into `inkblade.html` store row.
