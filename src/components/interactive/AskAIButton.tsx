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
        className="group relative flex items-center gap-2 border-2 border-arcade-yellow bg-arcade-card px-4 py-2.5 font-pixel text-[9px] text-arcade-yellow uppercase transition-all duration-300 hover:bg-arcade-yellow/10 hover:shadow-[0_0_20px_rgba(255,211,78,0.2)]"
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        data-interactive
        aria-label="Ask Harshil AI - Open Terminal"
      >
        {/* Pixel robot icon */}
        <div className="relative flex h-6 w-6 items-center justify-center border border-arcade-yellow/30 bg-arcade-bg">
          <MessageSquare size={12} className="text-arcade-yellow" />
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
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap border border-arcade-border bg-arcade-bg px-2 py-1 font-pixel text-[7px] text-arcade-muted opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          Open terminal for commands
          <div className="absolute top-full right-4 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-arcade-border" />
        </div>
      </motion.button>
    </motion.div>
  );
}
