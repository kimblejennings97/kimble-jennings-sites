// "Who had more?" quick round using the live game's real NFL data (same logic as the old landing page).
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WHM = "https://kimblejennings97.github.io/whohadmore/data-nfl.js";
function loadWhm() {
  return new Promise((res, rej) => {
    if (window.SPORTS?.nfl) return res(window.SPORTS.nfl);
    const s = document.createElement("script");
    s.src = WHM; s.onload = () => res(window.SPORTS.nfl); s.onerror = rej;
    document.head.appendChild(s);
  });
}
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
function pair(d) {
  const keys = Object.keys(d.CATS);
  for (let t = 0; t < 300; t++) {
    const k = pickOne(keys);
    const pool = d.D.filter((r) => r[1] >= 2005 && r[3][k] != null);
    const a = pickOne(pool);
    const gap = (b) => Math.abs(a[3][k] - b[3][k]) / Math.max(a[3][k], b[3][k]);
    const c = pool.filter((b) => b[0] !== a[0] && b[3][k] !== a[3][k] && gap(b) >= 0.04 && gap(b) <= 0.25);
    if (c.length) return { k, p: Math.random() < 0.5 ? [a, pickOne(c)] : [pickOne(c), a] };
  }
}

export default function QuickRound() {
  const [data, setData] = useState(null);
  const [state, setState] = useState("idle"); // idle | loading | error | play
  const [round, setRound] = useState(null);
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => { try { return +localStorage.getItem("kj.whmBest") || 0; } catch { return 0; } });
  const firstCard = useRef(null), nextBtn = useRef(null);

  const start = async () => {
    setState("loading");
    try { const d = data || (await loadWhm()); setData(d); setRound(pair(d)); setPicked(null); setState("play"); }
    catch { setState("error"); }
  };
  const next = () => { setRound(pair(data)); setPicked(null); };
  const choose = (i) => {
    if (picked != null) return;
    const v = round.p.map((r) => r[3][round.k]);
    const w = v[0] > v[1] ? 0 : 1, ok = i === w;
    setPicked(i);
    const s = ok ? streak + 1 : 0;
    setStreak(s);
    if (s > best) { setBest(s); try { localStorage.setItem("kj.whmBest", s); } catch {} }
  };
  useEffect(() => { if (state === "play") (picked == null ? firstCard : nextBtn).current?.focus({ preventScroll: true }); }, [state, round, picked]);

  const winner = round ? (round.p[0][3][round.k] > round.p[1][3][round.k] ? 0 : 1) : null;

  return (
    <section className="rounded-2xl border border-phosphor/15 bg-[#060807] p-5 sm:p-7" aria-labelledby="qTitle">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 id="qTitle" className="font-crt text-[30px] uppercase leading-none text-phosphor phosphor-glow">Quick round: Who had more?</h3>
          <p className="mt-2 font-sans text-[14px] text-ink-mute">Real NFL seasons from the game's data. Pick the bigger number.</p>
        </div>
        <div className="flex items-baseline gap-5 font-crt text-[18px] uppercase text-phosphor-dim">
          <span><b className="mr-1.5 text-[30px] font-normal text-ink">{String(streak).padStart(2, "0")}</b>streak</span>
          <span><b className="mr-1.5 text-[30px] font-normal text-ink">{String(best).padStart(2, "0")}</b>best</span>
        </div>
      </div>

      <div className="mt-6 grid min-h-[190px] place-items-center border-t border-white/[0.06] pt-6">
        {state !== "play" ? (
          <button onClick={start} className="rounded-lg border border-phosphor/50 bg-phosphor/[0.08] px-5 py-2.5 font-crt text-[24px] uppercase leading-none text-phosphor phosphor-glow transition-colors hover:bg-phosphor/[0.14]">
            {state === "loading" ? "Loading…" : state === "error" ? "Couldn't load the game data. Try again ▸" : "Play a round ▸"}
          </button>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={round.p.map((r) => r[0] + r[1]).join() + round.k} className="w-full"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="text-center font-sans text-[14px] text-ink-mute">Who had more…
                <b className="mt-1 block font-crt text-[34px] font-normal uppercase leading-tight text-ink">{data.CATS[round.k]}</b>
              </div>
              <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
                {round.p.map((r, i) => {
                  const res = picked == null ? "" : i === winner ? "win" : "lose";
                  return [
                    i === 1 && <span key="vs" className="self-center justify-self-center font-crt text-[22px] text-phosphor-dim">VS</span>,
                    <button key={i} ref={i === 0 ? firstCard : null} disabled={picked != null} onClick={() => choose(i)}
                      className={`flex min-h-[116px] flex-col items-center justify-center gap-0.5 rounded-xl border bg-white/[0.02] p-4 text-center transition-colors
                        ${res === "win" ? "border-phosphor/60" : res === "lose" ? "border-red-400/40 opacity-75" : "border-white/[0.08] hover:border-phosphor/40"}`}
                      style={{ boxShadow: `inset 0 2px 0 ${data.TEAMS[r[2]]?.color || "transparent"}` }}>
                      <span className="font-sans text-[18px] font-semibold tracking-tight text-ink">{r[0]}</span>
                      <span className="text-[12px] text-ink-mute">{r[1]} · {r[2]}</span>
                      <span className={`mt-1 min-h-[30px] font-crt text-[30px] leading-none transition-opacity ${picked == null ? "opacity-0" : "opacity-100"} ${res === "win" ? "text-phosphor" : "text-red-400"}`}>
                        {Number(r[3][round.k]).toLocaleString()}
                      </span>
                    </button>,
                  ];
                })}
              </div>
              <div className="mt-4 text-center" role="status">
                {picked != null && (
                  <>
                    <p className={`font-crt text-[24px] uppercase ${picked === winner ? "text-phosphor phosphor-glow" : "text-red-400"}`}>
                      {picked === winner ? "Correct!" : "Not this time, streak reset"}
                    </p>
                    <button ref={nextBtn} onClick={next} className="mt-2 rounded-lg border border-white/15 px-4 py-1.5 text-[12px] uppercase tracking-widest text-ink transition-colors hover:bg-white/[0.05]">Next round ▸</button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <p className="mt-5 text-right text-[12px]"><a className="text-ink-mute no-underline transition-colors hover:text-phosphor" href="https://kimblejennings97.github.io/whohadmore/" target="_blank" rel="noopener">Play the full game: MLB, NBA, NHL, WNBA, soccer, careers →</a></p>
    </section>
  );
}
