"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, PERSONAL } from "@/lib/data";
import { Terminal, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface NavbarProps {
  onTerminalToggle: () => void;
}

const SECTION_IDS = ["hero", "about", "projects", "experience", "skills", "competitive", "contact"];

export function Navbar({ onTerminalToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const isActive = useCallback(
    (href: string) => activeSection === href.replace("#", ""),
    [activeSection]
  );

  return (
    <motion.nav
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-all duration-300",
        scrolled ? "border-b border-line bg-canvas/80 backdrop-blur-md" : "bg-transparent"
      )}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#hero" className="font-head text-sm font-semibold text-ink transition-opacity hover:opacity-80">
          Harshil Aggarwal
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 font-mono text-[12px] transition-colors duration-200",
                  active ? "text-ink" : "text-muted hover:text-ink"
                )}
              >
                {link.label}
                {active && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-surface"
                    layoutId="activeNav"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="hidden items-center gap-3 lg:flex">
          <span className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
            Available
          </span>
          <button
            onClick={onTerminalToggle}
            data-interactive
            className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 font-mono text-[11px] text-muted transition-colors hover:border-line-strong hover:text-ink"
            aria-label="Open terminal"
          >
            <Terminal size={12} />
            <span>{PERSONAL.name.split(" ")[0].toLowerCase()}@shell</span>
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-line bg-canvas/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 py-3 font-mono text-[13px] transition-colors",
                      active ? "text-accent" : "text-muted hover:text-ink"
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onTerminalToggle();
                }}
                className="flex items-center gap-2 py-3 font-mono text-[13px] text-muted transition-colors hover:text-ink"
              >
                <Terminal size={14} />
                Terminal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
