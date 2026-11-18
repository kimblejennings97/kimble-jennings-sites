import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Hero from "./components/Hero.jsx";
import Drawer from "./components/Drawer.jsx";
import GamesDrawer from "./components/GamesDrawer.jsx";
import AnalyticsDrawer from "./components/AnalyticsDrawer.jsx";
import { useFeed, useStatus } from "./lib/live.js";

const DRAWERS = ["games", "analytics"];
const fromHash = () => (DRAWERS.includes(location.hash.slice(1)) ? location.hash.slice(1) : null);

export default function App() {
  const [open, setOpen] = useState(fromHash);
  const feed = useFeed();
  const status = useStatus();

  // #games / #analytics deep links, and the browser back button closes a drawer
  const pushed = useRef(false);
  const show = useCallback((d) => {
    if (d) {
      setOpen(d);
      if (location.hash !== `#${d}`) {
        if (pushed.current) history.replaceState(null, "", `#${d}`);
        else { history.pushState(null, "", `#${d}`); pushed.current = true; }
      }
    } else {
      setOpen(null);
      if (pushed.current) { pushed.current = false; history.back(); }          // undo our own entry
      else if (location.hash) history.replaceState(null, "", location.pathname + location.search); // arrived via a #link
    }
  }, []);
  useEffect(() => {
    const onPop = () => { pushed.current = false; setOpen(fromHash()); };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  // G / A open, Esc closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, select") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && open) show(null);
      else if (!open && (e.key === "g" || e.key === "G")) show("games");
      else if (!open && (e.key === "a" || e.key === "A")) show("analytics");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, show]);

  // lock page scroll behind an open drawer
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.div
        animate={open ? { scale: 0.965, opacity: 0.35, filter: "blur(2px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
        style={{ transformOrigin: "50% 30%" }}
        aria-hidden={!!open}
      >
        <Hero feed={feed} onOpen={show} />
      </motion.div>

      <Drawer open={open === "games"} onClose={() => show(null)} label="Games" tone="games">
        <GamesDrawer status={status} onClose={() => show(null)} />
      </Drawer>
      <Drawer open={open === "analytics"} onClose={() => show(null)} label="Analytics" tone="analytics">
        <AnalyticsDrawer feed={feed} status={status} onClose={() => show(null)} />
      </Drawer>
    </>
  );
}
