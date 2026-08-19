"use client";

import { useTheme } from "@/providers/ThemeContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CelestialLayer() {
  const { isDay } = useTheme();
  const [stars, setStars] = useState<{ x: number; y: number; s: number; d: number }[]>([]);

  useEffect(() => {
    // Generate static stars once
    if (typeof window !== "undefined") {
      const generated = Array.from({ length: 100 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.7),
        s: Math.random() * 2 + 1, // size
        d: Math.random() * 5 + 2, // duration
      }));
      setTimeout(() => setStars(generated), 0);
    }
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-9] overflow-hidden">
      {/* Sun */}
      <motion.div
        className={cn(
          "absolute transition-opacity duration-1000",
          isDay ? "opacity-100" : "opacity-0"
        )}
        style={{
          width: 80,
          height: 80,
          background: "#FFD34E",
          top: "7%",
          left: "20%",
          boxShadow: "0 0 40px #FFD34E, inset -4px -4px 0 rgba(0,0,0,0.1)",
          borderRadius: "50%",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      >
        {/* Pixelate the sun slightly */}
        <div className="absolute inset-0 rounded-full" style={{ imageRendering: "pixelated", backgroundImage: "radial-gradient(transparent 30%, rgba(255, 255, 255, 0.2) 35%, transparent 40%)" }} />
      </motion.div>

      {/* Moon */}
      <motion.div
        className={cn(
          "absolute transition-opacity duration-1000",
          !isDay ? "opacity-100" : "opacity-0"
        )}
        style={{
          width: 60,
          height: 60,
          background: "#F5F5F5",
          top: "7%",
          left: "20%",
          boxShadow: "0 0 30px rgba(255,255,255,0.4), inset -8px 0 0 rgba(0,0,0,0.1)",
          borderRadius: "50%",
        }}
      />

      {/* Stars */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          !isDay ? "opacity-100" : "opacity-0"
        )}
      >
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: star.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}
