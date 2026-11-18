import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tickerItems } from "../lib/live.js";

const NAME = "Kimble Jennings";

// One quiet line that rotates through the live items.
function StatusTicker({ feed }) {
  const items = tickerItems(feed);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 3200);
    return () => clearInterval(t);
  }, [items.length]);
  const cur = items[i % Math.max(1, items.length)];
  return (
    <div className="inline-flex h-8 items-center gap-2.5 overflow-hidden rounded-full border border-hair bg-card/60 px-3.5 text-[13px] text-ink-mute" aria-live="polite" aria-label="Live data">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
      </span>
      <span className="relative inline-flex min-w-[15.5rem] justify-start">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={cur ? cur.join() : "loading"}
            initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="whitespace-nowrap"
          >
            {cur ? <><b className="font-medium text-ink-2">{cur[0]}</b>&nbsp;&nbsp;{cur[1]}</> : "Loading live data…"}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

function Pill({ emoji, label, hotkey, onClick }) {
  return (
    <motion.button
      className="pill"
      onClick={onClick}
      whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span aria-hidden="true" className="text-base leading-none">{emoji}</span>
      {label}
      <span className="kbd ml-1 hidden sm:inline" aria-hidden="true">{hotkey}</span>
    </motion.button>
  );
}

export default function Hero({ feed, onOpen }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-16 text-center">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
          <span className="mx-auto mb-7 grid h-10 w-10 place-items-center rounded-[10px] border border-hair bg-card text-[13px] font-semibold tracking-tight text-ink" aria-hidden="true">KJ</span>
        </motion.div>
        <h1 className="text-[clamp(40px,8vw,76px)] font-semibold leading-[1.02] tracking-tightest" aria-label={NAME}>
          {NAME.split("").map((ch, i) => (
            <motion.span
              key={i} aria-hidden="true" className="inline-block whitespace-pre"
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.1 + i * 0.028 }}
            >{ch}</motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-4 text-[15px] text-ink-mute"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.6 }}
        >Sports stat tools, games &amp; side projects</motion.p>

        <motion.div className="mt-7" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
          <StatusTicker feed={feed} />
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 24 }}
        >
          <Pill emoji="🕹️" label="Games" hotkey="G" onClick={() => onOpen("games")} />
          <Pill emoji="📈" label="Analytics" hotkey="A" onClick={() => onOpen("analytics")} />
        </motion.div>
      </main>

      <footer className="px-6 pb-8 text-center text-[12px] leading-relaxed text-ink-faint">
        <p className="mx-auto max-w-2xl">Built with plain HTML, CSS and JavaScript. Stats refresh daily from free public data (nflverse, ESPN, MLB Stats API).
          Unofficial fan projects, not affiliated with any league or team.</p>
        <p className="mt-2"><a className="text-ink-mute no-underline transition-colors hover:text-ink" href="https://github.com/kimblejennings97" target="_blank" rel="noopener">github.com/kimblejennings97</a></p>
      </footer>
    </div>
  );
}
