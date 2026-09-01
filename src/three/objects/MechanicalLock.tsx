"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Mechanical Lock — Security concept
 * Abstract lock mechanism with rotating tumblers and a keyhole
 */
export function MechanicalLock({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  rotationSpeed = 0.002,
  pointerX = 0,
  pointerY = 0,
  scrollProgress = 0,
}) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const driftOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Idle rotation — slow and deliberate
    groupRef.current.rotation.y += rotationSpeed;
    groupRef.current.rotation.x = Math.sin(t * 0.3 + driftOffset) * 0.06;

    // Random drift
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.5 + driftOffset) * 0.12;
    groupRef.current.position.x =
      position[0] + Math.cos(t * 0.3 + driftOffset) * 0.06;

    // Pointer parallax
    groupRef.current.rotation.y += pointerX * 0.0008;
    groupRef.current.rotation.x += pointerY * 0.0008;

    // Inner ring counter-rotation
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * 0.8;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.3;
    }

    // Scroll response
    groupRef.current.rotation.z = scrollProgress * 0.5;
    groupRef.current.position.z = position[2] + scrollProgress * 2;
  });

  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#3a3a3a"),
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  const darkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a1a"),
        roughness: 0.5,
        metalness: 0.6,
      }),
    []
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c8b8a0"),
        roughness: 0.4,
        metalness: 0.7,
        emissive: new THREE.Color("#c8b8a0"),
        emissiveIntensity: 0.1,
      }),
    []
  );

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Outer body — hexagonal cylinder */}
      <mesh material={metalMaterial}>
        <cylinderGeometry args={[0.8, 0.8, 0.3, 6]} />
      </mesh>

      {/* Outer rotating ring */}
      <mesh ref={outerRingRef} material={darkMaterial} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 8, 32]} />
      </mesh>

      {/* Inner rotating ring */}
      <mesh ref={innerRingRef} material={accentMaterial} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.03, 8, 24]} />
      </mesh>

      {/* Keyhole — vertical slit + circle */}
      <mesh material={darkMaterial} position={[0, 0.05, 0.16]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
      </mesh>
      <mesh material={darkMaterial} position={[0, -0.1, 0.16]}>
        <boxGeometry args={[0.06, 0.22, 0.05]} />
      </mesh>

      {/* Tumbler pins (visible through the body) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            material={accentMaterial}
            position={[
              Math.cos(angle) * 0.45,
              Math.sin(angle) * 0.45,
              0,
            ]}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          </mesh>
        );
      })}
    </group>
  );
}
