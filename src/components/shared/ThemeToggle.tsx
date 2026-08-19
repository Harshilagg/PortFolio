"use client";

import { useTheme } from "@/providers/ThemeContext";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
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
      className={cn(
        "relative flex h-8 w-[100px] items-center rounded-full border-2 border-arcade-border px-1 transition-colors duration-500",
        isDay ? "bg-[#FDF9F1]" : "bg-arcade-bg"
      )}
      aria-label="Toggle theme"
    >
      <div className="flex w-full items-center justify-between px-2 font-pixel text-[8px]">
        <span className={cn("transition-opacity", isDay ? "opacity-100 text-arcade-white" : "opacity-0")}>
          LIGHT
        </span>
        <span className={cn("transition-opacity text-arcade-muted", !isDay ? "opacity-100" : "opacity-0")}>
          DARK
        </span>
      </div>

      <motion.div
        className={cn(
          "absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-arcade-border",
          isDay ? "bg-white" : "bg-arcade-card"
        )}
        initial={false}
        animate={{
          left: isDay ? "calc(100% - 1.75rem)" : "0.25rem",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDay ? (
          <Sun size={10} className="text-arcade-yellow" />
        ) : (
          <Moon size={10} className="text-arcade-yellow" />
        )}
      </motion.div>
    </button>
  );
}

