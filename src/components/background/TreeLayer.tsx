"use client";

import { useTheme } from "@/providers/ThemeContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Tree = {
  x: number;
  size: number;
  variant: "oak" | "pine" | "bush" | "palm";
  sway: number;
};

/**
 * Pixel-art trees rendered as layered CSS shapes.
 * Appears in the foreground of the cityscape, in front of buildings.
 */
export function TreeLayer() {
  const { isDay } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    setMounted(true);

    const variants: Tree["variant"][] = ["oak", "pine", "bush", "palm"];
    const generated: Tree[] = [];

    // Scatter trees across the bottom of the screen
    for (let i = 0; i < 40; i++) {
      generated.push({
        x: Math.random() * 100,
        size: 1.5 + Math.random() * 2.0,
        variant: variants[Math.floor(Math.random() * variants.length)],
        sway: 4 + Math.random() * 5,
      });
    }

    // Sort by x position for visual consistency
    generated.sort((a, b) => a.x - b.x);
    setTrees(generated);
  }, []);

  if (!mounted) return null;

  const foliageColor = isDay ? "#2D6B2D" : "#162E16";
  const foliageLightColor = isDay ? "#4A9E4A" : "#264D26";
  const trunkColor = isDay ? "#5D4037" : "#3D2A1F";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[-4] h-[30vh] overflow-hidden">
      {trees.map((tree, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0"
          style={{
            left: `${tree.x}%`,
            transform: `scale(${tree.size})`,
            transformOrigin: "bottom center",
          }}
          animate={{
            rotate: [0, tree.sway * 0.15, 0, -tree.sway * 0.15, 0],
          }}
          transition={{
            duration: tree.sway,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {tree.variant === "oak" && (
            <OakTree
              foliage={foliageColor}
              foliageLight={foliageLightColor}
              trunk={trunkColor}
              isDay={isDay}
            />
          )}
          {tree.variant === "pine" && (
            <PineTree
              foliage={foliageColor}
              foliageLight={foliageLightColor}
              trunk={trunkColor}
              isDay={isDay}
            />
          )}
          {tree.variant === "bush" && (
            <Bush
              foliage={foliageColor}
              foliageLight={foliageLightColor}
              isDay={isDay}
            />
          )}
          {tree.variant === "palm" && (
            <PalmTree
              foliage={foliageColor}
              foliageLight={foliageLightColor}
              trunk={trunkColor}
              isDay={isDay}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Tree Variants (Pixel-art CSS shapes) ─────────────── */

function OakTree({ foliage, foliageLight, trunk, isDay }: {
  foliage: string; foliageLight: string; trunk: string; isDay: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Canopy - layered circles for pixel art feel */}
      <div className="relative" style={{ width: 28, height: 24 }}>
        {/* Back layer */}
        <div
          className="absolute rounded-sm transition-colors duration-1000"
          style={{
            width: 24,
            height: 16,
            backgroundColor: foliage,
            bottom: 0,
            left: 2,
            borderRadius: "4px 4px 2px 2px",
          }}
        />
        {/* Front layer */}
        <div
          className="absolute rounded-sm transition-colors duration-1000"
          style={{
            width: 20,
            height: 12,
            backgroundColor: foliageLight,
            bottom: 8,
            left: 4,
            borderRadius: "4px 4px 2px 2px",
          }}
        />
        {/* Top */}
        <div
          className="absolute transition-colors duration-1000"
          style={{
            width: 12,
            height: 8,
            backgroundColor: foliageLight,
            top: 0,
            left: 8,
            borderRadius: "3px 3px 0 0",
          }}
        />
        {/* Highlight pixels */}
        {isDay && (
          <>
            <div className="absolute" style={{ width: 2, height: 2, backgroundColor: "#6BC96B", top: 4, left: 12 }} />
            <div className="absolute" style={{ width: 2, height: 2, backgroundColor: "#6BC96B", top: 8, left: 8 }} />
          </>
        )}
      </div>
      {/* Trunk */}
      <div
        className="transition-colors duration-1000"
        style={{
          width: 6,
          height: 10,
          backgroundColor: trunk,
          borderRadius: "0 0 2px 2px",
        }}
      />
    </div>
  );
}

function PineTree({ foliage, foliageLight, trunk, isDay }: {
  foliage: string; foliageLight: string; trunk: string; isDay: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Layered triangles for pine tree */}
      <div className="relative flex flex-col items-center" style={{ width: 22 }}>
        {/* Top tier */}
        <div style={{
          width: 0, height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: `10px solid ${foliageLight}`,
        }} />
        {/* Middle tier */}
        <div style={{
          width: 0, height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: `10px solid ${foliage}`,
          marginTop: -4,
        }} />
        {/* Bottom tier */}
        <div style={{
          width: 0, height: 0,
          borderLeft: "11px solid transparent",
          borderRight: "11px solid transparent",
          borderBottom: `12px solid ${foliage}`,
          marginTop: -4,
        }} />
      </div>
      {/* Trunk */}
      <div
        className="transition-colors duration-1000"
        style={{
          width: 4,
          height: 8,
          backgroundColor: trunk,
        }}
      />
    </div>
  );
}

function Bush({ foliage, foliageLight, isDay }: {
  foliage: string; foliageLight: string; isDay: boolean;
}) {
  return (
    <div className="relative flex items-end">
      {/* Left mound */}
      <div
        className="transition-colors duration-1000"
        style={{
          width: 12,
          height: 8,
          backgroundColor: foliage,
          borderRadius: "6px 4px 0 0",
        }}
      />
      {/* Center mound (taller) */}
      <div
        className="transition-colors duration-1000"
        style={{
          width: 14,
          height: 12,
          backgroundColor: foliageLight,
          borderRadius: "6px 6px 0 0",
          marginLeft: -4,
        }}
      />
      {/* Right mound */}
      <div
        className="transition-colors duration-1000"
        style={{
          width: 10,
          height: 7,
          backgroundColor: foliage,
          borderRadius: "4px 6px 0 0",
          marginLeft: -3,
        }}
      />
      {/* Highlight */}
      {isDay && (
        <div className="absolute" style={{
          width: 3, height: 2,
          backgroundColor: "#6BC96B",
          top: 2, left: 12,
          borderRadius: 1,
        }} />
      )}
    </div>
  );
}

function PalmTree({ foliage, foliageLight, trunk, isDay }: {
  foliage: string; foliageLight: string; trunk: string; isDay: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Fronds */}
      <div className="relative" style={{ width: 30, height: 14 }}>
        {/* Left frond */}
        <div
          className="absolute transition-colors duration-1000"
          style={{
            width: 14,
            height: 4,
            backgroundColor: foliage,
            top: 6,
            left: 0,
            borderRadius: "4px 0 0 4px",
            transform: "rotate(-15deg)",
          }}
        />
        {/* Right frond */}
        <div
          className="absolute transition-colors duration-1000"
          style={{
            width: 14,
            height: 4,
            backgroundColor: foliage,
            top: 6,
            right: 0,
            borderRadius: "0 4px 4px 0",
            transform: "rotate(15deg)",
          }}
        />
        {/* Top fronds */}
        <div
          className="absolute transition-colors duration-1000"
          style={{
            width: 10,
            height: 4,
            backgroundColor: foliageLight,
            top: 0,
            left: 6,
            borderRadius: "0 0 4px 4px",
            transform: "rotate(-5deg)",
          }}
        />
        <div
          className="absolute transition-colors duration-1000"
          style={{
            width: 10,
            height: 4,
            backgroundColor: foliageLight,
            top: 2,
            left: 10,
            borderRadius: "0 0 4px 4px",
            transform: "rotate(8deg)",
          }}
        />
        {/* Center (coconuts) */}
        <div className="absolute" style={{
          width: 4, height: 4,
          backgroundColor: isDay ? "#8B5E3C" : "#3D2B1A",
          borderRadius: "50%",
          bottom: 2,
          left: "50%",
          transform: "translateX(-50%)",
        }} />
      </div>
      {/* Curved trunk */}
      <div
        className="transition-colors duration-1000"
        style={{
          width: 4,
          height: 22,
          backgroundColor: trunk,
          borderRadius: "2px",
          transform: "rotate(3deg)",
        }}
      />
    </div>
  );
}
