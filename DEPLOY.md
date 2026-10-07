# Deploy — QuranGen Labs studio site (LIVE: https://qurangen.netlify.app)

Repo root = domain root. `index.html`, `app-ads.txt`, `robots.txt`,
`sitemap.xml`, `_headers` must all sit at the top level (they do).
Deploy path: push to `QuranGEN/app-ads-txt:main` → Netlify auto-publishes.

## 1. Placeholders — DONE except Play Console links (§3)

| Placeholder | Status |
|---|---|
| Domain (`robots.txt`, `sitemap.xml`, canonical, OG) | ✅ `https://qurangen.netlify.app` |
| Play badges | ✅ `com.inkblade.app` + `com.retrospace.app` live URLs |
| `og:image` | ✅ `assets/og-card.png` (1200×630 generated) |
| `app-ads.txt` AdMob | ✅ `pub-8182630534220044` live; Appodeal lines pending moderation |

## 2. Push (Netlify via GitHub — current)

```bash
git add -A && git commit -m "..." && git push origin main
# Netlify auto-deploys from QuranGEN/app-ads-txt:main in ~60s
```

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
