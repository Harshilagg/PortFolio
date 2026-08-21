"use client";

import { useTheme } from "@/providers/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useAchievements } from "@/components/interactive/AchievementToast";

export function ThemeToggle() {
  const { isDay, toggleTheme } = useTheme();
  const { unlock } = useAchievements();

  const handleToggle = () => {
    toggleTheme();
    unlock("theme_switch");
  };

  return (
    <button
      onClick={handleToggle}
      className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
      aria-label="Toggle theme"
      data-interactive
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDay ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {isDay ? <Sun size={15} /> : <Moon size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
