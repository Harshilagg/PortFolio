"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PixelBorder } from "@/components/shared/PixelBorder";
import { PixelDivider } from "@/components/shared/PixelDivider";
import { PERSONAL } from "@/lib/data";

const STATS = [
  {
    icon: "🧠",
    label: "Intelligence",
    value: 92,
    color: "#5AC8FA",
    description: "Algorithm Optimization & System Design",
    subSkills: ["Data Structures", "System Architecture", "Problem Solving"],
  },
  {
    icon: "⚡",
    label: "Agility",
    value: 85,
    color: "#FFD34E",
    description: "Rapid Prototyping & Sprint Execution",
    subSkills: ["Fast Learner", "Agile Methodology", "Iteration Speed"],
  },
  {
    icon: "🛡️",
    label: "Defense",
    value: 88,
    color: "#FF6B6B",
    description: "Cybersecurity & Penetration Testing",
    subSkills: ["Network Security", "OWASP Top 10", "Ethical Hacking"],
  },
  {
    icon: "🔮",
    label: "Wisdom",
    value: 80,
    color: "#C084FC",
    description: "AI/ML Knowledge & Strategic Thinking",
    subSkills: ["LLM APIs", "RAG Pipelines", "Model Context Protocol"],
  },
];

function StatBar({
  stat,
  index,
  inView,
}: {
  stat: (typeof STATS)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.12, duration: 0.5 }}
    >
      <PixelBorder
        hover={true}
        className="group flex flex-col gap-3 bg-arcade-card p-4 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center border-2 border-arcade-border bg-arcade-surface text-xl"
            animate={inView ? {
              boxShadow: [
                `0 0 0px ${stat.color}00`,
                `0 0 12px ${stat.color}44`,
                `0 0 4px ${stat.color}22`,
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          >
            {stat.icon}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-pixel text-[10px] text-arcade-white uppercase">
                {stat.label}
              </h4>
              <motion.span
                className="font-pixel text-xs"
                style={{ color: stat.color }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.12 }}
              >
                {stat.value}
              </motion.span>
            </div>
            {/* Stat bar */}
            <div className="h-2 w-full border border-arcade-border bg-arcade-bg">
              <motion.div
                className="h-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${stat.value}%` } : { width: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 + index * 0.1 }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `repeating-linear-gradient(to right, transparent, transparent 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 5px)`,
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="font-mono text-[10px] text-arcade-muted leading-relaxed">
          {stat.description}
        </p>

        {/* Sub-skills (reveal on hover) */}
        <div className="flex flex-wrap gap-1 max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-20 group-hover:mt-1">
          {stat.subSkills.map((sub) => (
            <span
              key={sub}
              className="border px-1.5 py-0.5 font-mono text-[8px] uppercase"
              style={{
                borderColor: stat.color + "33",
                color: stat.color,
                backgroundColor: stat.color + "08",
              }}
            >
              {sub}
            </span>
          ))}
        </div>
      </PixelBorder>
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
          title="ABOUT PLAYER"
          subtitle="Character backstory and core attributes."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {/* Backstory */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <PixelBorder className="h-full bg-arcade-card p-6">
              <h3 className="mb-4 font-pixel text-[10px] text-arcade-yellow uppercase">Lore</h3>
              <p className="font-mono text-sm leading-relaxed text-arcade-muted">
                I am a Computer Science & Engineering student at {PERSONAL.education.institute}, driven by a passion for building scalable systems and participating in competitive programming.
              </p>
              <p className="mt-4 font-mono text-sm leading-relaxed text-arcade-muted">
                {PERSONAL.bio}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border border-arcade-border px-2 py-1 font-pixel text-[8px] text-arcade-muted uppercase">IIT Kharagpur</span>
                <span className="border border-arcade-border px-2 py-1 font-pixel text-[8px] text-arcade-muted uppercase">CSE</span>
                <span className="border border-arcade-border px-2 py-1 font-pixel text-[8px] text-arcade-muted uppercase">CGPA: {PERSONAL.education.cgpa}</span>
              </div>

              {/* Achievements mini-section */}
              <div className="mt-6 pt-4 border-t border-arcade-border">
                <h4 className="mb-3 font-pixel text-[8px] text-arcade-blue uppercase tracking-wider">
                  Achievements Unlocked
                </h4>
                <div className="space-y-2">
                  {[
                    { text: "JEE Advanced — AIR 6339 (Top 2.25%)", icon: "🏆" },
                    { text: "KVPY Fellow — AIR 3531", icon: "🎖️" },
                    { text: "Meta Hacker Cup 2024 — Round 1", icon: "⚔️" },
                  ].map((achievement, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 font-mono text-[10px] text-arcade-muted"
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
            </PixelBorder>
          </motion.div>

          {/* Core Stats — RPG style */}
          <div className="grid gap-3 content-start">
            {STATS.map((stat, i) => (
              <StatBar key={stat.label} stat={stat} index={i} inView={inView} />
            ))}
          </div>
        </div>

        <PixelDivider className="mt-16" />
      </div>
    </section>
  );
}
