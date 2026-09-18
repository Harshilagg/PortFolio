"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const RoomScene = dynamic(
  () => import("@/three/room/RoomScene").then((m) => m.RoomScene),
  { ssr: false }
);

/**
 * The room. Mounted only once it is actually near the viewport — a full 3D
 * scene is too expensive to build for a section nobody has scrolled to.
 */
export function TheRoom() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="room" ref={ref} className="relative">
      <div className="px-6 pt-32 md:px-12 lg:px-20">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            05
          </span>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              The room
            </span>
            <h2 className="mt-3 font-serif text-4xl leading-[0.95] text-ink-strong md:text-6xl">
              Where the work happens
            </h2>
            <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted-light">
              Drag to look around. The desk, the shelf and the record player all
              go somewhere.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-10 h-[78vh] min-h-[520px] w-full overflow-hidden border-y border-line">
        {live ? (
          <RoomScene night />
        ) : (
          <div className="h-full w-full bg-surface" aria-hidden />
        )}
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          Drag to look around
        </span>
      </div>
    </section>
  );
}
