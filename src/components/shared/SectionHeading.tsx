"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlitchText } from "./GlitchText";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={cn("mb-12 space-y-3", className)}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-pixel text-sm tracking-widest text-arcade-yellow uppercase md:text-base">
        <GlitchText text={title} trigger={inView} speed={25} />
      </h2>
      {subtitle && (
        <motion.p
          className="max-w-lg font-mono text-sm text-arcade-muted leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
