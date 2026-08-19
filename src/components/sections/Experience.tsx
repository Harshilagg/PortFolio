"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EXPERIENCE } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PixelDivider } from "@/components/shared/PixelDivider";
import { Briefcase } from "lucide-react";

const XP_VALUES = ["+500 XP", "+750 XP", "+1000 XP"];

function TimelineItem({ exp, index }: { exp: (typeof EXPERIENCE)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 pb-12 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Timeline line */}
      <div className="absolute top-0 left-[11px] h-full w-px bg-arcade-border" />

      {/* Checkpoint + XP Toast */}
      {inView && (
        <>
          {/* CHECKPOINT SAVED text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1, 1], y: [0, -15, -20, -30] }}
            transition={{ delay: index * 0.15 + 0.5, duration: 1.5 }}
            className="absolute -top-3 left-8 font-pixel text-[8px] tracking-widest text-arcade-yellow z-10 pointer-events-none"
          >
            CHECKPOINT SAVED
          </motion.div>

          {/* XP gain toast */}
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, -20, -35, -50], scale: [0.8, 1.2, 1, 0.9] }}
            transition={{ delay: index * 0.15 + 0.8, duration: 1.8 }}
            className="absolute -top-2 right-0 font-pixel text-[10px] text-arcade-yellow z-10 pointer-events-none"
            style={{
              textShadow: "0 0 8px rgba(255,211,78,0.6)",
            }}
          >
            {XP_VALUES[index % XP_VALUES.length]}
          </motion.div>
        </>
      )}

      {/* Timeline node */}
      <motion.div
        className="absolute top-1 left-0 flex h-6 w-6 items-center justify-center border-2 bg-arcade-bg"
        style={{ borderColor: exp.color }}
        animate={inView ? { boxShadow: `0 0 16px ${exp.color}66` } : {}}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
      >
        <Briefcase size={10} style={{ color: exp.color }} />
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 border-2"
          style={{ borderColor: exp.color }}
          initial={{ scale: 1, opacity: 0 }}
          animate={inView ? { scale: [1, 1.8], opacity: [0.6, 0] } : {}}
          transition={{ delay: index * 0.15 + 0.3, duration: 1.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Content */}
      <div className="group border-2 border-arcade-border bg-arcade-card p-5 transition-all duration-300 hover:border-arcade-border-glow hover:shadow-[0_0_16px_rgba(255,211,78,0.06)]">
        {/* Header */}
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-pixel text-xs text-arcade-white md:text-[11px]">
              {exp.company}
            </h3>
            <p className="mt-1 font-mono text-xs text-arcade-muted">{exp.role}</p>
          </div>
          <span
            className="shrink-0 border px-2 py-0.5 font-pixel text-[8px] uppercase"
            style={{
              color: exp.color,
              borderColor: exp.color + "44",
              backgroundColor: exp.color + "11",
            }}
          >
            {exp.period}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 font-mono text-xs leading-relaxed text-arcade-muted/70">
          {exp.description}
        </p>

        {/* Achievements */}
        <ul className="mb-4 space-y-2">
          {exp.achievements.map((a, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-arcade-muted"
              initial={{ opacity: 0, x: -5 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.5 + i * 0.08 }}
            >
              <span className="mt-1.5 block h-1 w-1 shrink-0" style={{ backgroundColor: exp.color }} />
              {a}
            </motion.li>
          ))}
        </ul>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {exp.techStack.map((tech) => (
            <span
              key={tech}
              className="border border-arcade-border bg-arcade-bg px-1.5 py-0.5 font-mono text-[9px] text-arcade-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Total XP
  const totalXP = EXPERIENCE.length * 750;

  return (
    <section id="experience" className="section-padding px-6">
      <div className="mx-auto max-w-3xl" ref={ref}>
        <SectionHeading
          title="EXPERIENCE"
          subtitle="Work timeline — from cybersecurity operations to full-stack internships."
        />

        {/* Career Progress Bar */}
        <motion.div
          className="mb-8 border-2 border-arcade-border bg-arcade-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[8px] text-arcade-muted uppercase">Career Progress</span>
            <span className="font-pixel text-[8px] text-arcade-yellow">
              {EXPERIENCE.length} / {EXPERIENCE.length + 2} CHECKPOINTS
            </span>
          </div>
          <div className="h-2 w-full border border-arcade-border bg-arcade-bg">
            <motion.div
              className="h-full bg-gradient-to-r from-arcade-yellow to-arcade-blue"
              initial={{ width: 0 }}
              animate={inView ? { width: `${(EXPERIENCE.length / (EXPERIENCE.length + 2)) * 100}%` } : { width: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(to right, transparent, transparent 6px, rgba(0,0,0,0.2) 6px, rgba(0,0,0,0.2) 8px)`,
                }}
              />
            </motion.div>
          </div>
          <div className="mt-1.5 flex justify-between">
            <span className="font-mono text-[8px] text-arcade-muted">Total XP: {totalXP}</span>
            <span className="font-mono text-[8px] text-arcade-muted">Next level: Senior Engineer</span>
          </div>
        </motion.div>

        <div className="mt-8">
          {EXPERIENCE.map((exp, i) => (
            <TimelineItem key={exp.company} exp={exp} index={i} />
          ))}
        </div>

        <PixelDivider className="mt-12" />
      </div>
    </section>
  );
}
