# Kimble Jennings · Sites & Games (landing page)

Interactive landing page that links to all of the user's public sites. **React 18 + Tailwind CSS 3 + Framer Motion, built with Vite** (rebuilt 2026-11-18 at the user's request; before that it was plain HTML/CSS/JS).
Live: https://kimblejennings97.github.io/kimble-jennings-sites/ (GitHub Pages; `.github/workflows/deploy.yml` runs `npm ci && npm run build` and deploys `dist/`;
**every push to `main` deploys**, so push only when asked).

- Local: `npm install`, then `npm run dev` (hot reload) or `npm run build && npm run preview`. `vite.config.js` uses `base: "./"` so the build works under the `/kimble-jennings-sites/` subpath.
- Design: a minimal hero (name, a rotating one-line status ticker, two frosted pills **Games** and **Analytics**), and everything else is empty space. Each pill opens a spring bottom-sheet drawer (`src/components/Drawer.jsx`: drag the handle or flick down to close, Esc, Back button, focus trap). Deep links: `#games`, `#analytics`. Hotkeys G / A.
  - Palette: `#09090B` bg, `#111114` cards, 1px `rgba(255,255,255,0.08)` hairlines, Inter. Vintage accents only inside the drawers: phosphor green (`phosphor` in tailwind config) for Games, amber LED (`amber.led`) for Analytics.
  - Games drawer (`GamesDrawer.jsx`): CRT cabinet with scanlines/vignette, VT323 + IBM Plex Mono, a direction-aware selector (arrows, ← →, swipe), tech stack, a "Press start" launch button. Who Had More? has "Insert coin · quick round" (`QuickRound.jsx`, real NFL data from the live game's `data-nfl.js`, best streak in localStorage `kj.whmBest`).
  - Analytics drawer (`AnalyticsDrawer.jsx`): amber dot-matrix LED marquee, a split-flap board (`SplitFlap.jsx`: only changed characters re-flip) of the stat-analysis feeds with per-sport quick-launch links, model cards for Stat Analysis and Momentum Picks with timestamps, and a ticking split-flap clock.
- `src/data/sites.js` `SITES` = every site (group `games` | `analytics`, url, code link, screenshots, blurb, feats, stack). Add a site there + its images in `public/img/`. `statLink(sport)` builds Stat Analysis deep links (it reads JSON state from the URL hash; `{"sport":"nba"}` opens that sport).
- `src/lib/live.js`: the feed (`meta.json` from the stat-analysis `data` branch, polled every 5 min), no-cors reachability pings (online dots), and a clock hook.
- Screenshots in `public/img/` are WebP, desktop 1440x900 and phone 390x844 @2x, captured with headless Chrome from the live sites.
  Wrestling Coach also has `wrestling-moves.webp`, shown when hovering its screen.
- Icons: gold trophy home-screen icon drawn as SVG in `tools/icon.html`; `powershell -File tools/make-icons.ps1 public\img\icons` renders the PNGs (apple-touch 180, 192, 512, favicon 32) used by `index.html` and `public/manifest.webmanifest`.
- Not listed on purpose: recipe-box (household app with no login; must stay unlisted). The Alpaca trading bot has no public page; only its companion Momentum Picks dashboard is listed (added 2026-11-17 at the user's request).
- Momentum Picks screenshots: headless Chrome won't render narrower than ~500px, so the phone shot was taken of a 390px iframe in a wider window and cropped to 780x1688.
