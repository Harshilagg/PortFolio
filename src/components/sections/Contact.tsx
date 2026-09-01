"use client";

import { PERSONAL } from "@/lib/data";

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:px-12 md:py-40 lg:px-20">
      {/* Section label */}
      <div className="mb-16 flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Contact
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Massive headline */}
      <div className="mb-12">
        <h2
          className="text-display-italic text-ink-strong"
          style={{
            fontSize: "clamp(48px, 10vw, 160px)",
            lineHeight: 0.9,
          }}
        >
          Let&apos;s
        </h2>
        <h2
          className="text-display text-ink-strong"
          style={{
            fontSize: "clamp(48px, 10vw, 160px)",
            lineHeight: 0.9,
            marginLeft: "8vw",
          }}
        >
          Talk.
        </h2>
      </div>

      {/* Email as a large link */}
      <div className="mb-16">
        <a
          href={`mailto:${PERSONAL.email}`}
          data-cursor="↗"
          className="group inline-block border-b border-line pb-2 transition-colors hover:border-ink"
        >
          <span className="font-serif text-lg text-muted transition-colors group-hover:text-ink-strong md:text-2xl">
            {PERSONAL.email}
          </span>
        </a>
      </div>

      {/* Social + details */}
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
            Social
          </span>
          <div className="mt-4 space-y-2">
            <a
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="↗"
              className="block text-sm text-muted transition-colors hover:text-ink"
            >
              GitHub
            </a>
            <a
              href={PERSONAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="↗"
              className="block text-sm text-muted transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
            Location
          </span>
          <p className="mt-4 text-sm text-muted">
            {PERSONAL.location}
          </p>
        </div>

        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
            Status
          </span>
          <p className="mt-4 text-sm text-muted">
            {PERSONAL.status}
          </p>
        </div>
      </div>
    </section>
  );
}
