"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface AskAIButtonProps {
  onTerminalToggle: () => void;
}

export function AskAIButton({ onTerminalToggle }: AskAIButtonProps) {
  return (
    <motion.div
      className="fixed bottom-12 right-6 z-[45]"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        onClick={onTerminalToggle}
        className="group relative flex items-center gap-2 rounded-full border border-accent bg-card px-4 py-2.5 font-mono text-[11px] text-accent transition-all duration-300 hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(108,99,255,0.2)]"
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        data-interactive
        aria-label="Ask Harshil AI - Open Terminal"
      >
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-canvas">
          <MessageSquare size={12} className="text-accent" />
          {/* Pulsing glow dot */}
          <motion.div
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"
            animate={{
              boxShadow: [
                "0 0 0px rgba(74,222,128,0.5)",
                "0 0 8px rgba(74,222,128,0.8)",
                "0 0 0px rgba(74,222,128,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <span className="hidden sm:inline">Ask Harshil AI</span>

        {/* Tooltip for mobile */}
        <div className="pointer-events-none absolute right-0 bottom-full mb-2 whitespace-nowrap rounded-lg border border-line bg-canvas px-2.5 py-1.5 font-mono text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
          Open terminal for commands
        </div>
      </motion.button>
    </motion.div>
  );
}
