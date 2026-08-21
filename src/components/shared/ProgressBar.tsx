"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface EXPBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export function EXPBar({
  label,
  value,
  max = 100,
  color = "#FFD34E",
  className,
}: EXPBarProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const percent = Math.min(100, (value / max) * 100);

  return (
    <div ref={ref} className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between font-pixel text-[9px] uppercase">
        <span className="text-arcade-muted">{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-2.5 w-full border border-arcade-border bg-arcade-bg">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {/* Pixel segments */}
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, transparent, transparent 6px, rgba(0,0,0,0.3) 6px, rgba(0,0,0,0.3) 8px)`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
