"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface PixelBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
}

export function PixelBorder({
  children,
  className,
  glowColor = "rgba(255,211,78,0.15)",
  hover = true,
}: PixelBorderProps) {
  return (
    <div
      className={cn(
        "relative border-2 border-arcade-border bg-arcade-card",
        hover &&
          "transition-all duration-300 hover:border-arcade-border-glow hover:shadow-[0_0_20px_rgba(255,211,78,0.08)]",
        className
      )}
      style={
        {
          "--glow-color": glowColor,
        } as React.CSSProperties
      }
    >
      {/* Corner pixels */}
      <span className="absolute -top-[3px] -left-[3px] h-[6px] w-[6px] bg-arcade-border" />
      <span className="absolute -top-[3px] -right-[3px] h-[6px] w-[6px] bg-arcade-border" />
      <span className="absolute -bottom-[3px] -left-[3px] h-[6px] w-[6px] bg-arcade-border" />
      <span className="absolute -bottom-[3px] -right-[3px] h-[6px] w-[6px] bg-arcade-border" />
      {children}
    </div>
  );
}
