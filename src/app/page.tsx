"use client";

import { useState } from "react";
import { WorldBackground } from "@/components/background/WorldBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { CompetitiveProgramming } from "@/components/sections/CompetitiveProgramming";
import { Contact } from "@/components/sections/Contact";
import { Terminal } from "@/components/interactive/Terminal";
import { KonamiCode } from "@/components/interactive/KonamiCode";
import { BootSequence } from "@/components/interactive/BootSequence";
import { AskAIButton } from "@/components/interactive/AskAIButton";
import { AchievementProvider } from "@/components/interactive/AchievementToast";

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <AchievementProvider>
      {/* Boot sequence (first visit only) */}
      <BootSequence />

      {/* Background layers */}
      <WorldBackground />

      {/* Navigation */}
      <Navbar onTerminalToggle={() => setTerminalOpen((v) => !v)} />

      {/* Main content */}
      <main className="relative z-10 pb-8">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <CompetitiveProgramming />
        <Contact />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Interactive overlays */}
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <KonamiCode />
      <AskAIButton onTerminalToggle={() => setTerminalOpen((v) => !v)} />
    </AchievementProvider>
  );
}
