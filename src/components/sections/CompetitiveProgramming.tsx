"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { COMPETITIVE } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Divider } from "@/components/shared/Divider";
import { Trophy } from "lucide-react";

function AnimatedCounter({ value, inView }: { value: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || value === 0) return;
    let start = 0;
    const duration = 1500;
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

  return <span>{value === 0 ? "—" : count.toLocaleString()}</span>;
}

function CPCard({ profile, index }: { profile: (typeof COMPETITIVE)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group panel panel-hover p-5 hover:-translate-y-1"
    >
      {/* Platform header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-head text-[13px] font-semibold text-ink">
          {profile.platform}
        </h3>
        <Trophy size={14} style={{ color: profile.color }} />
      </div>

      {/* Rating */}
      {profile.rating > 0 && (
        <div className="mb-2 font-head text-2xl font-semibold" style={{ color: profile.color }}>
          <AnimatedCounter value={profile.rating} inView={inView} />
        </div>
      )}

      {/* Rank */}
      <div className="mb-3">
        <span
          className="inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
          style={{
            color: profile.color,
            borderColor: profile.color + "44",
            backgroundColor: profile.color + "11",
          }}
        >
          {profile.rank}
        </span>
      </div>

      {/* Achievement */}
      <p className="font-mono text-[11px] leading-relaxed text-muted">
        {profile.achievement}
      </p>

      {/* Link */}
      {profile.url && (
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-mono text-[10px] transition-colors hover:text-accent"
          style={{ color: profile.color }}
        >
          View Profile →
        </a>
      )}
    </motion.div>
  );
}

export function CompetitiveProgramming() {
  return (
    <section id="competitive" className="section-padding px-6">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Competitive programming"
          title="Ranked profiles"
          subtitle="Where I stack up on competitive platforms."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPETITIVE.map((profile, i) => (
            <CPCard key={profile.platform} profile={profile} index={i} />
          ))}
        </div>

        <Divider className="mt-12" />
      </div>
    </section>
  );
}
