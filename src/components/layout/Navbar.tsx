"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import { Terminal, Menu, X, Home, User, Briefcase, Award, Zap, Sword, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useTheme } from "@/providers/ThemeContext";

interface NavbarProps {
  onTerminalToggle: () => void;
}

const NAV_ICONS: Record<string, React.ReactNode> = {
  "01. HOME": <Home size={12} />,
  "02. ABOUT": <User size={12} />,
  "03. WORK": <Briefcase size={12} />,
  "04. EXPERIENCE": <Award size={12} />,
  "05. SKILLS": <Zap size={12} />,
  "06. COMPETE": <Sword size={12} />,
  "07. CONTACT": <Mail size={12} />,
};

const SECTION_IDS = ["hero", "about", "projects", "experience", "skills", "competitive", "contact"];

export function Navbar({ onTerminalToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { isDay } = useTheme();

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
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
    (href: string) => {
      const sectionId = href.replace("#", "");
      return activeSection === sectionId;
    },
    [activeSection]
  );

  return (
    <motion.nav
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-arcade-border bg-arcade-bg/90 backdrop-blur-sm"
          : "bg-transparent"
      )}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a
            href="#hero"
            className="font-pixel text-[12px] text-arcade-yellow transition-opacity hover:opacity-80"
          >
            HA.
          </a>
          <span className="font-mono text-[9px] text-arcade-muted">v2.0.0</span>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 py-1.5 font-pixel text-[8px] transition-all duration-200",
                  active
                    ? "text-arcade-yellow"
                    : "text-arcade-muted hover:text-arcade-white"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  active ? "text-arcade-yellow" : "text-arcade-muted/70"
                )}>
                  {NAV_ICONS[link.label]}
                </span>
                {link.label}

                {/* Active indicator — pixel underline + border glow */}
                {active && (
                  <motion.div
                    className="absolute inset-0 border border-arcade-yellow/30 bg-arcade-yellow/5"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    style={{
                      boxShadow: "0 0 8px rgba(255,211,78,0.15)",
                    }}
                  />
                )}
              </a>
            );
          })}
          
          <div className="ml-2 flex items-center gap-2">
            <button
              onClick={onTerminalToggle}
              data-interactive
              className="flex items-center gap-2 border border-arcade-border bg-arcade-card px-3 py-1.5 font-pixel text-[8px] text-arcade-yellow transition-colors hover:border-arcade-yellow"
              aria-label="Toggle terminal"
            >
              <span>TERMINAL</span>
              <span className="text-arcade-white">{">_"}</span>
            </button>
            
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-arcade-muted"
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
            className="overflow-hidden border-b border-arcade-border bg-arcade-bg/95 backdrop-blur-sm lg:hidden"
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
                      "flex items-center gap-2 py-3 font-pixel text-[9px] transition-colors",
                      active
                        ? "text-arcade-yellow"
                        : "text-arcade-muted hover:text-arcade-yellow"
                    )}
                  >
                    <span className={cn(
                      "transition-colors",
                      active ? "text-arcade-yellow" : "text-arcade-muted/70"
                    )}>
                      {NAV_ICONS[link.label]}
                    </span>
                    {link.label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 bg-arcade-yellow" />
                    )}
                  </a>
                );
              })}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onTerminalToggle();
                }}
                className="flex items-center gap-2 py-3 font-pixel text-[9px] text-arcade-yellow transition-colors hover:text-arcade-white"
              >
                <Terminal size={12} />
                TERMINAL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
