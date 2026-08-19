"use client";

import { motion, useInView } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";
import { PERSONAL } from "@/lib/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useState, useRef } from "react";

function CoinAnimation({ inView }: { inView: boolean }) {
  return (
    <div className="flex justify-center mb-6">
      <motion.div
        className="relative"
        initial={{ y: -30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Coin slot */}
        <div className="relative flex flex-col items-center">
          {/* Coin */}
          <motion.div
            className="w-6 h-6 rounded-full border-2 border-arcade-yellow bg-arcade-yellow/20 flex items-center justify-center mb-1"
            animate={inView ? {
              y: [0, 15, 15],
              opacity: [1, 1, 0],
              scale: [1, 0.8, 0.6],
            } : {}}
            transition={{ delay: 0.8, duration: 1, ease: "easeIn" }}
          >
            <span className="font-pixel text-[8px] text-arcade-yellow">$</span>
          </motion.div>

          {/* Slot */}
          <div className="w-10 h-1 bg-arcade-border rounded-full" />

          {/* Glow on insert */}
          <motion.div
            className="absolute top-4 w-10 h-4 bg-arcade-yellow/10 rounded-full blur-md"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0, 0.8, 0] } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}

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
      // Fallback
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
      <div className="mx-auto max-w-3xl" ref={ref}>
        <motion.div
          className="border-2 border-arcade-border bg-arcade-card p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            boxShadow:
              "0 0 0 1px rgba(255,211,78,0.05), 0 0 40px rgba(255,211,78,0.03)",
          }}
        >
          {/* Coin animation */}
          <CoinAnimation inView={inView} />

          <SectionHeading
            title="INSERT COIN TO CONTINUE"
            subtitle="Have a project, role, or collaboration in mind? Send a note and I'll get back with a clear next step."
          />

          {/* Continue prompt */}
          <motion.div
            className="mb-6 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-pixel text-[9px] text-arcade-yellow tracking-widest">
              ▸ PRESS START ◂
            </span>
          </motion.div>

          {/* Email CTA */}
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <motion.a
              href={`mailto:${PERSONAL.email}`}
              data-interactive
              className="btn-pixel inline-flex items-center gap-2 border-2 border-arcade-yellow bg-arcade-yellow/10 px-5 py-2.5 font-pixel text-[10px] text-arcade-yellow uppercase transition-colors hover:bg-arcade-yellow/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Email me
              <Mail size={12} />
            </motion.a>
            <motion.button
              onClick={copyEmail}
              data-interactive
              className="btn-pixel inline-flex items-center gap-2 border-2 border-arcade-border px-5 py-2.5 font-pixel text-[10px] text-arcade-muted uppercase transition-colors hover:border-arcade-border-glow hover:text-arcade-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {copied ? "Copied!" : "Copy email"}
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            </motion.button>
          </div>

          {/* Social links — enhanced with labels on hover */}
          <div className="flex items-center justify-center gap-6">
            {[
              {
                href: PERSONAL.github,
                label: "GitHub",
                hoverColor: "hover:text-arcade-yellow",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
              {
                href: PERSONAL.linkedin,
                label: "LinkedIn",
                hoverColor: "hover:text-arcade-blue",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
              {
                href: "https://x.com",
                label: "Twitter",
                hoverColor: "hover:text-arcade-white",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
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
                className={`group relative flex flex-col items-center gap-1 text-arcade-muted transition-colors ${social.hoverColor}`}
                aria-label={social.label}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {social.icon}
                <span className="font-pixel text-[6px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Bottom pixel accent */}
          <div className="mt-8 flex justify-center gap-1">
            {["#5AC8FA", "#FFD34E", "#FF6B6B", "#5AC8FA", "#FFD34E"].map((c, i) => (
              <motion.span
                key={i}
                className="block h-1.5 w-1.5"
                style={{ backgroundColor: c, opacity: 0.5 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
