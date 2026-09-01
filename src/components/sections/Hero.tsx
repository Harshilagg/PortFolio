"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import { PERSONAL } from "@/lib/data";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Character-by-character reveal on load
  useEffect(() => {
    if (!headlineRef.current) return;
    const chars = headlineRef.current.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.03,
        delay: 0.3,
      }
    );

    // Utility labels fade in
    const utils = headlineRef.current.parentElement?.querySelectorAll(".util-label");
    if (utils) {
      gsap.fromTo(
        utils,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1.5, stagger: 0.1 }
      );
    }
  }, []);

  // Pointer tracking for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking for hero transition
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollProgress = Math.min(scrollY / (typeof window !== "undefined" ? window.innerHeight : 1000), 1);

  const heroWords = ["BUILDING", "SYSTEMS", "THAT FEEL", "ALIVE."];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden"
      style={{
        transform: `scale(${1 + scrollProgress * 0.05})`,
        opacity: 1 - scrollProgress * 0.8,
      }}
    >
      {/* 3D scene layer (behind text) */}
      <div className="absolute inset-0 z-0" data-cursor="INTERACT">
        <HeroScene
          pointerX={pointer.x}
          pointerY={pointer.y}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgba(10,10,10,0.7) 100%)",
        }}
      />

      {/* Top bar — wordmark + index */}
      <div className="relative z-10 flex items-start justify-between px-6 pt-6 md:px-12 md:pt-10">
        <div className="util-label opacity-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {PERSONAL.wordmark}
          </span>
        </div>
        <div className="util-label opacity-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            01 / 07
          </span>
        </div>
      </div>

      {/* Center — Editorial Headline */}
      <div className="relative z-10 flex flex-1 items-center">
        <div
          ref={headlineRef}
          className="w-full px-6 md:px-12 lg:px-20"
        >
          {heroWords.map((word, lineIdx) => (
            <div key={lineIdx} className="overflow-hidden">
              <h1
                className="text-display text-ink-strong"
                style={{
                  fontSize: lineIdx === 3 ? "clamp(48px, 10vw, 140px)" : "clamp(52px, 12vw, 160px)",
                  fontStyle: lineIdx === 3 ? "italic" : "normal",
                  marginLeft: lineIdx === 1 ? "8vw" : lineIdx === 2 ? "4vw" : 0,
                  lineHeight: 0.92,
                }}
              >
                {word.split("").map((char, charIdx) => (
                  <span key={`${lineIdx}-${charIdx}`} className="char">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>
            </div>
          ))}

          {/* Subtitle */}
          <div className="util-label opacity-0 mt-8 md:mt-12 ml-1">
            <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">
              {PERSONAL.title}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar — utility labels + scroll indicator */}
      <div className="relative z-10 flex items-end justify-between px-6 pb-8 md:px-12 md:pb-12">
        {/* Left utility */}
        <div className="util-label opacity-0 flex items-center gap-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/60">
            {PERSONAL.education.institute}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/60">
            {PERSONAL.location}
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="util-label opacity-0 flex flex-col items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/50">
            Scroll
          </span>
          <div className="h-10 w-px overflow-hidden">
            <div className="h-full w-full bg-muted/40 scroll-indicator-line" />
          </div>
        </div>

        {/* Right utility */}
        <div className="util-label opacity-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/60">
            2026
          </span>
        </div>
      </div>
    </section>
  );
}
