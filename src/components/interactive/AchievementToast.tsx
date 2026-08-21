"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  description: string;
  xp: number;
};

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_scroll", title: "First Steps", description: "Scrolled past the hero section", xp: 100 },
  { id: "explorer", title: "Explorer", description: "Visited all sections", xp: 500 },
  { id: "konami", title: "Konami Connoisseur", description: "Entered the Konami code", xp: 1000 },
  { id: "terminal", title: "Hacker Mode", description: "Opened the terminal", xp: 250 },
  { id: "theme_switch", title: "Night Owl / Early Bird", description: "Toggled the theme", xp: 150 },
  { id: "project_click", title: "Curious Mind", description: "Clicked on a project", xp: 200 },
];

type AchievementContextType = {
  unlock: (id: string) => void;
  unlocked: Set<string>;
};

const AchievementContext = createContext<AchievementContextType>({
  unlock: () => {},
  unlocked: new Set(),
});

export function useAchievements() {
  return useContext(AchievementContext);
}

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<Achievement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    try {
      const saved = localStorage.getItem("achievements");
      if (saved) {
        setUnlocked(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  const unlock = useCallback(
    (id: string) => {
      if (!mounted) return;
      if (unlocked.has(id)) return;

      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (!achievement) return;

      setUnlocked((prev) => {
        const next = new Set(prev);
        next.add(id);
        try {
          localStorage.setItem("achievements", JSON.stringify([...next]));
        } catch {}
        return next;
      });

      setToast(achievement);
      setTimeout(() => setToast(null), 4000);
    },
    [unlocked, mounted]
  );

  // Auto-detect first scroll
  useEffect(() => {
    if (!mounted) return;
    const handler = () => {
      if (window.scrollY > 400) {
        unlock("first_scroll");
        window.removeEventListener("scroll", handler);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [unlock, mounted]);

  return (
    <AchievementContext.Provider value={{ unlock, unlocked }}>
      {children}
      <AchievementToast toast={toast} />
    </AchievementContext.Provider>
  );
}

function AchievementToast({ toast }: { toast: Achievement | null }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed top-20 left-1/2 z-[100] -translate-x-1/2"
          initial={{ y: -40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Flash */}
          <motion.div
            className="absolute inset-0 bg-accent/20 blur-xl"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />

          <div className="relative flex items-center gap-4 rounded-2xl border border-accent bg-canvas px-6 py-4 shadow-[0_0_30px_rgba(108,99,255,0.15)]">
            {/* Trophy icon */}
            <motion.div
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <Trophy size={24} className="text-accent" />
            </motion.div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                Achievement unlocked
              </p>
              <p className="mt-0.5 font-head text-[13px] font-semibold text-ink">
                &quot;{toast.title}&quot;
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-muted">
                {toast.description}
              </p>
            </div>

            {/* XP badge */}
            <motion.div
              className="flex flex-col items-center rounded-lg border border-accent/30 bg-accent/5 px-2.5 py-1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
            >
              <span className="font-mono text-[11px] font-medium text-accent">
                +{toast.xp}
              </span>
              <span className="font-mono text-[8px] text-muted">XP</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
