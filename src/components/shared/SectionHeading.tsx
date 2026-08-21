"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { RevealText } from "./RevealText";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={cn("mb-12 max-w-xl", className)}>
      {eyebrow && (
        <motion.p
          className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5 }}
        >
          {eyebrow}
        </motion.p>
      )}
      <RevealText
        as="h2"
        text={title}
        trigger={inView}
        className="font-head text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      />
      {subtitle && (
        <motion.p
          className="mt-4 text-sm leading-relaxed text-muted"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
