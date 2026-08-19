"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import { ExternalLink } from "lucide-react";

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  product: { label: "PRODUCT", color: "#FFD34E" },
  security: { label: "SECURITY", color: "#FF6B6B" },
  ai: { label: "AI / ML", color: "#5AC8FA" },
  game: { label: "GAME DEV", color: "#FFD34E" },
  fullstack: { label: "FULL STACK", color: "#5AC8FA" },
};

export function FeaturedProjectsRow() {
  const featured = PROJECTS.slice(0, 4);

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[9px] text-arcade-yellow uppercase tracking-wider">
            Featured Projects
          </span>
          <span className="font-pixel text-[8px] text-arcade-muted">›</span>
        </div>
        <a
          href="#projects"
          className="font-pixel text-[8px] text-arcade-muted uppercase hover:text-arcade-yellow transition-colors"
        >
          VIEW ALL PROJECTS →
        </a>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((project, i) => {
          const cat = CATEGORY_LABELS[project.category] ?? { label: "PROJECT", color: "#FFD34E" };

          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
            >
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative border-2 border-arcade-border bg-arcade-card p-4 transition-all duration-300 hover:border-arcade-border-glow hover:-translate-y-1 hover:shadow-[0_0_16px_rgba(255,211,78,0.06)]">
                  {/* Category badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block border px-1.5 py-0.5 font-pixel text-[7px] uppercase tracking-wider"
                      style={{
                        color: cat.color,
                        borderColor: cat.color + "44",
                        backgroundColor: cat.color + "11",
                      }}
                    >
                      {cat.label}
                    </span>
                    <ExternalLink
                      size={10}
                      className="text-arcade-muted opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>

                  {/* Title & tagline */}
                  <h4 className="font-pixel text-[9px] text-arcade-white mb-1.5 leading-relaxed">
                    {project.title}
                  </h4>
                  <p className="font-mono text-[9px] text-arcade-muted leading-relaxed line-clamp-2 mb-3">
                    {project.tagline}
                  </p>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="border border-arcade-border bg-arcade-bg px-1 py-0.5 font-mono text-[7px] text-arcade-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Bottom accent */}
                  <div className="mt-3 flex gap-1">
                    {[cat.color, "#5AC8FA", "#FF6B6B"].map((c, idx) => (
                      <span
                        key={idx}
                        className="block h-1 w-1"
                        style={{ backgroundColor: c, opacity: 0.5 }}
                      />
                    ))}
                  </div>

                  {/* Hover glow */}
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
        })}
      </div>
    </motion.div>
  );
}
