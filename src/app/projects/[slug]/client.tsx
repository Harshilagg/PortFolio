"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/data";

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  security: "Security",
  ai: "AI / ML",
  game: "Game Dev",
  fullstack: "Full Stack",
};

export function ProjectDetailClient({ project, prev, next }: Props) {
  return (
    <main className="relative z-10 min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={14} />
            Back to projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mt-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span
              className="inline-block rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide"
              style={{
                color: project.color,
                borderColor: project.color + "44",
                backgroundColor: project.color + "11",
              }}
            >
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="font-mono text-[11px] text-muted">{project.period}</span>
          </div>

          <h1 className="mb-3 font-head text-2xl font-semibold leading-tight text-ink md:text-3xl">
            {project.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-muted">
            {project.tagline}
          </p>
        </motion.div>

        {/* Content sections */}
        <div className="space-y-10">
          {/* Problem */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-accent">
              The Problem
            </h2>
            <p className="font-mono text-sm leading-relaxed text-muted/80">
              {project.problem}
            </p>
          </motion.section>

          {/* Features */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-accent">
              Key Features
            </h2>
            <ul className="space-y-2">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-sm text-muted/80">
                  <span
                    className="mt-2 block h-1 w-1 shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-accent">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line bg-canvas px-3 py-1 font-mono text-xs text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Challenges */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-coral">
              Challenges
            </h2>
            <ul className="space-y-2">
              {project.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-sm text-muted/80">
                  <span className="mt-2 block h-1 w-1 shrink-0 bg-coral" />
                  {c}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Learnings */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-azure">
              Learnings
            </h2>
            <ul className="space-y-2">
              {project.learnings.map((l, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-sm text-muted/80">
                  <span className="mt-2 block h-1 w-1 shrink-0 bg-azure" />
                  {l}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Links */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(108,99,255,0.6)] transition-opacity hover:opacity-90"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </motion.section>
        </div>

        {/* Prev / Next navigation */}
        <motion.div
          className="mt-16 flex items-center justify-between border-t border-line pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              {prev.title}
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              {next.title}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ) : <div />}
        </motion.div>
      </div>
    </main>
  );
}
