# Kimble Jennings · Sites & Games (landing page)

Interactive landing page that links to all of the user's public sites. Plain HTML/CSS/JS, no build step.
Live: https://kimblejennings97.github.io/kimble-jennings-sites/ (GitHub Pages, `.github/workflows/deploy.yml`;
**every push to `main` deploys**, so push only when asked).

- `js/site.js` `SITES` array = the cards (url, code link, screenshots, blurb, tags, accent color). Add a site there + its images in `img/`.
- Screenshots in `img/` are WebP, desktop 1440x900 and phone 390x844 @2x, captured with headless Chrome from the live sites.
  Wrestling Coach also has `wrestling-moves.webp`, shown when hovering its card.
- Live bits: ticker reads `meta.json` from the stat-analysis `data` branch; each card pings its site (no-cors) for an
  online dot; "Quick round" loads `data-nfl.js` from the live Who Had More site.
- Not listed on purpose: recipe-box (household app with no login; must stay unlisted) and the trading dashboard.
