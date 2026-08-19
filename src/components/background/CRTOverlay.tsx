"use client";

import { useTheme } from "@/providers/ThemeContext";

export function CRTOverlay() {
  const { isDay } = useTheme();

  return (
    <>
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay transition-opacity duration-1000"
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 3px 100%",
          opacity: isDay ? 0.05 : 0.4
        }}
      />
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-10 mix-blend-screen transition-opacity duration-1000"
        style={{
          boxShadow: isDay ? "inset 0 0 50px rgba(0,0,0,0.2)" : "inset 0 0 100px rgba(0,0,0,0.9)"
        }}
      />
    </>
  );
}
