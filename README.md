# peanut.gallery — marketing site

Static site for **[peanutgallery.live](https://peanutgallery.live)**. Served by GitHub Pages from this repo's `main` branch, root.

The Chrome extension and backend live in the separate monorepo: **[Sethmr/peanut.gallery](https://github.com/Sethmr/peanut.gallery)**.

---

## Layout

```
.
├── index.html          # landing page (Peanut Gallery Weekly front cover)
├── manual/
│   └── index.html      # operator's manual — install, self-host, pack schema
├── panel/
│   └── index.html      # side-panel proof sheet (3 states)
├── 404.html            # redirects to / after 3s
├── CNAME               # custom domain: peanutgallery.live
├── .nojekyll           # skip Jekyll; serve files as-is
├── robots.txt          # allows /, /manual/, /panel/; disallows legacy + dev folders
├── sitemap.xml
├── assets/             # reserved for future static assets (images, fonts)
├── scraps/             # design iteration screenshots (dev-only, noindex)
└── specs/              # internal side-panel state reference (dev-only, noindex)
```

Clean URLs (`/`, `/manual`, `/panel`) come from GitHub Pages serving `index.html` on any directory request. No Jekyll config needed.

## Hosting

- **Pages source:** `main` branch, `/` (root)
- **Custom domain:** `peanutgallery.live` (set via `CNAME`)
- **HTTPS:** enforce in repo settings → Pages → Enforce HTTPS

Deploy = push to `main`. GitHub Pages publishes within a minute or two.

## Editing

The three HTML pages are standalone — all CSS is inline, fonts load from Google Fonts, no build step. Open any `.html` in a browser to preview.

When pasting new HTML from Claude Design, replace the whole file. Then:

1. Re-verify cross-page links point to `manual/` and `panel/` (not `Operators Manual.html` / `Side Panel.html`).
2. Re-verify outbound links still point to the [Chrome Web Store listing](https://chromewebstore.google.com/detail/peanut-gallery/jjlpinlhfiheegiddmddkgfialcknagh) and [the main repo](https://github.com/Sethmr/peanut.gallery).

## Wired external links

All four live in the landing page footer "Wire services" column, plus reused throughout:

| Link | Target |
|---|---|
| Add to Chrome / Copy URL | `https://chromewebstore.google.com/detail/peanut-gallery/jjlpinlhfiheegiddmddkgfialcknagh` |
| Github repository | `https://github.com/Sethmr/peanut.gallery` |
| Manifest v3 declaration | `https://github.com/Sethmr/peanut.gallery/blob/main/extension/manifest.json` |
| MIT license | `https://github.com/Sethmr/peanut.gallery/blob/main/LICENSE` |
| Pack library | `https://github.com/Sethmr/peanut.gallery/tree/main/lib/packs` |
| Privacy statement | `/privacy` (needs a static `privacy.html` after URL transfer) |

## Known follow-ups (phase 2, after URL transfer)

- Legacy space-in-name files (`Landing Page.html`, `Operators Manual.html`, `Side Panel.html`) still present at repo root. They are `Disallow`-ed in `robots.txt` but should be removed once the URL cut-over is complete.
- `scraps/` and `specs/` are dev-only artifacts — candidates for removal or migration to a `_dev/` branch.
- Add a `privacy.html` (currently linked as `/privacy`, which today resolves via the legacy Next.js deploy on Vercel).
- Add Open Graph / Twitter card images in `assets/` and reference from each page `<head>`.

## License

MIT. See [`Sethmr/peanut.gallery/LICENSE`](https://github.com/Sethmr/peanut.gallery/blob/main/LICENSE).
