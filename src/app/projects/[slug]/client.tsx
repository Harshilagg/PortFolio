"use client";

import Link from "next/link";
import type { Project } from "@/lib/data";

interface ProjectDetailClientProps {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export function ProjectDetailClient({
  project,
  prev,
  next,
}: ProjectDetailClientProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Back nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6"
        style={{ backgroundColor: "rgba(10, 10, 10, 0.85)", backdropFilter: "blur(8px)" }}
      >
        <Link
          href="/#work"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
        >
          ← Back
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {project.index} / 06
        </span>
      </nav>

      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col justify-end px-6 pb-16 pt-24 md:px-12 md:pb-24 lg:px-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/50 mb-4 block">
              {project.year} — {project.role}
            </span>
            <h1
              className="text-display text-ink-strong"
              style={{ fontSize: "clamp(36px, 7vw, 100px)", lineHeight: 0.95 }}
            >
              {project.title}
            </h1>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {project.tagline}
        </p>
      </section>

      {/* Divider */}
      <div className="mx-6 border-t border-line/20 md:mx-12 lg:mx-20" />

      {/* Content grid */}
      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left — description + problem */}
          <div className="lg:col-span-7">
            <div className="mb-12">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Overview
              </span>
              <p className="mt-4 text-sm leading-[1.8] text-muted md:text-base">
                {project.description}
              </p>
            </div>

            <div className="mb-12">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Problem
              </span>
              <p className="mt-4 text-sm leading-[1.8] text-muted md:text-base">
                {project.problem}
              </p>
            </div>

            <div className="mb-12">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Key Features
              </span>
              <div className="mt-4 space-y-3">
                {project.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-2 block h-px w-4 shrink-0 bg-line-strong" />
                    <p className="text-sm leading-relaxed text-muted/80">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Challenges
              </span>
              <div className="mt-4 space-y-3">
                {project.challenges.map((challenge, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted/70">
                    {challenge}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right — metadata */}
          <div className="lg:col-span-5">
            <div className="mb-10">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Technology
              </span>
              <div className="mt-4 flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="border-b border-line/30 pb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Period
              </span>
              <p className="mt-4 text-sm text-muted">
                {project.period}
              </p>
            </div>

            <div className="mb-10">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Role
              </span>
              <p className="mt-4 text-sm text-muted">
                {project.role}
              </p>
            </div>

            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                Learnings
              </span>
              <div className="mt-4 space-y-2">
                {project.learnings.map((learning, i) => (
                  <p key={i} className="text-xs leading-relaxed text-muted/60">
                    {learning}
                  </p>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mt-10 flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="↗"
                  className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
                >
                  GitHub →
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="↗"
                  className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
                >
                  Demo →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Prev / Next navigation */}
      <div className="border-t border-line/20 px-6 py-12 md:px-12 md:py-16 lg:px-20">
        <div className="flex items-center justify-between">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              data-cursor="VIEW"
              className="group"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40 block mb-2">
                Previous
              </span>
              <span className="text-editorial text-muted transition-colors group-hover:text-ink text-lg">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              data-cursor="VIEW"
              className="group text-right"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40 block mb-2">
                Next
              </span>
              <span className="text-editorial text-muted transition-colors group-hover:text-ink text-lg">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
