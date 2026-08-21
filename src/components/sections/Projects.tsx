"use client";

import { PROJECTS } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Divider } from "@/components/shared/Divider";

export function Projects() {
  return (
    <section id="projects" className="section-padding px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Selected work"
          title="Things I've built"
          subtitle="From AI pipelines to encrypted messaging to chess engines — a few projects worth a closer look."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="https://github.com/Harshilagg"
            target="_blank"
            rel="noopener noreferrer"
            data-interactive
            className="btn-press inline-flex items-center gap-2 rounded-full border border-line bg-card px-6 py-3 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            View all on GitHub →
          </a>
        </div>

        <Divider className="mt-16" />
      </div>
    </section>
  );
}
