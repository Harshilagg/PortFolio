"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SKILLS } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Divider } from "@/components/shared/Divider";
import { cn } from "@/lib/utils";

export function Skills() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding px-6" ref={sectionRef}>
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Toolbox"
          title="Skills & technologies"
          subtitle="Technical range across the stack — select a category to explore."
        />

        {/* Category tabs */}
        <motion.div
          className="mb-8 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {SKILLS.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActive(i)}
              data-interactive
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200",
                active === i
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line bg-card text-muted hover:border-line-strong hover:text-ink"
              )}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="panel p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="text-lg">{SKILLS[active].icon}</span>
              <h3 className="font-head text-sm font-semibold" style={{ color: SKILLS[active].color }}>
                {SKILLS[active].name}
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {SKILLS[active].skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <ProgressBar label={skill.name} value={skill.level} color={SKILLS[active].color} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Divider className="mt-12" />
      </div>
    </section>
  );
}
