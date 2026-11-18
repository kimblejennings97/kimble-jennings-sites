# Kimble Jennings · Sites & Games (landing page)

Interactive landing page that links to all of the user's public sites. Plain HTML/CSS/JS, no build step.
Live: https://kimblejennings97.github.io/kimble-jennings-sites/ (GitHub Pages, `.github/workflows/deploy.yml`;
**every push to `main` deploys**, so push only when asked).

- Look (redesigned 2026-11-18 at the user's request): calm Linear/Vercel-style. Matte charcoal `#09090B` bg, `#111114` cards, 1px `rgba(255,255,255,0.08)` hairlines, Inter in Title Case (no ALL CAPS), monochrome browser dots, no glows, no background canvas. One unified showcase card (screenshot + details) with pagination dots and no arrow buttons. A site's `color` is used only for the small dot by its kicker.
- `js/site.js` `SITES` array = the cards (url, code link, screenshots, blurb, tags, accent color). Add a site there + its images in `img/`.
- Screenshots in `img/` are WebP, desktop 1440x900 and phone 390x844 @2x, captured with headless Chrome from the live sites.
  Wrestling Coach also has `wrestling-moves.webp`, shown when hovering its card.
- Live bits: ticker reads `meta.json` from the stat-analysis `data` branch; each card pings its site (no-cors) for an
  online dot; "Quick round" loads `data-nfl.js` from the live Who Had More site.
- Icons: gold trophy home-screen icon drawn as SVG in `tools/icon.html`; `powershell -File tools/make-icons.ps1 img\icons` renders the PNGs (apple-touch 180, 192, 512, favicon 32) used by `index.html` and `manifest.webmanifest`.
- Not listed on purpose: recipe-box (household app with no login; must stay unlisted). The Alpaca trading bot has no public page; only its companion Momentum Picks dashboard is listed (added 2026-11-17 at the user's request).
- Momentum Picks screenshots: headless Chrome won't render narrower than ~500px, so the phone shot was taken of a 390px iframe in a wider window and cropped to 780x1688.
