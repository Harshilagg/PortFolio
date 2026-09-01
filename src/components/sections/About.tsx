"use client";

import { PERSONAL, EXPERIENCE, ACHIEVEMENTS } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:px-12 md:py-40 lg:px-20">
      {/* Section label */}
      <div className="mb-16 flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          About
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Two column layout */}
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Left — Bio */}
        <div className="lg:col-span-5">
          <h2
            className="text-display text-ink-strong mb-8"
            style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
          >
            {PERSONAL.name}
          </h2>

          <p className="text-sm leading-[1.8] text-muted md:text-base">
            {PERSONAL.bio}
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/50 w-20">
                Degree
              </span>
              <span className="text-sm text-ink/80">
                {PERSONAL.education.degree}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/50 w-20">
                Institute
              </span>
              <span className="text-sm text-ink/80">
                {PERSONAL.education.institute}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/50 w-20">
                CGPA
              </span>
              <span className="text-sm text-ink/80">
                {PERSONAL.education.cgpa}
              </span>
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-12 border-t border-line pt-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
              Notable
            </span>
            <div className="mt-4 space-y-3">
              {ACHIEVEMENTS.slice(0, 4).map((a, i) => (
                <p key={i} className="text-xs leading-relaxed text-muted/70">
                  {a}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Experience Timeline */}
        <div className="lg:col-span-7">
          <div className="mb-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
              Experience
            </span>
          </div>

          <div className="space-y-0">
            {EXPERIENCE.map((exp, i) => (
              <div
                key={exp.company}
                className="group border-t border-line/40 py-8 transition-colors hover:border-line"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-editorial text-ink-strong text-lg md:text-xl">
                      {exp.company}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {exp.role}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted/50 md:text-right">
                    {exp.period}
                  </span>
                </div>

                {/* Achievements — reveal on hover */}
                <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-[300px] group-hover:opacity-100">
                  <p className="mb-3 text-xs leading-relaxed text-muted/60">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
