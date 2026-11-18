import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GAMES, host } from "../data/sites.js";
import { statusText } from "../lib/live.js";
import QuickRound from "./QuickRound.jsx";

const slide = {
  enter: (d) => ({ x: d > 0 ? "18%" : "-18%", opacity: 0, filter: "brightness(2) blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "brightness(1) blur(0px)" },
  exit: (d) => ({ x: d > 0 ? "-18%" : "18%", opacity: 0, filter: "brightness(0.4) blur(4px)" }),
};
const SPRING = { type: "spring", stiffness: 260, damping: 30 };
const pad = (n) => String(n).padStart(2, "0");

function Dot({ v }) {
  const c = v === true ? "bg-phosphor" : v === false ? "bg-red-400" : "bg-white/25";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${c} ${v === true ? "shadow-[0_0_8px_rgba(125,255,168,0.7)]" : ""}`} />;
}

export default function GamesDrawer({ status, onClose }) {
  const [[i, dir], setSel] = useState([0, 0]);
  const [hoverAlt, setHoverAlt] = useState(false);
  const [quick, setQuick] = useState(false);
  const dragged = useRef(false); // a swipe on the screen must not also open the site
  const g = GAMES[i];
  const go = useCallback((d) => setSel(([k]) => [(k + d + GAMES.length) % GAMES.length, d]), []);
  const pick = (k) => setSel(([cur]) => [k, k > cur ? 1 : -1]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { go(1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); }
      else if (e.key === "Enter" && e.target.tagName !== "BUTTON" && e.target.tagName !== "A") window.open(g.url, "_blank", "noopener");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [go, g]);
  useEffect(() => { setHoverAlt(false); if (g.id !== "whm") setQuick(false); }, [g.id]);

  return (
    <div className="crt-scan-soft relative min-h-full font-mono text-[13px] text-ink-2">
      {/* cabinet marquee */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-phosphor/10 bg-[#070908]/90 px-5 py-3 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <span className="crt-flicker font-crt text-[26px] leading-none text-phosphor phosphor-glow">KJ&nbsp;ARCADE</span>
          <span className="hidden text-[11px] uppercase tracking-[0.2em] text-phosphor-dim sm:inline">Select game</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-crt text-[20px] leading-none text-phosphor-dim sm:inline">CREDIT {pad(GAMES.length)}</span>
          <button onClick={onClose} className="rounded-md border border-phosphor/15 px-2.5 py-1 text-[11px] uppercase tracking-widest text-phosphor-dim transition-colors hover:border-phosphor/40 hover:text-phosphor">Esc · Close</button>
        </div>
      </header>

      <div className="grid gap-8 px-5 pb-10 pt-6 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pt-8">
        {/* the screen */}
        <div className="min-w-0">
          <div className="rounded-[26px] border border-white/[0.06] bg-[#0d0f0e] p-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.03)] sm:p-4">
            <a
              href={g.url} target="_blank" rel="noopener" tabIndex={-1}
              className="crt-screen crt-scan block aspect-[16/10]"
              onMouseEnter={() => setHoverAlt(true)} onMouseLeave={() => setHoverAlt(false)}
              onClick={(e) => { if (dragged.current) { e.preventDefault(); dragged.current = false; } }}
              aria-label={`Open ${g.label}`}
            >
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.img
                  key={g.id + (hoverAlt && g.alt ? "-alt" : "")}
                  src={hoverAlt && g.alt ? g.alt : g.img}
                  alt={`${g.label} screenshot`}
                  custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                  transition={SPRING}
                  drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.35}
                  onDragStart={() => { dragged.current = true; }}
                  onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) go(info.offset.x < 0 ? 1 : -1); }}
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-cover object-top"
                  style={{ filter: "saturate(0.9) contrast(1.05)" }}
                />
              </AnimatePresence>
              <span className="pointer-events-none absolute left-3 top-3 z-10 rounded bg-black/60 px-1.5 py-0.5 font-crt text-[16px] leading-none text-phosphor phosphor-glow">
                {pad(i + 1)}/{pad(GAMES.length)}
              </span>
            </a>
          </div>

          {/* selector */}
          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => go(-1)} aria-label="Previous game" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-phosphor/15 text-phosphor-dim transition-colors hover:border-phosphor/40 hover:text-phosphor">◀</button>
            <div className="relative flex min-w-0 flex-1 gap-1 rounded-lg border border-white/[0.06] p-1" role="tablist" aria-label="Choose a game">
              {GAMES.map((x, k) => (
                <button
                  key={x.id} role="tab" aria-selected={k === i} onClick={() => pick(k)}
                  className={`relative z-10 min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-[11.5px] uppercase tracking-wider transition-colors ${k === i ? "text-[#07120b]" : "text-ink-mute hover:text-ink-2"}`}
                >
                  {k === i && <motion.span layoutId="cart" className="absolute inset-0 -z-10 rounded-md bg-phosphor shadow-[0_0_18px_rgba(125,255,168,0.35)]" transition={SPRING} />}
                  {x.label}
                </button>
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Next game" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-phosphor/15 text-phosphor-dim transition-colors hover:border-phosphor/40 hover:text-phosphor">▶</button>
          </div>
          <p className="mt-2 hidden text-[11px] text-ink-faint sm:block">← → to switch · Enter to launch · swipe the screen on phones</p>
        </div>

        {/* game card */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex min-w-0 flex-col"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-phosphor-dim">
              <span>Player 1</span><span className="text-white/15">/</span><span>{g.kicker}</span>
              <span className="ml-auto flex items-center gap-1.5 normal-case tracking-normal text-ink-faint"><Dot v={status[g.id]} />{statusText(status[g.id])}</span>
            </div>
            <h2 className="mt-3 font-crt text-[48px] uppercase leading-[0.9] text-ink sm:text-[58px]">{g.label}</h2>
            <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink-2">{g.desc}</p>

            <ul className="mt-5 space-y-1.5">
              {g.feats.map((f) => <li key={f} className="flex gap-2.5"><span className="text-phosphor-dim">›</span>{f}</li>)}
            </ul>

            <div className="mt-6">
              <div className="mb-2 text-[10.5px] uppercase tracking-[0.2em] text-ink-faint">Tech stack</div>
              <div className="flex flex-wrap gap-1.5">
                {g.stack.map((s) => <span key={s} className="rounded border border-white/[0.08] px-2 py-0.5 text-[11.5px] text-ink-mute">{s}</span>)}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <motion.a
                href={g.url} target="_blank" rel="noopener"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 rounded-lg border border-phosphor/50 bg-phosphor/[0.08] px-5 py-2.5 font-crt text-[24px] leading-none text-phosphor no-underline phosphor-glow transition-colors hover:bg-phosphor/[0.14]"
              >
                Press start <span className="transition-transform group-hover:translate-x-0.5">▸</span>
              </motion.a>
              {g.code && <a href={g.code} target="_blank" rel="noopener" className="text-[12px] uppercase tracking-widest text-ink-mute no-underline transition-colors hover:text-ink">Source ↗</a>}
              {g.id === "whm" && (
                <button onClick={() => setQuick((q) => !q)} className="text-[12px] uppercase tracking-widest text-phosphor-dim transition-colors hover:text-phosphor">
                  {quick ? "Hide quick round" : "Insert coin · quick round"}
                </button>
              )}
            </div>
            <p className="mt-3 text-[11px] text-ink-faint">{host(g.url)}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {quick && g.id === "whm" && (
          <motion.div
            key="quick"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-10 sm:mx-8"><QuickRound /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
