"use client";

import { SceneCanvas } from "@/three/SceneCanvas";
import { FloatingDocument } from "@/three/objects/FloatingDocument";
import { MechanicalLock } from "@/three/objects/MechanicalLock";
import { LayeredSystem } from "@/three/objects/LayeredSystem";

interface HeroSceneProps {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
}

export function HeroScene({ pointerX, pointerY, scrollProgress }: HeroSceneProps) {
  return (
    <SceneCanvas className="h-full w-full">
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#e8e4de" />
      <directionalLight position={[-3, 2, -3]} intensity={0.2} color="#c8b8a0" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#e8e4de" />

      {/* Objects at different depths */}
      <FloatingDocument
        position={[-2.5, 0.8, -1]}
        scale={0.7}
        rotationSpeed={0.003}
        pointerX={pointerX}
        pointerY={pointerY}
        scrollProgress={scrollProgress}
      />

      <MechanicalLock
        position={[2.8, -0.3, -0.5]}
        scale={0.6}
        rotationSpeed={0.002}
        pointerX={pointerX}
        pointerY={pointerY}
        scrollProgress={scrollProgress}
      />

      <LayeredSystem
        position={[0.5, -1.2, -2]}
        scale={0.5}
        rotationSpeed={0.004}
        pointerX={pointerX}
        pointerY={pointerY}
        scrollProgress={scrollProgress}
      />
    </SceneCanvas>
  );
}
