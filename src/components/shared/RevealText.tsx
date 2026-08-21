"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  delay?: number;
  speed?: number;
  trigger?: boolean;
}

const GLITCH_CHARS = "█▓▒░?#01ABCDEF<>{}[]";

export function GlitchText({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  speed = 30,
  trigger = true,
}: GlitchTextProps) {
  const [displayed, setDisplayed] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trigger || hasAnimated) return;

    const chars = text.split("");
    const resolved = new Array(chars.length).fill(false);
    let currentIndex = 0;

    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const result = chars.map((char, i) => {
          if (char === " ") return " ";
          if (resolved[i]) return char;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        });
        setDisplayed(result.join(""));

        if (currentIndex < chars.length) {
          resolved[currentIndex] = true;
          currentIndex++;
        }

        if (currentIndex >= chars.length) {
          setDisplayed(text);
          setHasAnimated(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, text, delay, speed, hasAnimated]);

  return (
    <Tag className={cn("whitespace-pre-wrap", className)}>{displayed}</Tag>
  );
}
