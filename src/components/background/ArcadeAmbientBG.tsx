"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/providers/ThemeContext";

export function ArcadeAmbientBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDay } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      time += 0.005;
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      const horizonY = height * 0.65;

      // Draw Grid
      ctx.save();
      const gradient = ctx.createLinearGradient(0, horizonY, 0, height);
      if (isDay) {
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.05)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.3)");
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      } else {
        gradient.addColorStop(0, "rgba(255, 211, 78, 0)");
        gradient.addColorStop(0.2, "rgba(255, 211, 78, 0.05)");
        gradient.addColorStop(1, "rgba(255, 211, 78, 0.15)");
        ctx.strokeStyle = "rgba(255, 211, 78, 0.2)";
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Perspective grid
      ctx.beginPath();
      const gridCells = 20;
      const cellWidth = width / gridCells;
      
      // Vertical lines with perspective
      for (let i = -gridCells; i <= gridCells * 2; i++) {
        const x = i * cellWidth;
        const offset = (x - width / 2) * 1.5;
        
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(width / 2 + offset, height);
      }

      // Horizontal lines (moving forward)
      const speed = isDay ? 20 : 15;
      const moveOffset = (time * speed) % 1;
      
      for (let i = 0; i < 15; i++) {
        const yPos = i + moveOffset;
        const y = horizonY + Math.pow(yPos / 15, 2) * (height - horizonY);
        
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDay]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[-5]"
      style={{ opacity: 0.8 }}
    />
  );
}
