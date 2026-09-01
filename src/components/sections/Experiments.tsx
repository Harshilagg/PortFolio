"use client";

import { SKILLS, COMPETITIVE } from "@/lib/data";

export function Experiments() {
  return (
    <section className="relative px-6 py-32 md:px-12 md:py-40 lg:px-20">
      {/* Section label */}
      <div className="mb-16 flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Experiments & Explorations
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Competitive Programming — oversized metrics */}
      <div className="mb-24">
        <h2
          className="text-display text-ink-strong mb-12"
          style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
        >
          Competitive Programming
        </h2>

        <div className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4">
          {COMPETITIVE.map((profile) => (
            <div key={profile.platform} className="group">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                {profile.platform}
              </span>

              {profile.rating > 0 ? (
                <p
                  className="mt-2 font-serif text-ink-strong"
                  style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1 }}
                >
                  {profile.rating}
                </p>
              ) : (
                <p
                  className="mt-2 font-serif text-ink-strong"
                  style={{ fontSize: "clamp(24px, 3vw, 40px)", lineHeight: 1.1 }}
                >
                  {profile.rank}
                </p>
              )}

              <p className="mt-2 text-xs text-muted/60">
                {profile.achievement}
              </p>

              {profile.url && (
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="↗"
                  className="mt-3 inline-block font-mono text-[9px] uppercase tracking-[0.15em] text-muted/40 transition-colors hover:text-ink"
                >
                  Profile →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Capabilities — editorial list */}
      <div>
        <h2
          className="text-display text-ink-strong mb-12"
          style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
        >
          Technical Fluency
        </h2>

        <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((category) => (
            <div
              key={category.name}
              className="border-t border-line/30 py-6 pr-8"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
                {category.name}
              </span>

              <div className="mt-3 space-y-1">
                {category.skills.map((skill) => (
                  <p
                    key={skill}
                    className="text-sm text-muted/70 transition-colors hover:text-ink"
                  >
                    {skill}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
