"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Layered System — Full Stack concept
 * Stacked transparent/semi-transparent planes representing system layers
 */
export function LayeredSystem({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  rotationSpeed = 0.004,
  pointerX = 0,
  pointerY = 0,
  scrollProgress = 0,
}) {
  const groupRef = useRef<THREE.Group>(null);
  const layerRefs = useRef<THREE.Mesh[]>([]);
  const driftOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  const layers = useMemo(
    () => [
      { y: 0.6, size: [1.4, 0.04, 1.0], color: "#e8e4de", opacity: 0.3, speed: 1.2 },
      { y: 0.3, size: [1.2, 0.04, 0.9], color: "#c8b8a0", opacity: 0.4, speed: 0.9 },
      { y: 0.0, size: [1.3, 0.05, 0.95], color: "#8a8580", opacity: 0.5, speed: 1.0 },
      { y: -0.3, size: [1.1, 0.04, 0.85], color: "#6b6560", opacity: 0.45, speed: 0.7 },
      { y: -0.6, size: [1.4, 0.04, 1.0], color: "#3a3a3a", opacity: 0.6, speed: 1.1 },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Idle rotation
    groupRef.current.rotation.y += rotationSpeed;
    groupRef.current.rotation.x = Math.sin(t * 0.4 + driftOffset) * 0.05;

    // Random drift
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.6 + driftOffset) * 0.1;
    groupRef.current.position.x =
      position[0] + Math.cos(t * 0.35 + driftOffset) * 0.07;

    // Pointer parallax
    groupRef.current.rotation.y += pointerX * 0.0006;
    groupRef.current.rotation.x += pointerY * 0.0006;

    // Per-layer micro-animation
    layerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const layer = layers[i];
      mesh.position.y = layer.y + Math.sin(t * layer.speed + i) * 0.04;
      mesh.rotation.y = Math.sin(t * 0.3 + i * 1.2) * 0.05;
    });

    // Scroll response — layers spread apart
    const spread = scrollProgress * 0.4;
    layerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const baseY = layers[i].y;
      mesh.position.y = baseY + (baseY > 0 ? spread : -spread) + Math.sin(t * layers[i].speed + i) * 0.04;
    });

    groupRef.current.position.z = position[2] + scrollProgress * 1.8;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {layers.map((layer, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) layerRefs.current[i] = el;
          }}
          position={[0, layer.y, 0]}
        >
          <boxGeometry args={layer.size as [number, number, number]} />
          <meshStandardMaterial
            color={new THREE.Color(layer.color)}
            transparent
            opacity={layer.opacity}
            roughness={0.6}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Connecting wires between layers */}
      {[[-0.4, 0], [0.4, 0], [0, -0.3], [0, 0.3]].map(([x, z], i) => (
        <mesh key={`wire-${i}`} position={[x, 0, z]}>
          <cylinderGeometry args={[0.008, 0.008, 1.3, 4]} />
          <meshStandardMaterial
            color={new THREE.Color("#c8b8a0")}
            transparent
            opacity={0.3}
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
