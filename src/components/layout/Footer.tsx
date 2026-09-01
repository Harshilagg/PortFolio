"use client";

import { PERSONAL } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-line/20 px-6 py-8 md:px-12 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">
          &copy; {new Date().getFullYear()} {PERSONAL.name}
        </span>

        <div className="flex items-center gap-6">
          <a
            href={PERSONAL.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="↗"
            className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/40 transition-colors hover:text-muted"
          >
            GitHub
          </a>
          <a
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="↗"
            className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/40 transition-colors hover:text-muted"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${PERSONAL.email}`}
            data-cursor="↗"
            className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/40 transition-colors hover:text-muted"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
