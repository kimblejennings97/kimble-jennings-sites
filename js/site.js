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
  ];

  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0, view = "desktop";
  // Every site is shown (category filters were removed while there are only a few sites).
  const visible = () => SITES.map((s, i) => i);

  // ---------------------------------------------------------------- cards
  const deck = $("deck");
  const cards = SITES.map((s, i) => {
    const c = document.createElement("article");
    c.className = "card";
    c.style.setProperty("--c", s.color);
    c.setAttribute("aria-label", s.label);
    c.innerHTML = `
      <div class="frame">
        <div class="chrome"><i></i><i></i><i></i><span></span></div>
        <div class="shot"><img alt="" loading="${i < 2 ? "eager" : "lazy"}" decoding="async"></div>
        <div class="glare"></div>
        <div class="label"></div>
      </div>
      <div class="phone"><img alt="" loading="lazy" decoding="async"></div>`;
    c.querySelector(".chrome span").textContent = s.url.replace(/^https:\/\//, "");
    const img = c.querySelector(".shot img");
    img.src = s.img;
    img.alt = `${s.label} screenshot`;
    if (s.alt) {
      const alt = document.createElement("img");
      alt.className = "alt"; alt.src = s.alt; alt.alt = ""; alt.loading = "lazy";
      c.querySelector(".shot").appendChild(alt);
    }
    c.querySelector(".phone img").src = s.mobile;
    c.querySelector(".label").textContent = s.label;
    c.addEventListener("click", () => (i === active ? open() : go(i)));
    // tilt + glare on the active card
    const frame = c.querySelector(".frame");
    c.addEventListener("pointermove", (e) => {
      if (i !== active || reduce || e.pointerType === "touch") return;
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      frame.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
      frame.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
      frame.style.setProperty("--gx", `${x * 100}%`);
      frame.style.setProperty("--gy", `${y * 100}%`);
    });
    c.addEventListener("pointerleave", () => { frame.style.setProperty("--rx", "0deg"); frame.style.setProperty("--ry", "0deg"); });
    deck.appendChild(c);
    return c;
  });

  // pager
  const pager = $("pager");
  const dots = SITES.map((s, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", s.label);
    b.onclick = () => go(i);
    pager.appendChild(b);
    return b;
  });

  function layout() {
    const vis = visible();
    const pos = vis.indexOf(active);
    const n = vis.length;
    const narrow = innerWidth < 760;
    cards.forEach((c, i) => {
      const k = vis.indexOf(i);
      c.classList.toggle("hidden", k < 0);
      c.classList.toggle("active", i === active);
      if (k < 0) return;
      // shortest circular distance from the active card
      let off = k - pos;
      if (n > 2) { if (off > n / 2) off -= n; if (off < -n / 2) off += n; }
      const a = Math.abs(off);
      const x = off * (narrow ? 70 : 52);
      const tz = -a * (narrow ? 260 : 220);
      const ry = off === 0 ? 0 : -Math.sign(off) * (narrow ? 50 : 38);
      c.style.transform = `translate(-50%, -50%) translateX(${x}%) translateZ(${tz}px) rotateY(${ry}deg)`;
      c.style.zIndex = String(100 - a);
      c.style.opacity = a > 1.5 ? "0" : a === 0 ? "1" : "0.55";
      c.style.filter = a === 0 ? "none" : "saturate(.6) brightness(.7)";
      c.setAttribute("aria-hidden", i === active ? "false" : "true");
    });
    dots.forEach((d, i) => { d.hidden = vis.indexOf(i) < 0; d.setAttribute("aria-selected", i === active); });
    $("prev").hidden = $("next").hidden = n < 2;
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
    bg.setColor(s.color);
  }

  function go(i) {
    active = i;
    layout();
    detail();
  }
  function step(d) {
    const vis = visible();
    const p = vis.indexOf(active);
    go(vis[(p + d + vis.length) % vis.length]);
  }
  function open() { window.open(SITES[active].url, "_blank", "noopener"); }

  $("prev").onclick = () => step(-1);
  $("next").onclick = () => step(1);
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
    else if (e.key === "Enter" && (e.target === document.body || e.target.id === "stage")) open();
  });
  // swipe
  let sx = null;
  $("stage").addEventListener("pointerdown", (e) => { sx = e.clientX; });
  $("stage").addEventListener("pointerup", (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  // desktop / phone screenshot
  document.querySelectorAll(".view-toggle button").forEach((b) => b.addEventListener("click", () => {
    view = b.dataset.v;
    document.querySelectorAll(".view-toggle button").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
    document.body.classList.toggle("mode-mobile", view === "mobile");
    cards.forEach((c, i) => { c.querySelector(".shot img").src = view === "mobile" ? SITES[i].mobile : SITES[i].img; });
  }));
  addEventListener("resize", layout);

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
    msg.style.color = ok ? "#3ddc84" : "#f87171";
    const nx = document.createElement("button"); nx.className = "qnext"; nx.textContent = "Next round ▶";
    nx.onclick = round;
    wrap.appendChild(nx);
    nx.focus({ preventScroll: true });
  }
  $("qStart").onclick = async () => {
    $("qStart").textContent = "Loading…";
    try { q.data = await loadWhm(); round(); }
    catch { $("qStart").textContent = "Couldn't load the game data. Try again ▶"; }
  };

  // ---------------------------------------------------------------- background: drifting constellation tinted by the active site
  const bg = (() => {
    const cv = $("bg"), ctx = cv.getContext("2d");
    let w, h, pts = [], color = "#ffd23f", mx = -1e4, my = -1e4;
    const resize = () => {
      w = cv.width = innerWidth * devicePixelRatio; h = cv.height = innerHeight * devicePixelRatio;
      const n = Math.min(110, Math.round((innerWidth * innerHeight) / 14000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
    };
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mx = e.clientX * devicePixelRatio; my = e.clientY * devicePixelRatio; });
    resize();
    const link = 140 * devicePixelRatio;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
          if (d < 180 * devicePixelRatio) { p.x -= dx * 0.004; p.y -= dy * 0.004; } // gently parts around the cursor
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      ctx.strokeStyle = color; ctx.fillStyle = color;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) { ctx.globalAlpha = (1 - d / link) * 0.22; ctx.lineWidth = devicePixelRatio; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6 * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return { setColor(c) { color = c; if (reduce) requestAnimationFrame(frame); } };
  })();

  go(0);
})();
