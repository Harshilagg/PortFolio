"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Panel({ children, className, hover = true }: PanelProps) {
  return (
    <div className={cn("panel", hover && "panel-hover", className)}>
      {children}
    </div>
  );
}
