"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PERSONAL } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Each line moves at different scroll velocity
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const speed = [0.3, 0.5, 0.2, 0.6][i] || 0.3;
        const direction = i % 2 === 0 ? 1 : -1;

        gsap.fromTo(
          line,
          { x: direction * 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "center center",
              scrub: speed,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] flex-col justify-center px-6 py-32 md:px-12 lg:px-20"
    >
      <div className="max-w-[1400px]">
        {PERSONAL.manifesto.map((line, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) linesRef.current[i] = el;
            }}
            className="overflow-hidden"
          >
            <p
              className="text-display text-ink-strong"
              style={{
                fontSize:
                  i === 3
                    ? "clamp(40px, 8vw, 120px)"
                    : "clamp(44px, 10vw, 140px)",
                fontStyle: i === 3 ? "italic" : "normal",
                marginLeft:
                  i === 1 ? "6vw" : i === 2 ? "12vw" : i === 3 ? "3vw" : 0,
                lineHeight: 0.95,
                marginBottom: "0.15em",
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom utility strip */}
      <div className="mt-16 flex items-center gap-8">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
          Cybersecurity Engineer
        </span>
        <span className="h-px w-12 bg-line" />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
          Full Stack Developer
        </span>
        <span className="h-px w-12 bg-line" />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
          IIT Kharagpur
        </span>
      </div>
    </section>
  );
}
