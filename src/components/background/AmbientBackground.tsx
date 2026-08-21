"use client";

import { MouseGlow } from "./MouseGlow";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dot-grid texture */}
      <div className="dot-grid absolute inset-0" />

      {/* Soft ambient glow blobs */}
      <div
        className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-[0.14] blur-[120px]"
        style={{ background: "var(--color-accent)" }}
      />
      <div
        className="absolute top-[60vh] -right-40 h-[420px] w-[420px] rounded-full opacity-[0.08] blur-[120px]"
        style={{ background: "var(--color-azure)" }}
      />
      <div
        className="absolute top-[130vh] -left-40 h-[420px] w-[420px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "var(--color-coral)" }}
      />

      <MouseGlow />
    </div>
  );
}
