# peanut.gallery — marketing site

Static site for **[www.peanutgallery.live](https://www.peanutgallery.live)**. Served by GitHub Pages from this repo's `main` branch, root.

The Chrome extension and backend live in the separate monorepo: **[Sethmr/peanut.gallery](https://github.com/Sethmr/peanut.gallery)**. The apex `peanutgallery.live` still points at the backend (Vercel) so the extension's API calls keep working; marketing lives on `www.` for now. Path 2 (post v1.5 release) will flip apex to this site and move the backend to `api.peanutgallery.live`.

---

## Layout

```
.
├── index.html          # landing page (Peanut Gallery Weekly front cover)
├── manual/
│   └── index.html      # operator's manual — install, self-host, pack schema
├── panel/
│   └── index.html      # side-panel proof sheet (3 states)
├── privacy/
│   └── index.html      # privacy policy
├── 404.html            # redirects to / after 3s
├── CNAME               # custom domain: peanutgallery.live
├── .nojekyll           # skip Jekyll; serve files as-is
├── robots.txt          # allow all; sitemap pointer
├── sitemap.xml
└── assets/             # favicons, OG image
```

Clean URLs (`/`, `/manual`, `/panel`, `/privacy`) come from GitHub Pages serving `index.html` on any directory request. No Jekyll config needed.

## Hosting

- **Pages source:** `main` branch, `/` (root)
- **Custom domain:** `www.peanutgallery.live` (set via `CNAME`)
- **DNS:** add a `CNAME` record for `www` → `sethmr.github.io` at the domain registrar
- **HTTPS:** enforce in repo settings → Pages → Enforce HTTPS (Let's Encrypt cert auto-provisions after DNS resolves, ~5–30 min)

Deploy = push to `main`. GitHub Pages publishes within a minute or two.

## Editing

The HTML pages are standalone — all CSS is inline, fonts load from Google Fonts, no build step. Open any `index.html` in a browser to preview.

When pasting new HTML from Claude Design, replace the whole file. Then:

1. Re-verify cross-page links point to `/manual`, `/panel`, `/privacy` (no `.html` suffix, no legacy space-name filenames).
2. Re-verify outbound links still point to the [Chrome Web Store listing](https://chromewebstore.google.com/detail/peanut-gallery/jjlpinlhfiheegiddmddkgfialcknagh) and [the main repo](https://github.com/Sethmr/peanut.gallery).
3. Re-verify the `<head>` still carries the SEO block (canonical, OG, Twitter, favicons, GA4) — see `index.html` for the full pattern.

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
