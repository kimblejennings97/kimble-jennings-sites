// Kimble Jennings · Sites & Games. Plain JS, no build step.
(() => {
  const SITES = [
    {
      id: "stat", kind: "stats", label: "Stat Analysis", color: "#4f8dff",
      url: "https://kimblejennings97.github.io/stat-analysis/", code: "https://github.com/kimblejennings97/stat-analysis",
      img: "img/stat-desktop.webp", mobile: "img/stat-mobile.webp",
      kicker: "Stat model builder",
      desc: "Build NFL, NBA and MLB stat models in real time. Tap stats, divide any stat by another (sacks per pressure, points per 100 possessions, ERA), and chart trends, stat-vs-stat scatters with team logos, or rankings.",
      feats: ["NFL · NBA · MLB", "Daily data refresh", "Trend · scatter · rankings", "Linear fit + R²", "Shareable links"],
    },
    {
      id: "whm", kind: "game", label: "Who Had More?", color: "#ffd23f",
      url: "https://kimblejennings97.github.io/whohadmore/", code: "https://github.com/kimblejennings97/whohadmore",
      img: "img/whm-desktop.webp", mobile: "img/whm-mobile.webp",
      kicker: "Trivia game",
      desc: "Two players, one stat: who had the bigger season? Keep your streak alive across NFL, MLB, NBA, NHL, WNBA and seven soccer leagues, single seasons or whole careers.",
      feats: ["12 leagues", "Season + career modes", "Easy / Hard", "Current seasons update daily"],
    },
    {
      id: "wrestling", kind: "game", label: "Wrestling Coach", color: "#ff5a4e",
      url: "https://wrestling-coach.kimble-jennings.workers.dev/", code: "https://github.com/kimblejennings97/wrestling-coach",
      img: "img/wrestling-desktop.webp", alt: "img/wrestling-moves.webp", mobile: "img/wrestling-mobile.webp",
      kicker: "Coaching sim",
      desc: "Take over a Division I wrestling program. Recruit, set lineups, train, run the dual schedule and tournaments, and watch every bout play out move by move, folkstyle and freestyle.",
      feats: ["Real rosters", "Live brackets", "Animated bouts", "Freestyle: Trials, Worlds, Olympics"],
    },
    {
      id: "book", kind: "game", label: "Mock Sportsbook", color: "#22c55e",
      url: "https://mock-sportsbook.pages.dev/", code: null,
      img: "img/sportsbook-desktop.webp", mobile: "img/sportsbook-mobile.webp",
      kicker: "Fake-money betting",
      desc: "Start with $1,000 of fake money and bet real DraftKings lines: moneylines, spreads, totals, player props and parlays. Bets grade themselves from ESPN results.",
      feats: ["Real lines", "Props + parlays", "Auto grading", "No real money, ever"],
    },
    {
      id: "momentum", kind: "stats", label: "Momentum Picks", color: "#a78bfa",
      url: "https://kimblejennings97.github.io/momentum-dashboard/", code: "https://github.com/kimblejennings97/momentum-dashboard",
      img: "img/momentum-desktop.webp", mobile: "img/momentum-mobile.webp",
      kicker: "Stock screener",
      desc: "Every S&P 500 stock scored on 6–12 month momentum, with the top 20 picks, a backtest against SPY and the sector mix. Rebuilt automatically on the 1st of each month.",
      feats: ["~500 stocks scored", "Top 20 picks", "Backtest vs SPY", "Monthly auto-update", "Not investment advice"],
    },
  ];

  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0, view = "desktop";
  // Every site is shown (category filters were removed while there are only a few sites).
  const visible = () => SITES.map((s, i) => i);

  // ---------------------------------------------------------------- showcase: one card (screenshot + details)
  const stage = $("stage"), shotImg = $("dImg"), altImg = $("dAlt");
  // warm the cache so switching sites is instant
  SITES.forEach((s) => [s.img, s.mobile, s.alt].filter(Boolean).forEach((src) => { const im = new Image(); im.src = src; }));

  // pagination dots
  const pager = $("pager");
  const dots = SITES.map((s, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", s.label);
    b.onclick = () => go(i);
    pager.appendChild(b);
    return b;
  });

  function paint() {
    const s = SITES[active];
    shotImg.src = view === "mobile" ? s.mobile : s.img;
    shotImg.alt = `${s.label} screenshot`;
    // Wrestling Coach has a second screenshot shown on hover
    altImg.hidden = !(s.alt && view === "desktop");
    if (s.alt) altImg.src = s.alt;
    $("dShot").href = s.url;
    $("dChromeUrl").textContent = s.url.replace(/^https:\/\//, "");
    detail();
  }

  function detail() {
    const s = SITES[active];
    document.documentElement.style.setProperty("--accent", s.color);
    $("dKind").textContent = s.kicker;
    $("dTitle").textContent = s.label;
    $("dDesc").textContent = s.desc;
    const ul = $("dFeats");
    ul.replaceChildren(...s.feats.map((f) => { const li = document.createElement("li"); li.textContent = f; return li; }));
    $("dOpen").href = s.url;
    $("dOpen").firstChild.textContent = s.kind === "game" ? "Play " : "Open ";
    $("dCode").hidden = !s.code;
    if (s.code) $("dCode").href = s.code;
    $("dUrl").textContent = s.url.replace(/^https:\/\//, "").replace(/\/$/, "");
    const st = $("dStatus");
    st.className = "status" + (status[s.id] === true ? " up" : status[s.id] === false ? " down" : "");
    st.lastChild.textContent = status[s.id] === true ? "online" : status[s.id] === false ? "unreachable" : "checking…";
  }

  let fadeT = 0;
  function go(i, instant = false) {
    if (i === active && !instant) return;
    active = i;
    dots.forEach((d, k) => d.setAttribute("aria-selected", k === active));
    if (instant || reduce) { paint(); return; }
    // quick cross-fade: fade out, swap content, fade back in
    stage.classList.add("fading");
    clearTimeout(fadeT);
    fadeT = setTimeout(() => { paint(); requestAnimationFrame(() => stage.classList.remove("fading")); }, 200);
  }
  function step(d) { go((active + d + SITES.length) % SITES.length); }
  function open() { window.open(SITES[active].url, "_blank", "noopener"); }

  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
    else if (e.key === "Enter" && (e.target === document.body || e.target.id === "stage")) open();
  });
  // swipe (and don't open the site when the gesture was a swipe)
  let sx = null, swiped = false;
  stage.addEventListener("pointerdown", (e) => { sx = e.clientX; swiped = false; });
  stage.addEventListener("pointerup", (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) { swiped = true; step(dx < 0 ? 1 : -1); }
  });
  $("dShot").addEventListener("click", (e) => { if (swiped) { e.preventDefault(); swiped = false; } });

  // desktop / phone screenshot
  document.querySelectorAll(".view-toggle button").forEach((b) => b.addEventListener("click", () => {
    view = b.dataset.v;
    document.querySelectorAll(".view-toggle button").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
    document.body.classList.toggle("mode-mobile", view === "mobile");
    paint();
  }));

  // ---------------------------------------------------------------- site status (reachability)
  const status = {};
  SITES.forEach((s) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    fetch(s.url, { mode: "no-cors", cache: "no-store", signal: ctl.signal })
      .then(() => { status[s.id] = true; })
      .catch(() => { status[s.id] = false; })
      .finally(() => { clearTimeout(t); if (SITES[active].id === s.id) detail(); });
  });

  // ---------------------------------------------------------------- live ticker (stat-analysis data feed)
  const FEED = "https://raw.githubusercontent.com/kimblejennings97/stat-analysis/data";
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dstr = (d) => `${MON[Math.floor(d / 100) % 100 - 1]} ${d % 100}`;
  Promise.allSettled(["nfl", "nba", "mlb"].map((sp) => fetch(`${FEED}/${sp}/meta.json?t=${Date.now()}`).then((r) => r.json())))
    .then((res) => {
      const items = [];
      const [nfl, nba, mlb] = res.map((r) => (r.status === "fulfilled" ? r.value : null));
      if (nfl) {
        const s = nfl.seasons.find((x) => x.season === nfl.latestSeason);
        items.push(["NFL", `${nfl.latestSeason} through ${s.maxWeek > 18 ? "the playoffs" : "Week " + s.maxWeek}`]);
      }
      if (nba) {
        const s = nba.seasons.find((x) => x.season === nba.latestSeason);
        items.push(["NBA", `${s.label} through ${dstr(s.maxDate)}`]);
      }
      if (mlb) {
        const s = mlb.seasons.find((x) => x.season === mlb.latestSeason);
        const today = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
        items.push(["MLB", today - s.maxDate > 7 ? `${s.season} season complete` : `${s.season} through ${dstr(s.maxDate)}`]);
      }
      const upd = [nfl, nba, mlb].filter(Boolean).map((m) => m.updated).sort().pop();
      if (upd) items.push(["Refreshed", new Date(upd).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })]);
      items.push(["Sites", `${SITES.length} live`]);
      const make = () => items.map(([k, v]) => {
        const sp = document.createElement("span");
        sp.className = "tick";
        const dot = document.createElement("i"); dot.className = "dot";
        const b = document.createElement("b"); b.textContent = k;
        sp.append(dot, b, document.createTextNode(" " + v));
        return sp;
      });
      $("ticker").replaceChildren(...make(), ...make()); // doubled for a seamless loop
    });

  // ---------------------------------------------------------------- quick round of Who Had More (real data)
  const q = { data: null, streak: 0, best: 0, cur: null, locked: false };
  try { q.best = +localStorage.getItem("kj.whmBest") || 0; } catch {}
  $("qBest").textContent = q.best;
  const WHM = "https://kimblejennings97.github.io/whohadmore/data-nfl.js";
  function loadWhm() {
    return new Promise((res, rej) => {
      if (window.SPORTS?.nfl) return res(window.SPORTS.nfl);
      const s = document.createElement("script");
      s.src = WHM; s.onload = () => res(window.SPORTS.nfl); s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function pair(d) {
    const keys = Object.keys(d.CATS);
    for (let t = 0; t < 300; t++) {
      const k = pick(keys);
      const pool = d.D.filter((r) => r[1] >= 2005 && r[3][k] != null);
      const a = pick(pool);
      const c = pool.filter((b) => b[0] !== a[0] && b[3][k] !== a[3][k] && Math.abs(a[3][k] - b[3][k]) / Math.max(a[3][k], b[3][k]) >= 0.04 && Math.abs(a[3][k] - b[3][k]) / Math.max(a[3][k], b[3][k]) <= 0.25);
      if (c.length) return { k, p: Math.random() < 0.5 ? [a, pick(c)] : [pick(c), a] };
    }
  }
  function round() {
    const pr = pair(q.data);
    q.cur = pr; q.locked = false;
    const board = $("qboard");
    const wrap = document.createElement("div");
    wrap.className = "qround";
    const head = document.createElement("div");
    head.className = "qstat";
    head.append(document.createTextNode("Who had more…"));
    const big = document.createElement("b"); big.textContent = q.data.CATS[pr.k]; head.appendChild(big);
    const row = document.createElement("div"); row.className = "qpair";
    pr.p.forEach((r, i) => {
      const b = document.createElement("button");
      b.className = "qcard";
      b.style.setProperty("--tc", q.data.TEAMS[r[2]]?.color || "#2b3d5c");
      const n = document.createElement("span"); n.className = "n"; n.textContent = r[0];
      const m = document.createElement("span"); m.className = "m"; m.textContent = `${r[1]} · ${r[2]}`;
      const v = document.createElement("span"); v.className = "v"; v.textContent = Number(r[3][pr.k]).toLocaleString();
      b.append(n, m, v);
      b.onclick = () => choose(i, row, wrap);
      row.appendChild(b);
      if (i === 0) { const vs = document.createElement("span"); vs.className = "vs"; vs.textContent = "VS"; row.appendChild(vs); }
    });
    const msg = document.createElement("div"); msg.className = "qmsg"; msg.setAttribute("role", "status");
    wrap.append(head, row, msg);
    board.replaceChildren(wrap);
    row.querySelector(".qcard").focus({ preventScroll: true });
  }
  function choose(i, row, wrap) {
    if (q.locked) return;
    q.locked = true;
    const v = q.cur.p.map((r) => r[3][q.cur.k]);
    const w = v[0] > v[1] ? 0 : 1, ok = i === w;
    const btns = [...row.querySelectorAll(".qcard")];
    btns.forEach((b, j) => { b.disabled = true; b.classList.add(j === w ? "win" : "lose"); });
    wrap.classList.add("shown");
    q.streak = ok ? q.streak + 1 : 0;
    if (q.streak > q.best) { q.best = q.streak; try { localStorage.setItem("kj.whmBest", q.best); } catch {} }
    $("qStreak").textContent = q.streak; $("qBest").textContent = q.best;
    const msg = wrap.querySelector(".qmsg");
    msg.textContent = ok ? "Correct!" : "Not this time, streak reset";
    msg.classList.add(ok ? "ok" : "no");
    const nx = document.createElement("button"); nx.className = "qnext"; nx.textContent = "Next round →";
    nx.onclick = round;
    wrap.appendChild(nx);
    nx.focus({ preventScroll: true });
  }
  $("qStart").onclick = async () => {
    $("qStart").textContent = "Loading…";
    try { q.data = await loadWhm(); round(); }
    catch { $("qStart").textContent = "Couldn't load the game data. Try again →"; }
  };

  go(0, true);
})();
