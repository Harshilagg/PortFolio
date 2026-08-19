"use client";

import { SkyLayer } from "./SkyLayer";
import { CelestialLayer } from "./CelestialLayer";
import { CloudLayer } from "./CloudLayer";
import { CityLayer } from "./CityLayer";
import { TreeLayer } from "./TreeLayer";
import { AmbientCreatures } from "./AmbientCreatures";
import { CRTOverlay } from "./CRTOverlay";
import { CursorParticles } from "./CursorParticles";
import { MouseGlow } from "./MouseGlow";

export function WorldBackground() {
  return (
    <>
      <SkyLayer />
      <CelestialLayer />
      <CloudLayer />
      <CityLayer />
      <TreeLayer />
      <AmbientCreatures />
      
      {/* Overlays */}
      <CRTOverlay />
      <MouseGlow />
      <CursorParticles />
    </>
  );
}
