"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "~ $ ./init_portfolio.sh", delay: 200 },
  { text: "", delay: 200 },
  { text: "Loading harshil-os v2.0.0 ...", delay: 500 },
  { text: "Mounting assets ......... OK", delay: 400 },
  { text: "Connecting to GitHub .... OK", delay: 400 },
  { text: "Compiling components .... OK", delay: 300 },
  { text: "", delay: 200 },
  { text: "System ready.", delay: 400 },
];

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    if (typeof window === "undefined") return;
    const hasBooted = sessionStorage.getItem("hasBooted");
    if (hasBooted) {
      setDone(true);
      return;
    }
    setShow(true);

    let totalDelay = 300;
    BOOT_LINES.forEach((line) => {
      totalDelay += line.delay;
      setTimeout(() => {
        setLines((prev) => [...prev, line.text]);
      }, totalDelay);
    });

    // Finish and fade out
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setDone(true);
        setShow(false);
        sessionStorage.setItem("hasBooted", "true");
      }, 800);
    }, totalDelay + 800);
  }, []);

  if (done && !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-200 flex flex-col items-start justify-center bg-canvas px-8 sm:px-16"
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Boot text */}
          <div className="relative z-10 w-full max-w-xl">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                className="font-mono text-xs leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                style={{
                  color:
                    line === "System ready."
                      ? "#6C63FF"
                      : line.includes("OK")
                        ? "#5AC8FA"
                        : "var(--color-muted)",
                }}
              >
                {line || " "}
              </motion.div>
            ))}

            {/* Blinking cursor */}
            {!fadeOut && (
              <motion.span
                className="mt-1 inline-block h-3 w-2 bg-accent"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </div>

          {/* Skip hint */}
          <motion.div
            className="absolute bottom-8 right-8 font-mono text-[11px] text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1 }}
          >
            <button
              onClick={() => {
                setFadeOut(true);
                setTimeout(() => {
                  setDone(true);
                  setShow(false);
                  sessionStorage.setItem("hasBooted", "true");
                }, 400);
              }}
              className="transition-colors hover:text-accent"
            >
              Skip →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
