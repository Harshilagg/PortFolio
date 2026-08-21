"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  delay?: number;
  trigger?: boolean;
}

export function RevealText({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  trigger = true,
}: RevealTextProps) {
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={cn("whitespace-pre-wrap", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </MotionTag>
  );
}
