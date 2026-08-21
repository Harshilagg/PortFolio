"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { Trophy } from "lucide-react";

export function KonamiCode() {
  const { activated } = useKonamiCode();

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Flash overlay */}
          <motion.div
            className="absolute inset-0 bg-accent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Achievement toast */}
          <motion.div
            className="relative rounded-2xl border border-accent bg-canvas px-8 py-6 text-center shadow-[0_0_40px_rgba(108,99,255,0.3)]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Trophy size={32} className="mx-auto mb-3 text-accent" />
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-accent">
              Achievement unlocked!
            </p>
            <p className="font-head text-[13px] font-semibold text-ink">
              &quot;The Konami Connoisseur&quot;
            </p>
            <p className="mt-3 font-mono text-[10px] text-muted/60">
              ↑↑↓↓←→←→BA
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
