"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  security: "Security",
  ai: "AI / ML",
  game: "Game Dev",
  fullstack: "Full Stack",
};

/** Deterministic abstract gradient-mesh artwork, unique per card without any image assets. */
function Artwork({ color, index }: { color: string; index: number }) {
  const a1 = (index * 67) % 360;
  const a2 = (index * 137 + 40) % 360;

  return (
    <div
      className="relative h-44 w-full overflow-hidden sm:h-48"
      style={{
        background: `linear-gradient(160deg, #0c0c11 0%, #15151b 100%)`,
      }}
    >
      {/* Gradient mesh blobs */}
      <div
        className="absolute -top-10 -left-10 h-40 w-40 rounded-full blur-[50px]"
        style={{ background: color, opacity: 0.55 }}
      />
      <div
        className="absolute -bottom-16 -right-8 h-48 w-48 rounded-full blur-[60px]"
        style={{ background: color, opacity: 0.28 }}
      />
      <div
        className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full blur-[36px]"
        style={{ background: "#5AC8FA", opacity: 0.16 }}
      />

      {/* Faint geometric linework for texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        className="absolute h-32 w-32 rounded-2xl border"
        style={{
          borderColor: `${color}33`,
          top: "20%",
          left: "55%",
          transform: `rotate(${a1}deg)`,
        }}
      />
      <div
        className="absolute h-20 w-20 rounded-full border"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          bottom: "10%",
          left: "8%",
          transform: `rotate(${a2}deg)`,
        }}
      />
    </div>
  );
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), {
    stiffness: 300,
    damping: 25,
  });
  const sheenX = useTransform(px, [-0.5, 0.5], ["-30%", "130%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block" data-interactive>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 32px 60px -24px rgba(0,0,0,0.55)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="relative overflow-hidden rounded-2xl border border-line bg-card transition-colors duration-300 group-hover:border-line-strong"
        >
          <Artwork color={project.color} index={index} />

          {/* Sheen sweep on hover */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              left: sheenX,
              background:
                "linear-gradient(75deg, transparent, rgba(255,255,255,0.10), transparent)",
            }}
          />

          {/* Info panel */}
          <div className="relative p-5" style={{ transform: "translateZ(20px)" }}>
            <div className="mb-3 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
                style={{
                  color: project.color,
                  borderColor: project.color + "40",
                  backgroundColor: project.color + "14",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {CATEGORY_LABELS[project.category] ?? "Project"}
              </span>
              <ArrowUpRight
                size={16}
                className="text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </div>

            <h3 className="mb-1.5 font-head text-[15px] font-semibold leading-snug text-ink">
              {project.title}
            </h3>
            <p className="mb-4 text-[13px] leading-relaxed text-muted line-clamp-2">
              {project.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-1 py-0.5 font-mono text-[10px] text-muted/70">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
