"use client";

import { useTheme } from "@/providers/ThemeContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AmbientCreatures() {
  const { isDay } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Birds state
  const [birds, setBirds] = useState<{ id: number; y: number; duration: number }[]>([]);
  // Fireflies state
  const [fireflies, setFireflies] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Generate initial fireflies
    const initialFireflies = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 60 + Math.random() * 40, // lower half of screen
    }));
    setFireflies(initialFireflies);

    // Bird spawner
    const birdInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setBirds(prev => [
          ...prev, 
          { id: Date.now(), y: 10 + Math.random() * 30, duration: 15 + Math.random() * 10 }
        ]);
      }
    }, 8000);

    // Firefly wanderer
    const fireflyInterval = setInterval(() => {
      setFireflies(prev => prev.map(f => ({
        ...f,
        x: Math.max(0, Math.min(100, f.x + (Math.random() * 10 - 5))),
        y: Math.max(50, Math.min(100, f.y + (Math.random() * 10 - 5))),
      })));
    }, 3000);

    // Cleanup old birds
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setBirds(prev => prev.filter(b => now - b.id < b.duration * 1000));
    }, 5000);

    return () => {
      clearInterval(birdInterval);
      clearInterval(fireflyInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[-6] overflow-hidden">
      <AnimatePresence>
        {/* Birds in day */}
        {isDay && birds.map(bird => (
          <motion.div
            key={bird.id}
            className="absolute flex items-center justify-center"
            style={{ top: `${bird.y}%`, left: "-5%" }}
            initial={{ x: 0 }}
            animate={{ x: "110vw", y: [0, -20, 10, -10, 0] }}
            transition={{ 
              x: { duration: bird.duration, ease: "linear" },
              y: { duration: bird.duration, ease: "easeInOut" }
            }}
            exit={{ opacity: 0 }}
          >
            {/* V-shape bird using CSS borders */}
            <div className="flex">
              <div className="h-1 w-2 border-b-2 border-r-2 border-[#1A1A1A] -rotate-45" />
              <div className="h-1 w-2 border-b-2 border-l-2 border-[#1A1A1A] rotate-45" />
            </div>
          </motion.div>
        ))}
        
        {/* Fireflies in night */}
        {!isDay && fireflies.map(fly => (
          <motion.div
            key={`fly-${fly.id}`}
            className="absolute h-1 w-1 rounded-full bg-[#D4F735]"
            style={{ 
              boxShadow: "0 0 8px 2px rgba(212, 247, 53, 0.6)",
            }}
            animate={{ 
              left: `${fly.x}%`, 
              top: `${fly.y}%`,
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              left: { duration: 3, ease: "easeInOut" },
              top: { duration: 3, ease: "easeInOut" },
              opacity: { duration: 1.5 + Math.random(), repeat: Infinity }
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
