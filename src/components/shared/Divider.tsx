"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PixelDividerProps {
  className?: string;
  count?: number;
}

const COLORS = ["#FFD34E", "#5AC8FA", "#FF6B6B", "#F5F5F5", "#FFD34E"];

export function PixelDivider({ className, count = 9 }: PixelDividerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-1.5 py-12", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="block"
          style={{
            width: i % 3 === 0 ? 8 : 4,
            height: i % 3 === 0 ? 8 : 4,
            backgroundColor: COLORS[i % COLORS.length],
            opacity: 0.6,
          }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.6, scale: 1 }}
          transition={{
            delay: i * 0.05,
            duration: 0.3,
            ease: "easeOut",
          }}
          viewport={{ once: true, margin: "-50px" }}
        />
      ))}
    </div>
  );
}
