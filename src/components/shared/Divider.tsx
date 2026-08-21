"use client";

import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div className={cn("mx-auto max-w-xs", className)}>
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-line-strong), transparent)",
        }}
      />
    </div>
  );
}
