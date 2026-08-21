"use client";

import { motion, useInView } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";
import { PERSONAL } from "@/lib/data";
import { useState, useRef } from "react";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = PERSONAL.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="section-padding px-6">
      <div className="mx-auto max-w-2xl" ref={ref}>
        <motion.div
          className="panel p-10 text-center md:p-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Get in touch
          </p>
          <h2 className="mb-4 font-head text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Let&apos;s build something
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted">
            Have a project, role, or collaboration in mind? Send a note and I&apos;ll get back with a clear next step.
          </p>

          <div className="mb-9 flex flex-wrap justify-center gap-3">
            <motion.a
              href={`mailto:${PERSONAL.email}`}
              data-interactive
              className="btn-press inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(108,99,255,0.6)] transition-opacity hover:opacity-90"
              whileTap={{ scale: 0.97 }}
            >
              Email me
              <Mail size={14} />
            </motion.a>
            <motion.button
              onClick={copyEmail}
              data-interactive
              className="btn-press inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
              whileTap={{ scale: 0.97 }}
            >
              {copied ? "Copied!" : "Copy email"}
              {copied ? <Check size={14} className="text-[#4ade80]" /> : <Copy size={14} />}
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-6">
            {[
              {
                href: PERSONAL.github,
                label: "GitHub",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
              {
                href: PERSONAL.linkedin,
                label: "LinkedIn",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
              {
                href: "https://x.com",
                label: "Twitter",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-interactive
                className="text-muted transition-colors hover:text-ink"
                aria-label={social.label}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
