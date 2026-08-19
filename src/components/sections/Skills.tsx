"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SKILLS } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EXPBar } from "@/components/shared/EXPBar";
import { PixelDivider } from "@/components/shared/PixelDivider";
import { cn } from "@/lib/utils";

function AnimatedCounter({ value, inView }: { value: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || value === 0) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return <span>{count.toLocaleString()}</span>;
}

export function Skills() {
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Total skill points
  const totalPoints = SKILLS.reduce(
    (acc, cat) => acc + cat.skills.reduce((s, skill) => s + skill.level, 0),
    0
  );

  const handleTabSwitch = (i: number) => {
    setActive(i);
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  };

  return (
    <section id="skills" className="section-padding px-6" ref={sectionRef}>
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="SKILL INVENTORY"
          subtitle="Technical arsenal — click categories to inspect loadout."
        />

        {/* Total Skill Points counter */}
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="font-pixel text-[8px] text-arcade-muted uppercase tracking-wider">
            Total Skill Points:
          </span>
          <span className="font-pixel text-sm text-arcade-yellow">
            <AnimatedCounter value={totalPoints} inView={inView} />
          </span>
          <div className="flex-1 h-px bg-arcade-border" />
        </motion.div>

        {/* Category tabs (Inventory menu style) */}
        <div className="mb-8 flex flex-wrap gap-3">
          {SKILLS.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => handleTabSwitch(i)}
              className={cn(
                "group relative border-2 px-4 py-2 font-pixel text-[9px] uppercase tracking-wider transition-all duration-300",
                active === i
                  ? "border-arcade-yellow bg-arcade-yellow/10 text-arcade-yellow translate-x-1"
                  : "border-arcade-border bg-arcade-card text-arcade-muted hover:border-arcade-border-glow hover:text-arcade-white hover:translate-x-1"
              )}
            >
              {/* Active indicator pip */}
              <motion.div
                className={cn(
                  "absolute -left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2",
                  active === i ? "bg-arcade-yellow" : "bg-transparent group-hover:bg-arcade-border-glow"
                )}
                animate={active === i ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="mr-2 inline-block transition-transform group-hover:scale-110">{cat.icon}</span>
              {cat.name}

              {/* Skill count badge */}
              <span className={cn(
                "ml-2 font-mono text-[7px] px-1 py-0.5 border",
                active === i
                  ? "border-arcade-yellow/30 text-arcade-yellow"
                  : "border-arcade-border text-arcade-muted"
              )}>
                {cat.skills.length}
              </span>
            </button>
          ))}
        </div>

        {/* Tab switch flash effect */}
        <AnimatePresence>
          {flash && (
            <motion.div
              className="fixed inset-0 z-50 bg-arcade-yellow/5 pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-arcade-border bg-arcade-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{SKILLS[active].icon}</span>
                <h3 className="font-pixel text-xs uppercase" style={{ color: SKILLS[active].color }}>
                  {SKILLS[active].name}
                </h3>
              </div>
              <span className="font-pixel text-[8px] text-arcade-muted">
                AVG LEVEL: {Math.round(SKILLS[active].skills.reduce((a, s) => a + s.level, 0) / SKILLS[active].skills.length)}%
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SKILLS[active].skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <EXPBar
                    label={skill.name}
                    value={skill.level}
                    color={SKILLS[active].color}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <PixelDivider className="mt-12" />
      </div>
    </section>
  );
}
