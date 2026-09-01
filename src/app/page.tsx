"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { About } from "@/components/sections/About";
import { Experiments } from "@/components/sections/Experiments";
import { Contact } from "@/components/sections/Contact";
import { GrainOverlay } from "@/components/effects/GrainOverlay";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";

export default function Home() {
  return (
    <SmoothScrollProvider>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Grain + Vignette overlay */}
      <GrainOverlay />

      {/* Navigation */}
      <Navbar />

      {/* Cinematic sections */}
      <main>
        <Hero />
        <Manifesto />
        <SelectedWork />
        <About />
        <Experiments />
        <Contact />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
