"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  strings: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}

export function TypewriterText({
  strings,
  className,
  speed = 80,
  deleteSpeed = 40,
  pauseTime = 2000,
}: TypewriterTextProps) {
  const [text, setText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentString = strings[stringIndex];

    if (!isDeleting) {
      setText(currentString.substring(0, text.length + 1));
      if (text.length + 1 === currentString.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
    } else {
      setText(currentString.substring(0, text.length - 1));
      if (text.length - 1 === 0) {
        setIsDeleting(false);
        setStringIndex((prev) => (prev + 1) % strings.length);
        return;
      }
    }
  }, [text, stringIndex, isDeleting, strings, pauseTime]);

  useEffect(() => {
    const timeout = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [tick, isDeleting, deleteSpeed, speed]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{text}</span>
      <span
        className="ml-0.5 inline-block h-[1.1em] w-[0.55em] bg-arcade-yellow"
        style={{ animation: "type-cursor 0.8s step-end infinite" }}
      />
    </span>
  );
}
