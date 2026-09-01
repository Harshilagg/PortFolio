"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  const [label, setLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch device
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorAttr = target.closest("[data-cursor]");
      if (cursorAttr) {
        setLabel(cursorAttr.getAttribute("data-cursor") || "");
      } else if (target.closest("a[href^='http'], a[target='_blank']")) {
        setLabel("↗");
      } else if (target.closest("a, button, [data-interactive]")) {
        setLabel("");
      } else {
        setLabel("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch) return null;

  const hasLabel = label.length > 0;

  return (
    <motion.div
      ref={dotRef}
      className="pointer-events-none fixed z-[10000] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Crosshair dot */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          width: hasLabel ? 80 : 8,
          height: hasLabel ? 80 : 8,
          borderRadius: hasLabel ? 40 : 4,
          marginLeft: hasLabel ? -40 : -4,
          marginTop: hasLabel ? -40 : -4,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          backgroundColor: hasLabel ? "rgba(232, 228, 222, 0.08)" : "rgba(232, 228, 222, 0.9)",
          border: hasLabel ? "1px solid rgba(232, 228, 222, 0.2)" : "none",
        }}
      >
        {hasLabel && (
          <motion.span
            className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink-strong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Crosshair lines (visible when no label) */}
      {!hasLabel && (
        <>
          <div
            className="absolute bg-ink-strong/60"
            style={{
              width: 1,
              height: 16,
              left: -4.5,
              top: -18,
            }}
          />
          <div
            className="absolute bg-ink-strong/60"
            style={{
              width: 1,
              height: 16,
              left: -4.5,
              top: 6,
            }}
          />
          <div
            className="absolute bg-ink-strong/60"
            style={{
              width: 16,
              height: 1,
              left: -18,
              top: -4.5,
            }}
          />
          <div
            className="absolute bg-ink-strong/60"
            style={{
              width: 16,
              height: 1,
              left: 6,
              top: -4.5,
            }}
          />
        </>
      )}
    </motion.div>
  );
}
