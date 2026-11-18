// Every public site. `group` decides which drawer it lives in.
// Text (label, kicker, desc, feats) is unchanged from the previous landing page.
export const SITES = [
  {
    id: "stat", group: "analytics", label: "Stat Analysis", kicker: "Stat model builder",
    url: "https://kimblejennings97.github.io/stat-analysis/", code: "https://github.com/kimblejennings97/stat-analysis",
    img: "img/stat-desktop.webp", mobile: "img/stat-mobile.webp",
    desc: "Build NFL, NBA and MLB stat models in real time. Tap stats, divide any stat by another (sacks per pressure, points per 100 possessions, ERA), and chart trends, stat-vs-stat scatters with team logos, or rankings.",
    feats: ["NFL · NBA · MLB", "Daily data refresh", "Trend · scatter · rankings", "Linear fit + R²", "Shareable links"],
    stack: ["Vanilla JS", "D3", "GitHub Actions", "GitHub Pages"],
  },
  {
    id: "momentum", group: "analytics", label: "Momentum Picks", kicker: "Stock screener",
    url: "https://kimblejennings97.github.io/momentum-dashboard/", code: "https://github.com/kimblejennings97/momentum-dashboard",
    img: "img/momentum-desktop.webp", mobile: "img/momentum-mobile.webp",
    desc: "Every S&P 500 stock scored on 6–12 month momentum, with the top 20 picks, a backtest against SPY and the sector mix. Rebuilt automatically on the 1st of each month.",
    feats: ["~500 stocks scored", "Top 20 picks", "Backtest vs SPY", "Monthly auto-update", "Not investment advice"],
    stack: ["Python", "pandas", "yfinance", "GitHub Actions"],
  },
  {
    id: "tkyh", group: "games", label: "They Know You're Here", kicker: "First-person horror",
    url: "https://kimblejennings97.github.io/they-know-youre-here/", code: "https://github.com/kimblejennings97/they-know-youre-here",
    img: "img/tkyh-ingame.webp", alt: "img/tkyh-desktop.webp", mobile: "img/tkyh-mobile.webp",
    desc: "Walk an abandoned summer camp, a dead 90s arcade or a haunted castle with only a flashlight. Find what was lost and finish the tasks, and hide when they hear you. The more you finish, the more of them come.",
    feats: ["3 maps, 3 monsters", "Randomized objectives", "Hide in lockers & bushes", "Easy / Hard · 5–30 min", "Phone + desktop"],
    stack: ["three.js", "Web Audio", "ES modules", "GitHub Pages"],
  },
  {
    id: "whm", group: "games", label: "Who Had More?", kicker: "Trivia game",
    url: "https://kimblejennings97.github.io/whohadmore/", code: "https://github.com/kimblejennings97/whohadmore",
    img: "img/whm-desktop.webp", mobile: "img/whm-mobile.webp",
    desc: "Two players, one stat: who had the bigger season? Keep your streak alive across NFL, MLB, NBA, NHL, WNBA and seven soccer leagues, single seasons or whole careers.",
    feats: ["12 leagues", "Season + career modes", "Easy / Hard", "Current seasons update daily"],
    stack: ["Vanilla JS", "Node data scripts", "GitHub Actions", "GitHub Pages"],
  },
  {
    id: "wrestling", group: "games", label: "Wrestling Coach", kicker: "Coaching sim",
    url: "https://wrestling-coach.kimble-jennings.workers.dev/", code: "https://github.com/kimblejennings97/wrestling-coach",
    img: "img/wrestling-desktop.webp", alt: "img/wrestling-moves.webp", mobile: "img/wrestling-mobile.webp",
    desc: "Take over a Division I wrestling program. Recruit, set lineups, train, run the dual schedule and tournaments, and watch every bout play out move by move, folkstyle and freestyle.",
    feats: ["Real rosters", "Live brackets", "Animated bouts", "Freestyle: Trials, Worlds, Olympics"],
    stack: ["ES modules", "Canvas animation", "Cloudflare Workers"],
  },
  {
    id: "book", group: "games", label: "Mock Sportsbook", kicker: "Fake-money betting",
    url: "https://mock-sportsbook.pages.dev/", code: null,
    img: "img/sportsbook-desktop.webp", mobile: "img/sportsbook-mobile.webp",
    desc: "Start with $1,000 of fake money and bet real DraftKings lines: moneylines, spreads, totals, player props and parlays. Bets grade themselves from ESPN results.",
    feats: ["Real lines", "Props + parlays", "Auto grading", "No real money, ever"],
    stack: ["Vanilla JS", "Pages Functions", "Workers KV", "The Odds API"],
  },
];

export const GAMES = SITES.filter((s) => s.group === "games");
export const ANALYTICS = SITES.filter((s) => s.group === "analytics");

// Stat Analysis reads its state from the URL hash; {"sport":"nba"} opens that sport with its default model.
export const statLink = (sport) => `${SITES[0].url}#${encodeURIComponent(JSON.stringify({ sport }))}`;

export const host = (url) => url.replace(/^https:\/\//, "").replace(/\/$/, "");
