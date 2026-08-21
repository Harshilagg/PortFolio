"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Panel } from "@/components/shared/Panel";
import { Divider } from "@/components/shared/Divider";
import { PERSONAL } from "@/lib/data";

const STRENGTHS = [
  {
    icon: "🧠",
    label: "Systems & Architecture",
    value: 92,
    color: "#5AC8FA",
    description: "Algorithm optimization & scalable system design",
    subSkills: ["Data Structures", "System Architecture", "Problem Solving"],
  },
  {
    icon: "⚡",
    label: "Execution Speed",
    value: 85,
    color: "#6C63FF",
    description: "Rapid prototyping & sprint execution",
    subSkills: ["Fast Learner", "Agile Methodology", "Iteration Speed"],
  },
  {
    icon: "🛡️",
    label: "Security Mindset",
    value: 88,
    color: "#FF6B6B",
    description: "Cybersecurity & penetration testing",
    subSkills: ["Network Security", "OWASP Top 10", "Ethical Hacking"],
  },
  {
    icon: "🔮",
    label: "AI / ML Craft",
    value: 80,
    color: "#C084FC",
    description: "LLM applications & strategic modeling",
    subSkills: ["LLM APIs", "RAG Pipelines", "Model Context Protocol"],
  },
];

function StrengthBar({
  stat,
  index,
  inView,
}: {
  stat: (typeof STRENGTHS)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.12, duration: 0.5 }}
    >
      <Panel className="group flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-lg">
            {stat.icon}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h4 className="font-head text-[13px] font-medium text-ink">{stat.label}</h4>
              <span className="font-mono text-xs" style={{ color: stat.color }}>
                {stat.value}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${stat.value}%` } : { width: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 + index * 0.1 }}
              />
            </div>
          </div>
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-muted">{stat.description}</p>

        <div className="flex flex-wrap gap-1 max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-20 group-hover:mt-1">
          {stat.subSkills.map((sub) => (
            <span
              key={sub}
              className="rounded-full border px-2 py-0.5 font-mono text-[10px]"
              style={{
                borderColor: stat.color + "33",
                color: stat.color,
                backgroundColor: stat.color + "0d",
              }}
            >
              {sub}
            </span>
          ))}
        </div>
      </Panel>
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="about" className="section-padding px-6">
      <div className="mx-auto max-w-5xl" ref={ref}>
        <SectionHeading
          eyebrow="About"
          title="A little about me"
          subtitle="Background, focus areas, and what drives the way I build."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Panel className="h-full p-6">
              <h3 className="mb-4 font-head text-sm font-semibold text-accent">Background</h3>
              <p className="text-sm leading-relaxed text-muted">
                I am a Computer Science &amp; Engineering student at {PERSONAL.education.institute}, driven by a passion for building scalable systems and participating in competitive programming.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{PERSONAL.bio}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                  {PERSONAL.education.institute}
                </span>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                  CSE
                </span>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                  CGPA {PERSONAL.education.cgpa}
                </span>
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <h4 className="mb-3 font-head text-xs font-semibold text-azure">Highlights</h4>
                <div className="space-y-2.5">
                  {[
                    { text: "JEE Advanced — AIR 6339 (Top 2.25%)", icon: "🏆" },
                    { text: "KVPY Fellow — AIR 3531", icon: "🎖️" },
                    { text: "Meta Hacker Cup 2024 — Round 1", icon: "⚡" },
                  ].map((achievement, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2.5 text-[13px] text-muted"
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <span>{achievement.icon}</span>
                      <span>{achievement.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Panel>
          </motion.div>

          <div className="grid gap-3 content-start">
            {STRENGTHS.map((stat, i) => (
              <StrengthBar key={stat.label} stat={stat} index={i} inView={inView} />
            ))}
          </div>
        </div>

        <Divider className="mt-16" />
      </div>
    </section>
  );
}
