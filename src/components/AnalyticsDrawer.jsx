import { motion } from "framer-motion";
import SplitFlap from "./SplitFlap.jsx";
import { ANALYTICS, host, statLink } from "../data/sites.js";
import { fmtStamp, statusText, tickerItems, useClock } from "../lib/live.js";

const two = (n) => String(n).padStart(2, "0");
const hms = (d) => `${two(d.getHours())}:${two(d.getMinutes())}:${two(d.getSeconds())}`;
const nextFirst = (now) => new Date(now.getFullYear(), now.getMonth() + 1, 1);
const day = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Label = ({ children }) => <div className="text-[10px] uppercase tracking-[0.22em] text-amber-dim">{children}</div>;

function Key({ href, children, strong }) {
  return (
    <motion.a
      href={href} target="_blank" rel="noopener"
      whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest no-underline transition-colors
        ${strong ? "border-amber-led/60 bg-amber-led/[0.08] text-amber-led hover:bg-amber-led/[0.16]" : "border-amber-led/20 text-amber-led/80 hover:border-amber-led/50 hover:text-amber-led"}`}
    >{children}</motion.a>
  );
}

function Lamp({ v }) {
  const c = v === true ? "bg-amber-led shadow-[0_0_8px_rgba(255,176,0,0.8)]" : v === false ? "bg-red-500" : "bg-amber-dim";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${c}`} />;
}

export default function AnalyticsDrawer({ feed, status, onClose }) {
  const now = useClock(1000);
  const marquee = [...tickerItems(feed).map(([k, v]) => `${k} ${v}`), `Momentum Picks next rebuild ${day(nextFirst(now))}`];
  const [stat, momentum] = ANALYTICS;

  return (
    <div className="min-h-full font-mono text-[13px] text-ink-2">
      {/* board header */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-amber-led/10 bg-[#0b0906]/95 px-5 py-3 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <SplitFlap text="KJ ANALYTICS" className="text-[15px]" />
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-amber-dim md:inline">Live board</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-amber-dim sm:inline">Local</span>
            <SplitFlap text={hms(now)} className="text-[15px]" stagger={0} />
          </div>
          <button onClick={onClose} className="rounded-md border border-amber-led/20 px-2.5 py-1 text-[11px] uppercase tracking-widest text-amber-led/70 transition-colors hover:border-amber-led/50 hover:text-amber-led">Esc · Close</button>
        </div>
      </header>

      {/* LED marquee */}
      <div className="relative overflow-hidden border-b border-amber-led/10 bg-black py-2.5" aria-label="Live data ticker">
        <div className="led led-dots marquee flex w-max gap-12 whitespace-nowrap font-crt text-[30px] uppercase leading-none" style={{ "--dur": `${Math.max(30, marquee.length * 8)}s` }}>
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-12" aria-hidden={k === 1}>
              {marquee.map((m, i) => <span key={i}>{m}<span className="ml-12 opacity-60">◆</span></span>)}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black" />
      </div>

      <div className="px-5 pb-12 pt-7 sm:px-8">
        {/* data feeds board */}
        <section aria-labelledby="feedsT">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="feedsT" className="text-[11px] uppercase tracking-[0.22em] text-amber-led/80">Data feeds · Stat Analysis</h2>
            <span className="text-[11px] text-ink-faint">Refreshed {fmtStamp(feed.refreshed)}</span>
          </div>
          <div className="mt-3 rounded-xl border border-amber-led/10 bg-[#080604]">
            <div className="hidden grid-cols-[70px_1fr_90px_80px_auto] items-center gap-4 border-b border-amber-led/10 px-4 py-2 lg:grid">
              <Label>League</Label><Label>Data through</Label><Label>Status</Label><Label>Seasons</Label><Label>Launch</Label>
            </div>
            {(feed.leagues.length ? feed.leagues : [{ key: "---", through: feed.loading ? "Loading" : "Feed offline", live: null, seasons: 0 }]).map((l, r) => (
              // phones/tablets: stacked; desktop: one board row
              <div key={l.key} className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-amber-led/[0.06] px-4 py-3 text-[14px] last:border-0 sm:text-[16px] lg:grid lg:grid-cols-[70px_1fr_90px_80px_auto] lg:gap-4 lg:py-2.5 lg:text-[17px]">
                <SplitFlap text={l.key} len={3} start={r * 120} />
                <span className="order-last w-full lg:order-none lg:w-auto"><SplitFlap text={l.through} len={24} start={r * 120 + 60} stagger={12} /></span>
                <SplitFlap text={l.live == null ? "" : l.live ? "LIVE" : "FINAL"} len={5} start={r * 120 + 200} />
                <span className="hidden items-center gap-1.5 sm:flex"><SplitFlap text={l.seasons ? two(l.seasons) : ""} len={2} start={r * 120 + 260} /><span className="text-[10px] uppercase tracking-widest text-amber-dim lg:hidden">seasons</span></span>
                {l.sport ? <span className="ml-auto lg:ml-0"><Key href={statLink(l.sport)}>{l.key} model ↗</Key></span> : <span />}
              </div>
            ))}
          </div>
        </section>

        {/* model categories */}
        <section className="mt-10 grid gap-5 lg:grid-cols-2" aria-label="Models">
          {[stat, momentum].map((s, n) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.15 + n * 0.08 }}
              className="flex flex-col rounded-xl border border-amber-led/10 bg-[#080604] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <Label>{s.kicker}</Label>
                <span className="flex items-center gap-1.5 text-[11px] text-ink-faint"><Lamp v={status[s.id]} />{statusText(status[s.id])}</span>
              </div>
              <div className="mt-3"><SplitFlap text={s.label} className="text-[24px] sm:text-[26px]" start={300 + n * 200} /></div>
              <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-ink-2">{s.desc}</p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Categories</Label>
                  <ul className="mt-2 space-y-1">
                    {s.feats.map((f) => <li key={f} className="flex items-center gap-2"><span className="h-1 w-1 bg-amber-led/70" />{f}</li>)}
                  </ul>
                </div>
                <div>
                  <Label>Timestamps</Label>
                  <dl className="mt-2 space-y-1 text-[12px]">
                    {s.id === "stat" ? (
                      <>
                        <div className="flex justify-between gap-3"><dt className="text-ink-faint">Data refreshed</dt><dd className="text-amber-led/90">{fmtStamp(feed.refreshed)}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-ink-faint">Last polled</dt><dd className="text-amber-led/90">{feed.fetchedAt ? hms(feed.fetchedAt) : "—"}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-ink-faint">Schedule</dt><dd>Daily</dd></div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between gap-3"><dt className="text-ink-faint">Rebuilds</dt><dd>1st of each month</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-ink-faint">Next rebuild</dt><dd className="text-amber-led/90">{day(nextFirst(now))}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-ink-faint">Universe</dt><dd>S&amp;P 500</dd></div>
                      </>
                    )}
                  </dl>
                  <div className="mt-4"><Label>Stack</Label></div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.stack.map((t) => <span key={t} className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[11px] text-ink-mute">{t}</span>)}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-amber-led/10 pt-5">
                <Key href={s.url} strong>Open ↗</Key>
                {s.id === "stat" && ["nfl", "nba", "mlb"].map((sp) => <Key key={sp} href={statLink(sp)}>{sp}</Key>)}
                {s.code && <Key href={s.code}>Code ↗</Key>}
                <span className="ml-auto text-[11px] text-ink-faint">{host(s.url)}</span>
              </div>
            </motion.article>
          ))}
        </section>

        <p className="mt-8 text-center text-[11px] text-ink-faint">Board polls the data feed every 5 minutes · Momentum Picks is not investment advice</p>
      </div>
    </div>
  );
}
