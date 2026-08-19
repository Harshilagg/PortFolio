"use client";

import { useTheme } from "@/providers/ThemeContext";
import { cn } from "@/lib/utils";

export function SkyLayer() {
  const { isDay } = useTheme();

  return (
    <div
      className={cn(
        "fixed inset-0 z-[-10] transition-colors duration-[1500ms]",
        isDay ? "bg-gradient-to-b from-[#4A90D9] to-[#87CEEB]" : "bg-gradient-to-b from-[#0A0E27] to-[#1A1A3E]"
      )}
    />
  );
}
