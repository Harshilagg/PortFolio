"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  product: { label: "Product", color: "#FFD34E" },
  security: { label: "Security", color: "#FF6B6B" },
  ai: { label: "AI / ML", color: "#5AC8FA" },
  game: { label: "Game Dev", color: "#FFD34E" },
  fullstack: { label: "Full Stack", color: "#5AC8FA" },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cat = CATEGORY_LABELS[project.category] ?? {
    label: "Project",
    color: "#FFD34E",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div
          className={cn(
            "relative border-2 border-arcade-border bg-arcade-card p-5 transition-all duration-300",
            "hover:-translate-y-2 hover:translate-x-1 hover:border-arcade-border-glow",
            "hover:shadow-[0_0_20px_rgba(255,211,78,0.1),-4px_4px_0_rgba(0,0,0,0.4)]"
          )}
        >
          {/* Cartridge ridges */}
          <div className="absolute top-0 right-2 w-8 h-1 flex gap-0.5 opacity-30">
            <div className="w-1/4 h-full bg-arcade-border"></div>
            <div className="w-1/4 h-full bg-arcade-border"></div>
            <div className="w-1/4 h-full bg-arcade-border"></div>
          </div>
          {/* Top bar */}
          <div className="mb-4 flex items-center justify-between">
            <span
              className="inline-block border px-2 py-0.5 font-pixel text-[8px] uppercase tracking-wider"
              style={{
                color: cat.color,
                borderColor: cat.color + "44",
                backgroundColor: cat.color + "11",
              }}
            >
              {cat.label}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 opacity-40 transition-opacity group-hover:opacity-100">
                <span className="block h-1.5 w-1.5 rounded-full bg-arcade-red" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                <span className="block h-1.5 w-1.5 rounded-full bg-arcade-yellow" />
              </div>
              <ExternalLink
                size={14}
                className="text-arcade-muted opacity-0 transition-opacity group-hover:opacity-100 ml-2"
              />
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 font-pixel text-xs leading-relaxed text-arcade-white md:text-[11px]">
            {project.title}
          </h3>

          {/* Tagline */}
          <p className="mb-4 font-mono text-xs leading-relaxed text-arcade-muted">
            {project.tagline}
          </p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="border border-arcade-border bg-arcade-bg px-1.5 py-0.5 font-mono text-[9px] text-arcade-muted"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-1 font-mono text-[9px] text-arcade-muted">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Bottom pixel accent */}
          <div className="mt-4 flex gap-1">
            {[cat.color, "#5AC8FA", "#FF6B6B"].map((c, i) => (
              <span
                key={i}
                className="block h-1.5 w-1.5"
                style={{ backgroundColor: c, opacity: 0.7 }}
              />
            ))}
          </div>

          {/* Hover glow overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${cat.color}08 0%, transparent 70%)`,
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
