"use client";

import { PERSONAL } from "@/lib/data";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-[12px] text-muted">
          © {new Date().getFullYear()} {PERSONAL.name}. Built with care.
        </p>

        <div className="flex items-center gap-5">
          <a
            href={PERSONAL.github}
            target="_blank"
            rel="noopener noreferrer"
            data-interactive
            className="text-muted transition-colors hover:text-ink"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-interactive
            className="text-muted transition-colors hover:text-ink"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={`mailto:${PERSONAL.email}`}
            data-interactive
            className="text-muted transition-colors hover:text-ink"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
