"use client";

import { useTheme } from "@/providers/ThemeContext";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type Building = {
  x: number;
  w: number;
  h: number;
  windows: { on: boolean; flicker: boolean }[];
  windowCols: number;
  windowRows: number;
  roofType: "flat" | "antenna" | "dish" | "tower" | "spire";
  depth: number; // 0 = far, 1 = mid, 2 = near
};

type NeonSign = {
  x: number;
  y: number;
  text: string;
  color: string;
  width: number;
};

function generateBuildings(depth: number, count: number, startX: number, endX: number): Building[] {
  const buildings: Building[] = [];
  let currentX = startX;
  const step = (endX - startX) / count;

  for (let i = 0; i < count; i++) {
    const w = depth === 0
      ? 2 + Math.random() * 4
      : depth === 1
        ? 3 + Math.random() * 5
        : 4 + Math.random() * 7;

    const h = depth === 0
      ? 25 + Math.random() * 40
      : depth === 1
        ? 20 + Math.random() * 35
        : 15 + Math.random() * 27;

    const windowCols = Math.max(1, Math.floor(w / 1.5));
    const windowRows = Math.max(2, Math.floor(h / 5));
    const numWindows = windowCols * windowRows;
    const windows = Array.from({ length: numWindows }).map(() => ({
      on: Math.random() > 0.35,
      flicker: Math.random() > 0.85,
    }));

    const roofTypes: Building["roofType"][] = ["flat", "antenna", "dish", "tower", "spire"];
    const roofType = roofTypes[Math.floor(Math.random() * roofTypes.length)];

    buildings.push({
      x: currentX + (Math.random() * step * 0.3),
      w,
      h,
      windows,
      windowCols,
      windowRows,
      roofType,
      depth,
    });

    currentX += step;
  }

  return buildings;
}

function RoofDetail({ type, width, isDay }: { type: Building["roofType"]; width: string; isDay: boolean }) {
  const color = isDay ? "#2d4a6f" : "#1a1a2e";
  const lightColor = isDay ? "#4a6d8c" : "#FF6B6B";

  switch (type) {
    case "antenna":
      return (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "100%" }}>
          <div style={{ width: 2, height: 16, backgroundColor: color, margin: "0 auto" }} />
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 4,
              height: 4,
              backgroundColor: isDay ? "#FF6B6B" : "#FF6B6B",
              boxShadow: isDay ? "none" : "0 0 6px #FF6B6B",
              animation: "blink 2s step-end infinite",
            }}
          />
        </div>
      );
    case "dish":
      return (
        <div className="absolute right-1 sm:right-2" style={{ bottom: "100%" }}>
          <div style={{
            width: 8,
            height: 5,
            borderBottom: `2px solid ${color}`,
            borderLeft: `2px solid ${color}`,
            borderRadius: "0 0 0 50%",
          }} />
          <div style={{ width: 2, height: 6, backgroundColor: color }} />
        </div>
      );
    case "tower":
      return (
        <div className="absolute left-1/3" style={{ bottom: "100%" }}>
          <div style={{
            width: 8,
            height: 8,
            backgroundColor: color,
            borderRadius: "2px 2px 0 0",
          }}>
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{
                width: 3,
                height: 3,
                backgroundColor: lightColor,
                boxShadow: isDay ? "none" : `0 0 4px ${lightColor}`,
              }}
            />
          </div>
        </div>
      );
    case "spire":
      return (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "100%" }}>
          <div style={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderBottom: `12px solid ${color}`,
          }} />
        </div>
      );
    default:
      return null;
  }
}

export function CityLayer() {
  const { isDay } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [blinkTick, setBlinkTick] = useState(0);

  // Generate buildings for 3 depth layers
  const [allBuildings, setAllBuildings] = useState<Building[]>([]);
  const [signs, setSigns] = useState<NeonSign[]>([]);

  useEffect(() => {
    setMounted(true);

    const farBuildings = generateBuildings(0, 25, -5, 105);
    const midBuildings = generateBuildings(1, 18, -5, 105);
    const nearBuildings = generateBuildings(2, 12, -5, 105);

    setAllBuildings([...farBuildings, ...midBuildings, ...nearBuildings]);

    setSigns([
      { x: 5, y: 70, text: "CODE\nBUILD\nREPEAT", color: "#FFD34E", width: 7 },
      { x: 90, y: 80, text: "KEEP\nSHIPPING", color: "#5AC8FA", width: 8 },
      { x: 0, y: 40, text: "F\nO\nC\nU\nS", color: "#FF6B6B", width: 2 },
    ]);
  }, []);

  // Window blinking
  useEffect(() => {
    const interval = setInterval(() => setBlinkTick(t => t + 1), 1500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const getLayerStyles = (depth: number) => {
    if (depth === 0) {
      return {
        height: "50vh",
        opacity: isDay ? 0.3 : 0.5,
        bgColor: isDay ? "#1e3a5f" : "#080812",
        zIndex: -7,
      };
    }
    if (depth === 1) {
      return {
        height: "42vh",
        opacity: isDay ? 0.5 : 0.7,
        bgColor: isDay ? "#1a365d" : "#0a0a1a",
        zIndex: -6,
      };
    }
    return {
      height: "35vh",
      opacity: isDay ? 0.7 : 0.85,
      bgColor: isDay ? "#162d50" : "#050510",
      zIndex: -5,
    };
  };

  const renderBuildings = (depth: number) => {
    const layerBuildings = allBuildings.filter(b => b.depth === depth);
    const styles = getLayerStyles(depth);

    return (
      <div
        key={depth}
        className="pointer-events-none fixed inset-x-0 bottom-0 overflow-hidden transition-opacity duration-1000"
        style={{
          height: styles.height,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
        }}
      >
        {layerBuildings.map((b, i) => {
          const windowSize = depth === 0 ? 2 : depth === 1 ? 3 : 4;
          const windowGap = depth === 0 ? 1 : 2;

          return (
            <div
              key={`${depth}-${i}`}
              className="absolute bottom-0 transition-colors duration-1000"
              style={{
                left: `${b.x}%`,
                width: `${b.w}vw`,
                height: `${b.h}%`,
                backgroundColor: styles.bgColor,
                borderRadius: "3px 3px 0 0",
                boxShadow: isDay
                  ? "inset 0 2px 0 rgba(255,255,255,0.08)"
                  : "inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              {/* Roof detail */}
              <RoofDetail type={b.roofType} width={`${b.w}vw`} isDay={isDay} />

              {/* Windows grid */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-wrap content-start justify-center transition-opacity duration-1000",
                  isDay ? "opacity-20" : "opacity-100"
                )}
                style={{
                  padding: `${windowGap + 2}px ${windowGap}px`,
                  gap: `${windowGap}px`,
                }}
              >
                {b.windows.map((win, wi) => {
                  const shouldFlicker = win.flicker && (blinkTick % 3 === 0);
                  const isOn = win.on && !shouldFlicker;
                  const warmColors = ["rgba(255, 211, 78, 0.9)", "rgba(255, 180, 50, 0.8)", "rgba(200, 230, 255, 0.7)"];
                  const windowColor = warmColors[wi % warmColors.length];

                  return (
                    <div
                      key={wi}
                      className="transition-all duration-700"
                      style={{
                        width: windowSize,
                        height: windowSize,
                        backgroundColor: isDay
                          ? (isOn ? "rgba(135, 206, 235, 0.4)" : "rgba(255,255,255,0.1)")
                          : (isOn ? windowColor : "rgba(255,255,255,0.02)"),
                        boxShadow: !isDay && isOn
                          ? `0 0 ${windowSize}px ${windowColor}`
                          : "none",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Neon signs - only on near layer */}
        {depth === 2 && signs.map((sign, si) => (
          <div
            key={`sign-${si}`}
            className="absolute transition-opacity duration-1000 flex flex-col items-center"
            style={{
              left: `${sign.x}%`,
              bottom: `${sign.y}%`,
              width: `${sign.width}vw`,
              opacity: isDay ? 0.6 : 1,
              transform: !sign.text.includes("F\nO") 
                ? `perspective(1000px) rotateY(${sign.x < 50 ? '15deg' : '-15deg'})`
                : 'none',
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className={`border-2 px-1.5 py-1 text-center w-full relative z-10 ${!isDay ? 'animate-[neon-pulse_3s_infinite_alternate]' : ''}`}
              style={{
                borderColor: isDay ? "rgba(0,0,0,0.2)" : sign.color + "99",
                backgroundColor: isDay ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.85)",
                boxShadow: isDay ? "none" : `0 0 20px ${sign.color}66, inset 0 0 12px ${sign.color}33`,
              }}
            >
              {sign.text.split("\n").map((line, li) => (
                <div
                  key={li}
                  className="font-pixel leading-tight"
                  style={{
                    fontSize: sign.text.includes("F\nO") ? "6px" : "5px",
                    color: isDay ? "#1a365d" : sign.color,
                    textShadow: isDay ? "none" : `0 0 8px ${sign.color}, 0 0 12px ${sign.color}`,
                    letterSpacing: "0.05em",
                    marginTop: sign.text.includes("F\nO") && li > 0 ? "4px" : "0",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Billboard Supports (only for horizontal signs) */}
            {!sign.text.includes("F\nO") && (
              <div className="flex justify-between w-[80%] absolute top-full h-[90vh]">
                <div className="w-[2px] h-full" style={{ backgroundColor: isDay ? "#1a365d" : "#050510" }} />
                <div className="w-[2px] h-full" style={{ backgroundColor: isDay ? "#1a365d" : "#050510" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderBuildings(0)}
      {renderBuildings(1)}
      {renderBuildings(2)}
    </>
  );
}
