"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "BIOS v2.0.0 — Pixel Machine Co.", delay: 200 },
  { text: "RAM OK ··· 8192 MB", delay: 400 },
  { text: "GPU OK ··· RTX ARCADE", delay: 300 },
  { text: "", delay: 200 },
  { text: "Loading HARSHIL.EXE ...", delay: 600 },
  { text: "Mounting portfolio assets ...", delay: 500 },
  { text: "Initializing pixel renderer ...", delay: 400 },
  { text: "Connecting to GitHub ...... OK", delay: 500 },
  { text: "Compiling skill tree ······ OK", delay: 300 },
  { text: "Syncing achievements ····· OK", delay: 300 },
  { text: "", delay: 200 },
  { text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%", delay: 600 },
  { text: "", delay: 200 },
  { text: "SYSTEM READY.", delay: 400 },
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
    BOOT_LINES.forEach((line, i) => {
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
          className="fixed inset-0 z-[200] flex flex-col items-start justify-center bg-black px-8 sm:px-16"
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* CRT scanlines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%)",
              backgroundSize: "100% 4px",
              opacity: 0.4,
            }}
          />

          {/* Screen flicker */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.03, 0, 0.02, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Boot text */}
          <div className="relative z-10 max-w-xl w-full">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                className="font-mono text-xs leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                style={{
                  color:
                    line === "SYSTEM READY."
                      ? "#FFD34E"
                      : line.includes("OK")
                        ? "#5AC8FA"
                        : line.includes("▓")
                          ? "#FFD34E"
                          : "#4ade80",
                  textShadow:
                    line === "SYSTEM READY."
                      ? "0 0 10px rgba(255,211,78,0.5)"
                      : "0 0 5px rgba(74,222,128,0.3)",
                }}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}

            {/* Blinking cursor */}
            {!fadeOut && (
              <motion.span
                className="inline-block h-3 w-2 bg-green-400 mt-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </div>

          {/* Skip hint */}
          <motion.div
            className="absolute bottom-8 right-8 font-pixel text-[8px] text-arcade-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
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
              className="hover:text-arcade-yellow transition-colors"
            >
              SKIP ›
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
