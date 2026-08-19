"use client";

import { useEffect, useState } from "react";
import { PERSONAL } from "@/lib/data";
import { Battery, Cpu, HardDrive, Wifi, Activity } from "lucide-react";

export function Footer() {
  const [time, setTime] = useState("");
  const [cpu, setCpu] = useState(14);
  const [ram, setRam] = useState(32);

  // Live clock with seconds
  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated fluctuating stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(10 + Math.random() * 25));
      setRam(Math.floor(28 + Math.random() * 15));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="h-8" /> {/* Spacer to prevent overlap */}
      <footer className="fixed bottom-0 z-50 w-full border-t-2 border-arcade-border bg-arcade-surface px-4 py-1.5 backdrop-blur-md">
        <div className="flex items-center justify-between font-pixel text-[8px] text-arcade-muted uppercase">
          {/* Left — System Status */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-arcade-white">System Status</span>
            </span>
            <span className="hidden sm:inline text-green-500 font-mono text-[7px]">
              ● ALL SYSTEMS OPERATIONAL
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Cpu size={9} />
              <span className="font-mono text-[7px]">{cpu}%</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <HardDrive size={9} />
              <span className="font-mono text-[7px]">{ram}MB/s</span>
            </span>
          </div>

          {/* Center — Copyright */}
          <span className="hidden lg:block font-mono text-[7px] text-arcade-muted">
            © {new Date().getFullYear()} {PERSONAL.name} · Built with pixels & passion
          </span>

          {/* Right — Time & Status Icons */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-arcade-muted">
              <Activity size={9} />
              <span className="font-mono text-[7px]">LOW LATENCY</span>
            </span>
            <div className="flex items-center gap-2 text-arcade-white">
              <Wifi size={9} />
              <Battery size={9} />
              <span className="font-mono text-[8px] tracking-wider">
                CURRENT TIME
              </span>
              <span className="font-mono text-[9px] text-arcade-yellow tracking-wider">
                {time}
              </span>
              <span className="font-mono text-[7px] text-arcade-muted">IST</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
