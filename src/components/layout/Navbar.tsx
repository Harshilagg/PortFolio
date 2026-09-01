"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAL, NAV_LINKS } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 md:px-12 md:py-6 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(10, 10, 10, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
        {/* Wordmark */}
        <a
          href="#hero"
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/70 transition-colors hover:text-ink"
        >
          {PERSONAL.wordmark}
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/60 transition-colors hover:text-ink"
            >
              <span className="text-[8px] text-muted/30">{link.index}</span>
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block h-px w-5 bg-ink/60"
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3.5 : 0 }}
          />
          <motion.span
            className="block h-px w-5 bg-ink/60"
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3.5 : 0 }}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex flex-col items-start justify-center bg-canvas/95 px-8"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group mb-6 flex items-baseline gap-3"
              >
                <span className="font-mono text-[10px] text-muted/30">
                  {link.index}
                </span>
                <span
                  className="text-display text-ink-strong"
                  style={{ fontSize: "clamp(32px, 8vw, 56px)" }}
                >
                  {link.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
