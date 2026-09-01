"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating Document — AI/Documents concept
 * Abstract paper/scanner fragments with floating OCR-like geometry
 */
export function FloatingDocument({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  rotationSpeed = 0.003,
  pointerX = 0,
  pointerY = 0,
  scrollProgress = 0,
}) {
  const groupRef = useRef<THREE.Group>(null);
  const driftOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Idle rotation
    groupRef.current.rotation.y += rotationSpeed;
    groupRef.current.rotation.x = Math.sin(t * 0.5 + driftOffset) * 0.08;

    // Random drift
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.7 + driftOffset) * 0.15;
    groupRef.current.position.x =
      position[0] + Math.cos(t * 0.4 + driftOffset) * 0.08;

    // Pointer parallax
    groupRef.current.rotation.y += pointerX * 0.001;
    groupRef.current.rotation.x += pointerY * 0.001;

    // Scroll response
    groupRef.current.rotation.z = scrollProgress * 0.3;
    groupRef.current.position.z = position[2] + scrollProgress * 1.5;
  });

  const paperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d4cfc7"),
        roughness: 0.85,
        metalness: 0.05,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      }),
    []
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8a8580"),
        roughness: 0.6,
        metalness: 0.15,
      }),
    []
  );

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main document sheet */}
      <mesh material={paperMaterial} rotation={[0.1, 0, 0.05]}>
        <planeGeometry args={[1.2, 1.6, 1, 1]} />
      </mesh>

      {/* Floating sub-sheets (OCR fragments) */}
      <mesh material={paperMaterial} position={[0.5, 0.3, 0.2]} rotation={[0.15, -0.1, 0.12]}>
        <planeGeometry args={[0.6, 0.4, 1, 1]} />
      </mesh>
      <mesh material={paperMaterial} position={[-0.4, -0.5, 0.15]} rotation={[-0.1, 0.2, -0.08]}>
        <planeGeometry args={[0.5, 0.35, 1, 1]} />
      </mesh>

      {/* Scan line bars (abstract OCR representation) */}
      {[0.4, 0.15, -0.1, -0.35].map((y, i) => (
        <mesh
          key={i}
          material={edgeMaterial}
          position={[0, y, 0.01]}
        >
          <boxGeometry args={[0.8 - i * 0.08, 0.02, 0.005]} />
        </mesh>
      ))}

      {/* Corner fold */}
      <mesh material={edgeMaterial} position={[0.55, 0.75, 0.03]} rotation={[0, 0, -0.7]}>
        <planeGeometry args={[0.2, 0.2, 1, 1]} />
      </mesh>
    </group>
  );
}
