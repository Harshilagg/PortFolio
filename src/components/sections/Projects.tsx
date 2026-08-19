"use client";

import { PROJECTS } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { PixelDivider } from "@/components/shared/PixelDivider";

export function Projects() {
  return (
    <section id="projects" className="section-padding px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="FEATURED PROJECTS >"
          subtitle="Projects I've built — from AI pipelines to encrypted messaging to chess engines."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="https://github.com/rohit-aggarwal"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pixel inline-flex items-center gap-2 border-2 border-arcade-border bg-arcade-card px-6 py-3 font-pixel text-[10px] text-arcade-muted uppercase transition-colors hover:border-arcade-border-glow hover:text-arcade-white"
          >
            VIEW ALL PROJECTS →
          </a>
        </div>

        <PixelDivider className="mt-16" />
      </div>
    </section>
  );
}
