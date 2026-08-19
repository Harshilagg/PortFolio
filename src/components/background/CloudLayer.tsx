"use client";

import { useTheme } from "@/providers/ThemeContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Pixel art cloud shapes using box-shadow
const cloudShapes = [
  "10px 0, 20px 0, 30px 0, 40px 0, 0 10px, 10px 10px, 20px 10px, 30px 10px, 40px 10px, 50px 10px, -10px 20px, 0 20px, 10px 20px, 20px 20px, 30px 20px, 40px 20px, 50px 20px, 60px 20px",
  "10px 0, 20px 0, -10px 10px, 0 10px, 10px 10px, 20px 10px, 30px 10px, 0 20px, 10px 20px, 20px 20px",
];

export function CloudLayer() {
  const { isDay } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [clouds, setClouds] = useState<{ y: number; shape: string; speed: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    setClouds([
      { y: 15, shape: cloudShapes[0], speed: 80, delay: 0, scale: 2 },
      { y: 25, shape: cloudShapes[1], speed: 60, delay: -20, scale: 1.5 },
      { y: 10, shape: cloudShapes[0], speed: 100, delay: -50, scale: 1.2 },
      { y: 30, shape: cloudShapes[1], speed: 120, delay: -80, scale: 2.5 },
    ]);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[-8] overflow-hidden">
      {clouds.map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${cloud.y}%`,
            width: 10,
            height: 10,
            color: isDay ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.15)",
            boxShadow: cloud.shape,
            transformOrigin: "left top",
            scale: cloud.scale,
          }}
          animate={{
            x: ["-10vw", "110vw"],
          }}
          transition={{
            duration: cloud.speed,
            ease: "linear",
            repeat: Infinity,
            delay: cloud.delay,
          }}
        />
      ))}
    </div>
  );
}
