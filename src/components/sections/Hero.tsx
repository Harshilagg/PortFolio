"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { PERSONAL, PROJECTS, EXPERIENCE, COMPETITIVE } from "@/lib/data";
import { RevealText } from "@/components/shared/RevealText";
import { TypewriterText } from "@/components/shared/TypewriterText";
import { Divider } from "@/components/shared/Divider";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";
import { HeroVisual } from "./HeroVisual";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const STATS = [
  { label: "Codeforces rating", value: `${COMPETITIVE[0].rating}` },
  { label: "Projects shipped", value: `${PROJECTS.length}+` },
  { label: "Alma mater", value: "IIT Kharagpur" },
  { label: "Internships", value: `${EXPERIENCE.filter((e) => e.type === "intern").length}` },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16"
    >
      <motion.div
        className="mx-auto w-full max-w-6xl"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-7">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {PERSONAL.status}
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-5">
              <RevealText
                as="h1"
                text={PERSONAL.name}
                className="font-head text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
              />
              <h2 className="mt-3 font-head text-2xl font-medium leading-tight text-muted sm:text-3xl">
                <span className="text-ink">Cybersecurity Engineer</span> &amp;{" "}
                <span className="text-accent">Full Stack Developer</span>
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-8 max-w-xl font-mono text-sm leading-relaxed text-muted">
              <TypewriterText strings={[...PERSONAL.roles]} speed={55} pauseTime={2200} />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mb-9 max-w-lg text-[15px] leading-relaxed text-muted"
            >
              {PERSONAL.bio}
            </motion.p>

            <motion.div variants={fadeUp} className="mb-9 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                data-interactive
                className="btn-press group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(108,99,255,0.6)] transition-opacity hover:opacity-90"
              >
                View work
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={`mailto:${PERSONAL.email}`}
                data-interactive
                className="btn-press inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-surface"
              >
                Get in touch
                <Mail size={14} />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-5">
              <a
                href={PERSONAL.github}
                target="_blank"
                rel="noopener noreferrer"
                data-interactive
                className="text-muted transition-colors hover:text-ink"
                aria-label="GitHub"
              >
                <GithubIcon size={19} />
              </a>
              <a
                href={PERSONAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-interactive
                className="text-muted transition-colors hover:text-ink"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={19} />
              </a>
            </motion.div>
          </div>

          {/* Right column — visual */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <HeroVisual />
          </div>
        </div>

        {/* Stat tiles */}
        <motion.div
          variants={fadeUp}
          className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="panel px-4 py-4">
              <p className="font-head text-xl font-semibold text-ink sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <Divider className="mt-16" />
      </motion.div>
    </section>
  );
}
