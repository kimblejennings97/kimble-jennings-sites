// Electromechanical split-flap text: each character riffles through a few flaps before landing.
// Only characters that change re-animate, so a clock flips digit by digit.
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-./%+&";

function Flap({ ch, delay }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? ch : " ");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) { setShown(ch); return; }
    let n = 0, t;
    const steps = ch === " " ? 1 : 3 + Math.floor(Math.random() * 6);
    const step = () => {
      n++;
      setTick((k) => k + 1);
      if (n >= steps) setShown(ch);
      else { setShown(CHARS[(Math.random() * CHARS.length) | 0]); t = setTimeout(step, 42); }
    };
    t = setTimeout(step, delay);
    return () => clearTimeout(t);
  }, [ch, delay, reduce]);
  return (
    <span className={`flap${shown === " " ? " blank" : ""}`} aria-hidden="true">
      <motion.span
        key={tick}
        initial={reduce ? false : { rotateX: -75, opacity: 0.5 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.07, ease: "easeOut" }}
        style={{ display: "inline-block", transformOrigin: "50% 50%" }}
      >
        {shown === " " ? " " : shown}
      </motion.span>
    </span>
  );
}

export default function SplitFlap({ text, len, className = "", stagger = 16, start = 0 }) {
  const s = String(text ?? "").toUpperCase().replace(/[–—]/g, "-");
  const padded = len ? s.padEnd(len).slice(0, len) : s;
  return (
    <span className={`inline-flex whitespace-nowrap ${className}`} role="text" aria-label={s.trim()}>
      {[...padded].map((c, i) => <Flap key={i} ch={c} delay={start + i * stagger} />)}
    </span>
  );
}
