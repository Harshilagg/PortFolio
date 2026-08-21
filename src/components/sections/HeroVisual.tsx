"use client";

import { motion } from "framer-motion";

const LINES: { text: string; color: string; delay: number }[] = [
  { text: "~ $ ./deploy_secure_architecture.sh", color: "var(--color-ink)", delay: 0.9 },
  { text: "[info] initializing zero-trust protocols...", color: "var(--color-muted)", delay: 1.3 },
  { text: "[info] compiling full-stack modules...", color: "var(--color-muted)", delay: 1.7 },
  { text: "[info] optimizing AI inference pipelines...", color: "var(--color-muted)", delay: 2.1 },
  { text: "success: all systems operational. security hardened.", color: "var(--color-azure)", delay: 2.6 },
];

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="w-full max-w-md"
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_40px_80px_-32px_rgba(0,0,0,0.6)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5c451]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]/70" />
          <span className="ml-2 font-mono text-[11px] text-muted">system_shell.sh</span>
        </div>

        {/* Body */}
        <div className="space-y-2.5 p-5 font-mono text-[12px] leading-relaxed">
          {LINES.map((line) => (
            <motion.p
              key={line.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: line.delay, duration: 0.3 }}
              style={{ color: line.color }}
            >
              {line.text}
            </motion.p>
          ))}
          <motion.span
            className="mt-2 inline-block h-3.5 w-2 bg-accent align-middle"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
