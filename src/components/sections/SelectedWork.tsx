"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  security: "Security",
  ai: "AI / ML",
  game: "Game Dev",
  fullstack: "Full Stack",
};

function ProjectPanel({
  project,
  index,
  total,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  total: number;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="VIEW"
      className="stack-card sticky top-0 block min-h-[100dvh] origin-top"
    >
      <div
        className="flex min-h-[100dvh] flex-col justify-between border-t border-line/30 px-6 py-10 md:px-12 md:py-16"
        style={{
          backgroundColor: `hsl(0, 0%, ${4 + index * 1.5}%)`,
        }}
      >
        {/* Top row: index + category */}
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {project.index} / {String(total).padStart(2, "0")}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {CATEGORY_LABELS[project.category] || "Project"}
          </span>
        </div>

        {/* Center: Project title + tagline */}
        <div
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          style={{
            marginLeft: index % 2 === 0 ? 0 : "auto",
            marginRight: index % 2 === 0 ? "auto" : 0,
            maxWidth: "80%",
          }}
        >
          <div>
            <h2
              className="text-display text-ink-strong"
              style={{
                fontSize: "clamp(36px, 7vw, 100px)",
                lineHeight: 0.95,
              }}
            >
              {project.title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:text-base">
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Bottom row: year + role + tech */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted/60">
              {project.year}
            </span>
            <span className="h-px w-8 bg-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted/60">
              {project.role}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function SelectedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[cards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(card, {
          scale: 0.93,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="relative">
      {/* Section header */}
      <div className="flex items-end justify-between px-6 py-16 md:px-12 md:py-24">
        <h2
          className="text-display text-ink-strong"
          style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
        >
          Selected Work
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted hidden md:block">
          {PROJECTS.length} Projects
        </span>
      </div>

      {/* Stacking cards */}
      <div ref={sectionRef} className="relative">
        {PROJECTS.map((project, i) => (
          <ProjectPanel
            key={project.slug}
            project={project}
            index={i}
            total={PROJECTS.length}
          />
        ))}
      </div>
    </section>
  );
}
