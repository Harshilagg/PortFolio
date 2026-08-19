"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { TERMINAL_COMMANDS, PERSONAL } from "@/lib/data";
import { useAchievements } from "./AchievementToast";

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

type Line = { type: "input" | "output"; text: string };

export function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: `Welcome to harshil-os v1.0.0` },
    { type: "output", text: `Type "help" for available commands.\n` },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      unlock("terminal");
    }
  }, [open, unlock]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const execute = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      const newLines: Line[] = [
        ...lines,
        { type: "input" as const, text: `> ${cmd}` },
      ];

      if (trimmed === "clear") {
        setLines([]);
        return;
      }

      if (trimmed === "resume") {
        window.open("/Harshil_Aggarwal_Resume.pdf", "_blank");
      } else if (trimmed === "github") {
        window.open(PERSONAL.github, "_blank");
      } else if (trimmed === "linkedin") {
        window.open(PERSONAL.linkedin, "_blank");
      }

      const response = TERMINAL_COMMANDS[trimmed];
      if (response) {
        newLines.push({ type: "output", text: response });
      } else if (trimmed) {
        newLines.push({
          type: "output",
          text: `Command not found: "${trimmed}". Type "help" for available commands.`,
        });
      }

      setLines(newLines);
      setHistory((prev) => [cmd, ...prev].slice(0, 50));
      setHistoryIndex(-1);
    },
    [lines]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const idx = historyIndex + 1;
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const idx = historyIndex - 1;
        setHistoryIndex(idx);
        setInput(history[idx]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          {/* Terminal window */}
          <motion.div
            className="relative w-full max-w-2xl border-2 border-arcade-border bg-arcade-bg shadow-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-arcade-border px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 bg-arcade-red" />
                  <span className="h-2.5 w-2.5 bg-arcade-yellow" />
                  <span className="h-2.5 w-2.5 bg-green-500" />
                </div>
                <span className="font-pixel text-[8px] text-arcade-muted uppercase">
                  harshil@portfolio:~
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-arcade-muted transition-colors hover:text-arcade-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Output area */}
            <div
              ref={scrollRef}
              className="h-80 overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:h-96"
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "input"
                      ? "text-arcade-yellow"
                      : "whitespace-pre-wrap text-arcade-muted/80"
                  }
                >
                  {line.text}
                </div>
              ))}

              {/* Input line */}
              <div className="mt-1 flex items-center gap-2">
                <span className="text-arcade-yellow">{">"}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border-none bg-transparent font-mono text-xs text-arcade-white outline-none"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
