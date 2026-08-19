"use client";

import { motion } from "framer-motion";
import { Mail, Download, ChevronDown } from "lucide-react";
import { PERSONAL } from "@/lib/data";
import { GlitchText } from "@/components/shared/GlitchText";
import { TypewriterText } from "@/components/shared/TypewriterText";
import { PixelDivider } from "@/components/shared/PixelDivider";
import { PlayerCard } from "@/components/shared/PlayerCard";
import { DashboardWidgets } from "./DashboardWidgets";
import { FeaturedProjectsRow } from "./FeaturedProjectsRow";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-12"
    >
      <motion.div
        className="mx-auto w-full max-w-5xl"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Intro */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
            {/* Top label */}
            <motion.div variants={fadeUp} className="mb-6">
              <span className="font-pixel text-[10px] tracking-[0.3em] text-arcade-yellow uppercase">
                Player 01 · Portfolio
              </span>
            </motion.div>

            {/* Name */}
            <motion.div variants={fadeUp} className="mb-4">
              <h1 className="font-pixel text-2xl leading-tight text-arcade-white sm:text-3xl md:text-4xl lg:text-5xl">
                <GlitchText text={PERSONAL.name} speed={35} />
              </h1>
            </motion.div>

            {/* Typewriter subtitle */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="font-mono text-sm text-arcade-muted md:text-base">
                <TypewriterText strings={[...PERSONAL.roles]} speed={60} pauseTime={2500} />
              </div>
            </motion.div>

            {/* Role Badges */}
            <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2">
              <span className="border-2 border-arcade-border bg-arcade-surface px-2 py-1 font-pixel text-[8px] text-arcade-muted uppercase">{"</>"} FULL STACK</span>
              <span className="border-2 border-arcade-border bg-arcade-surface px-2 py-1 font-pixel text-[8px] text-arcade-muted uppercase">🤖 AI BUILDER</span>
              <span className="border-2 border-arcade-border bg-arcade-surface px-2 py-1 font-pixel text-[8px] text-arcade-muted uppercase">🔒 CYBERSECURITY</span>
              <span className="border-2 border-arcade-border bg-arcade-surface px-2 py-1 font-pixel text-[8px] text-arcade-muted uppercase">🏆 COMPETITIVE PROGRAMMER</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={fadeUp}
              className="mb-8 max-w-xl font-mono text-sm leading-relaxed text-arcade-muted/80"
            >
              {PERSONAL.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="btn-pixel group inline-flex items-center gap-2 border-2 border-arcade-yellow bg-arcade-yellow/10 px-5 py-2.5 font-pixel text-[10px] text-arcade-yellow uppercase transition-colors hover:bg-arcade-yellow/20"
              >
                Start Game
                <ChevronDown size={12} className="transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href={`mailto:${PERSONAL.email}`}
                className="btn-pixel inline-flex items-center gap-2 border-2 border-arcade-border px-5 py-2.5 font-pixel text-[10px] text-arcade-white uppercase transition-colors hover:border-arcade-border-glow hover:bg-arcade-card"
              >
                Contact
                <Mail size={12} />
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" data-interactive className="text-arcade-muted transition-colors hover:text-arcade-yellow" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" data-interactive className="text-arcade-muted transition-colors hover:text-arcade-blue" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Player Card */}
          <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center lg:justify-end">
            <motion.div variants={fadeUp} className="w-full">
              <PlayerCard />
            </motion.div>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <DashboardWidgets />

        {/* Featured Projects Strip */}
        <FeaturedProjectsRow />

        {/* Pixel divider */}
        <PixelDivider className="mt-16" />

        {/* Scroll indicator */}
        <motion.div
          className="mt-4 flex justify-center"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-arcade-muted/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
