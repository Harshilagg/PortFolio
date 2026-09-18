"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — imperative scene builder, ported from the standalone prototype
import { buildRoom } from "./roomScene.js";

type Room = {
  group: THREE.Group;
  fog: THREE.Fog;
  hits: THREE.Object3D[];
  foreground: THREE.Group;
  update: (dt: number) => void;
  setOutlineResolution: (w: number, h: number) => void;
  camera: { position: [number, number, number]; target: [number, number, number]; fov: number };
};

/** Where each clickable object in the room takes you. */
const ROUTES: Record<string, string> = {
  work: "#work",
  about: "#about",
  experience: "#about",
  contact: "#contact",
};

function RoomContents({ night, onPick }: { night: boolean; onPick: (t: string) => void }) {
  const room = useMemo(() => buildRoom({ night }) as Room, [night]);
  const { scene, camera, size, gl } = useThree();
  const hovered = useRef<THREE.Object3D | null>(null);

  // The builder hands back plain three objects; attach them once.
  useEffect(() => {
    scene.add(room.group);
    scene.fog = room.fog;
    // the near leaves ride the camera so they frame the corners from any angle
    camera.add(room.foreground);
    scene.add(camera);
    return () => {
      scene.remove(room.group);
      camera.remove(room.foreground);
      scene.fog = null;
    };
  }, [room, scene, camera]);

  // Outlines are a constant pixel width, so they need the drawing-buffer size.
  useEffect(() => {
    room.setOutlineResolution(size.width, size.height);
  }, [room, size.width, size.height]);

  // Flat illustration: no film curve, or the warm surfaces bleach out.
  useEffect(() => {
    gl.toneMapping = THREE.NoToneMapping;
  }, [gl]);

  useFrame((_, delta) => room.update(Math.min(delta, 0.05)));

  const resolve = (o: THREE.Object3D | null): THREE.Object3D | null => {
    let n: THREE.Object3D | null = o;
    while (n && !n.userData.hit) n = n.parent;
    return n && n.userData.hit ? n : null;
  };

  const lift = (g: THREE.Object3D | null, up: boolean) => {
    if (!g) return;
    if (g.userData.baseY === undefined) g.userData.baseY = g.position.y;
    g.position.y = g.userData.baseY + (up ? 0.045 : 0);
  };

  return (
    <group
      onPointerMove={(e) => {
        const g = resolve(e.object);
        if (g === hovered.current) return;
        lift(hovered.current, false);
        hovered.current = g;
        lift(g, true);
        document.body.style.cursor = g ? "pointer" : "";
      }}
      onPointerOut={() => {
        lift(hovered.current, false);
        hovered.current = null;
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        const g = resolve(e.object);
        if (g) onPick(String(g.userData.hit));
      }}
    >
      {room.hits.map((h, i) => (
        <primitive key={i} object={h} />
      ))}
    </group>
  );
}

export function RoomScene({ night = true }: { night?: boolean }) {
  const onPick = (tag: string) => {
    const href = ROUTES[tag];
    if (!href) return;
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0.35, 1.86, 3.55], fov: 50, near: 0.1, far: 200 }}
      style={{ background: "transparent" }}
    >
      <RoomContents night={night} onPick={onPick} />
      <OrbitControls
        target={[0.1, 1.08, -2.4]}
        enablePan={false}
        enableZoom={false}
        // the fourth wall is open — that is where the viewer stands, so the
        // camera is not allowed to swing round behind it
        minAzimuthAngle={-0.62}
        maxAzimuthAngle={0.62}
        minPolarAngle={1.15}
        maxPolarAngle={1.62}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.42}
      />
    </Canvas>
  );
}
