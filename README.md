# peanut.gallery — marketing site

Static site for **[www.peanutgallery.live](https://www.peanutgallery.live)**. Served by GitHub Pages from this repo's `main` branch, root.

The Chrome extension and backend live in the separate monorepo: **[Sethmr/peanut.gallery](https://github.com/Sethmr/peanut.gallery)**. The apex `peanutgallery.live` still points at the backend (Vercel) so the extension's API calls keep working; marketing lives on `www.` for now. Path 2 (post v1.5 release) will flip apex to this site and move the backend to `api.peanutgallery.live`.

---

## Layout

```
.
├── index.html                  # landing page (Peanut Gallery Weekly front cover)
├── install/index.html          # 30-second Chrome Web Store walkthrough
├── pricing/index.html          # BYOK · Plus · Self-host — full pricing page
├── packs/
│   ├── howard/index.html       # Howard pack landing
│   └── twist/index.html        # TWiST pack landing
├── plus/                       # Stripe Checkout callback URLs only (noindex)
│   ├── welcome/index.html      # success_url — "check your email"
│   └── cancelled/index.html    # cancel_url — "no charge made"
├── manual/index.html           # operator's manual — install, self-host, pack schema
├── panel/index.html            # side-panel proof sheet (3 states)
├── privacy/index.html          # privacy policy
├── terms/index.html            # terms of service
├── 404.html                    # redirects to / after 3s
├── CNAME                       # custom domain: peanutgallery.live
├── .nojekyll                   # skip Jekyll; serve files as-is
├── robots.txt                  # allow all; sitemap pointer
├── sitemap.xml
└── assets/                     # favicons, OG image, shared site.css
```

Clean URLs (`/`, `/install`, `/pricing`, `/packs/howard`, `/packs/twist`, `/manual`, `/panel`, `/privacy`, `/terms`) come from GitHub Pages serving `index.html` on any directory request. No Jekyll config needed.

The `/plus/` directory exists solely for Stripe Checkout's `success_url` (`/plus/welcome/`) and `cancel_url` (`/plus/cancelled/`). Both pages are `noindex,nofollow` and reached only from a Stripe redirect — not linked from nav. The canonical marketing surface for the subscription is `/pricing/#plus`.

## Hosting

- **Pages source:** `main` branch, `/` (root)
- **Custom domain:** `www.peanutgallery.live` (set via `CNAME`)
- **DNS:** add a `CNAME` record for `www` → `sethmr.github.io` at the domain registrar
- **HTTPS:** enforce in repo settings → Pages → Enforce HTTPS (Let's Encrypt cert auto-provisions after DNS resolves, ~5–30 min)

Deploy = push to `main`. GitHub Pages publishes within a minute or two.

## Editing

The HTML pages are standalone — all CSS is inline, fonts load from Google Fonts, no build step. Open any `index.html` in a browser to preview.

When pasting new HTML from Claude Design, replace the whole file. Then:

1. Re-verify cross-page links point to `/install`, `/pricing`, `/pricing/#plus`, `/packs/howard`, `/packs/twist`, `/manual`, `/panel`, `/privacy`, `/terms` (no `.html` suffix, no legacy space-name filenames, no standalone `/plus/` marketing links — that URL is reserved for Stripe callbacks only).
2. Re-verify outbound links still point to the [Chrome Web Store listing](https://chromewebstore.google.com/detail/peanut-gallery/jjlpinlhfiheegiddmddkgfialcknagh) and [the main repo](https://github.com/Sethmr/peanut.gallery).
3. Re-verify the `<head>` still carries the SEO block (canonical, OG, Twitter, favicons, GA4) — see `index.html` for the full pattern. The `/pricing/` page additionally carries Product + FAQ + BreadcrumbList JSON-LD.

## Wired external links

All live in the landing page footer "Wire services" column, plus reused throughout:

| Link | Target |
|---|---|
| Add to Chrome / Copy URL | `https://chromewebstore.google.com/detail/peanut-gallery/jjlpinlhfiheegiddmddkgfialcknagh` |
| Github repository | `https://github.com/Sethmr/peanut.gallery` |
| Manifest v3 declaration | `https://github.com/Sethmr/peanut.gallery/blob/main/extension/manifest.json` |
| MIT license | `https://github.com/Sethmr/peanut.gallery/blob/main/LICENSE` |
| Pack library | `https://github.com/Sethmr/peanut.gallery/tree/main/lib/packs` |
| Privacy statement | `/privacy` |

## Follow-ups

- Add a Twitter card image at `assets/` and wire it from each page `<head>` (currently OG image is in place; Twitter card reuses the same).

## License

MIT. See [`Sethmr/peanut.gallery/LICENSE`](https://github.com/Sethmr/peanut.gallery/blob/main/LICENSE).
