"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/providers/ThemeContext";

type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; size: number;
};

export function CursorParticles() {
  const mounted = useRef(false);
  const { isDay } = useTheme();
  const isDayRef = useRef(isDay);

  useEffect(() => {
    isDayRef.current = isDay;
  }, [isDay]);

  useEffect(() => {
    if (typeof window === "undefined" || mounted.current) return;
    mounted.current = true;

    // Skip on mobile / reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) { canvas.remove(); return; }

    const particles: Particle[] = [];
    let ci = 0, raf = 0, last = performance.now(), mx = 0, my = 0, frame = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    const spawn = (x: number, y: number, burst = false) => {
      const a = Math.random() * Math.PI * 2;
      const s = burst ? 30 + Math.random() * 100 : 10 + Math.random() * 35;
      const colors = isDayRef.current ? ["rgba(37,99,235,", "rgba(74,144,217,"] : ["rgba(255,213,71,", "rgba(99,219,255,"];
      particles.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (burst ? 0 : 8),
        life: 0, maxLife: 0.5 + Math.random() * 0.2,
        color: colors[ci++ % 2], size: 3,
      });
      if (particles.length > 35) particles.splice(0, particles.length - 35);
    };

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("a,button,[data-interactive]");
      if (!t) return;
      const r = (t as HTMLElement).getBoundingClientRect();
      for (let i = 0; i < 5; i++) spawn(r.left + r.width * 0.5, r.top + r.height * 0.5, true);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame++;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      if (frame % 3 === 0) spawn(mx, my);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= 0.97; p.vy *= 0.97;
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = `${p.color}${(alpha * 0.8).toFixed(3)})`;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      canvas.remove();
      mounted.current = false;
    };
  }, []);

  return null;
}
