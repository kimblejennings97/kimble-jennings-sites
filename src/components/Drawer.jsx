import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";

const SPRING = { type: "spring", stiffness: 280, damping: 32, mass: 0.9 };

const TONES = {
  games: "bg-[#070908] border-phosphor/10",
  analytics: "bg-[#0b0906] border-amber-led/10",
};

// Bottom sheet that springs up. Drag the handle (or flick down) to dismiss.
export default function Drawer({ open, onClose, label, tone, children }) {
  const controls = useDragControls();
  const panel = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
    } else if (lastFocus.current) {
      lastFocus.current.focus?.({ preventScroll: true });
    }
  }, [open]);

  // keep Tab inside the open drawer
  const trap = (e) => {
    if (e.key !== "Tab" || !panel.current) return;
    const f = panel.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-black/55"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.section
            key="sheet"
            ref={panel}
            role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
            onKeyDown={trap}
            className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[92dvh] max-w-6xl flex-col overflow-hidden rounded-t-[22px] border border-b-0 outline-none sm:h-[88dvh] ${TONES[tone]}`}
            style={{ boxShadow: "0 -30px 80px -20px rgba(0,0,0,0.85)" }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={SPRING}
            drag="y" dragListener={false} dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 650) onClose(); }}
          >
            <div
              className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-2.5 active:cursor-grabbing"
              onPointerDown={(e) => controls.start(e)}
              aria-hidden="true"
            >
              <span className="h-1 w-10 rounded-full bg-white/15" />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
