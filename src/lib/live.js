// Live data: stat-analysis feed (same source and wording as the old ticker), site reachability, a clock.
import { useEffect, useState } from "react";
import { SITES } from "../data/sites.js";

const FEED = "https://raw.githubusercontent.com/kimblejennings97/stat-analysis/data";
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dstr = (d) => `${MON[Math.floor(d / 100) % 100 - 1]} ${d % 100}`;
const REFRESH_MS = 5 * 60 * 1000;

async function loadFeed() {
  const res = await Promise.allSettled(["nfl", "nba", "mlb"].map((sp) =>
    fetch(`${FEED}/${sp}/meta.json?t=${Date.now()}`).then((r) => r.json())));
  const [nfl, nba, mlb] = res.map((r) => (r.status === "fulfilled" ? r.value : null));
  const leagues = [];
  if (nfl) {
    const s = nfl.seasons.find((x) => x.season === nfl.latestSeason);
    leagues.push({ key: "NFL", sport: "nfl", through: `${nfl.latestSeason} through ${s.maxWeek > 18 ? "the playoffs" : "Week " + s.maxWeek}`,
      live: s.maxWeek < 22, updated: nfl.updated, seasons: nfl.seasons.length }); // week 22 = Super Bowl
  }
  if (nba) {
    const s = nba.seasons.find((x) => x.season === nba.latestSeason);
    leagues.push({ key: "NBA", sport: "nba", through: `${s.label} through ${dstr(s.maxDate)}`, live: true, updated: nba.updated, seasons: nba.seasons.length });
  }
  if (mlb) {
    const s = mlb.seasons.find((x) => x.season === mlb.latestSeason);
    const today = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
    const done = today - s.maxDate > 7;
    leagues.push({ key: "MLB", sport: "mlb", through: done ? `${s.season} season complete` : `${s.season} through ${dstr(s.maxDate)}`, live: !done, updated: mlb.updated, seasons: mlb.seasons.length });
  }
  const upd = [nfl, nba, mlb].filter(Boolean).map((m) => m.updated).sort().pop();
  return { leagues, refreshed: upd ? new Date(upd) : null, fetchedAt: new Date(), ok: leagues.length > 0 };
}

export function useFeed() {
  const [feed, setFeed] = useState({ leagues: [], refreshed: null, fetchedAt: null, ok: false, loading: true });
  useEffect(() => {
    let alive = true;
    const run = () => loadFeed().then((f) => alive && setFeed({ ...f, loading: false })).catch(() => alive && setFeed((p) => ({ ...p, loading: false })));
    run();
    const t = setInterval(run, REFRESH_MS);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return feed;
}

// Momentum Picks publishes picks.json (date + top picks per strategy) next to its dashboard.
export function usePicks() {
  const [picks, setPicks] = useState(null);
  useEffect(() => {
    let alive = true;
    const url = SITES.find((s) => s.id === "momentum").url + "picks.json";
    const run = () => fetch(`${url}?t=${Date.now()}`).then((r) => (r.ok ? r.json() : null)).then((j) => alive && j && setPicks(j)).catch(() => {});
    run();
    const t = setInterval(run, 30 * 60 * 1000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return picks;
}

export const fmtStamp = (d) => d ? d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

// Ticker lines for the hero (same items as the old ticker)
export function tickerItems(feed) {
  const items = feed.leagues.map((l) => [l.key, l.through]);
  if (feed.refreshed) items.push(["Refreshed", fmtStamp(feed.refreshed)]);
  items.push(["Sites", `${SITES.length} live`]);
  return items;
}

// no-cors ping: resolves (opaque) when the host answers, rejects when unreachable
export function useStatus() {
  const [status, setStatus] = useState({});
  useEffect(() => {
    SITES.forEach((s) => {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 8000);
      fetch(s.url, { mode: "no-cors", cache: "no-store", signal: ctl.signal })
        .then(() => setStatus((p) => ({ ...p, [s.id]: true })))
        .catch(() => setStatus((p) => ({ ...p, [s.id]: false })))
        .finally(() => clearTimeout(t));
    });
  }, []);
  return status;
}

export function useClock(ms = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

export const statusText = (v) => (v === true ? "online" : v === false ? "unreachable" : "checking");
