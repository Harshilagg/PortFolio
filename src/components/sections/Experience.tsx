"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EXPERIENCE } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Divider } from "@/components/shared/Divider";
import { Briefcase } from "lucide-react";

function TimelineItem({ exp, index }: { exp: (typeof EXPERIENCE)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-10 pb-12 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Timeline line */}
      <div className="absolute top-1 left-[15px] h-full w-px bg-line" />

      {/* Timeline node */}
      <motion.div
        className="absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border bg-canvas"
        style={{ borderColor: exp.color }}
        animate={inView ? { boxShadow: `0 0 16px ${exp.color}44` } : {}}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
      >
        <Briefcase size={13} style={{ color: exp.color }} />
      </motion.div>

      {/* Content */}
      <div className="panel panel-hover p-5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-head text-sm font-semibold text-ink">{exp.company}</h3>
            <p className="mt-1 text-[13px] text-muted">{exp.role}</p>
          </div>
          <span
            className="shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
            style={{
              color: exp.color,
              borderColor: exp.color + "44",
              backgroundColor: exp.color + "11",
            }}
          >
            {exp.period}
          </span>
        </div>

        <p className="mb-4 text-[13px] leading-relaxed text-muted/80">{exp.description}</p>

        <ul className="mb-4 space-y-2">
          {exp.achievements.map((a, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted"
              initial={{ opacity: 0, x: -5 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.5 + i * 0.08 }}
            >
              <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: exp.color }} />
              {a}
            </motion.li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {exp.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-muted"
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
  return (
    <section id="experience" className="section-padding px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Career"
          title="Where I've worked"
          subtitle="From cybersecurity operations to full-stack internships."
        />

        <div className="mt-4">
          {EXPERIENCE.map((exp, i) => (
            <TimelineItem key={exp.company} exp={exp} index={i} />
          ))}
        </div>

        <Divider className="mt-12" />
      </div>
    </section>
  );
}
