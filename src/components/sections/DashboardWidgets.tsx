"use client";

import { motion } from "framer-motion";
import { PixelBorder } from "../shared/PixelBorder";
import { Music, Code2, GitCommit, SkipBack, Pause, SkipForward, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ─── Music Visualizer Bars ─────────────────── */
function MusicBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-arcade-yellow rounded-sm"
          animate={playing ? {
            height: [4, 12 + Math.random() * 8, 6, 16 + Math.random() * 4, 8],
          } : { height: 3 }}
          transition={{
            duration: 0.6 + i * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Tech Stack Icons ──────────────────────── */
const TECH_ICONS = [
  { name: "React", color: "#61DAFB", symbol: "⚛"},
  { name: "Next.js", color: "#FFFFFF", symbol: "N" },
  { name: "Node.js", color: "#68A063", symbol: "⬡" },
  { name: "Python", color: "#FFD34E", symbol: "🐍" },
  { name: "TypeScript", color: "#3178C6", symbol: "TS" },
  { name: "AWS", color: "#FF9900", symbol: "☁" },
  { name: "Docker", color: "#2496ED", symbol: "🐳" }
];

/* ─── GitHub Activity Feed ──────────────────── */
const GITHUB_ACTIVITY = [
  { text: "Pushed 3 commits to portfolio", time: "2h ago", color: "#5AC8FA" },
  { text: "Built AI Document Processor", time: "yesterday", color: "#FFD34E" },
  { text: "Updated Chess Engine", time: "2 days ago", color: "#FF6B6B" },
  { text: "Fixed bugs & improved UI", time: "3 days ago", color: "#5AC8FA" },
];

const TRACKS = [
  { title: "Lo-Fi Coding", artist: "Mirostar", src: "/mirostar-lofi-beats-531504.mp3" },
  { title: "Midnight High Score", artist: "Slimeyfox", src: "/slimeyfox-midnight-high-score-487270.mp3" }
];

export function DashboardWidgets() {
  const [playing, setPlaying] = useState(true);
  const [trackIndex, setTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState({ min: 0, sec: 0 });
  const [duration, setDuration] = useState({ min: 0, sec: 0 });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[trackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(() => setPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, trackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (!isNaN(total)) {
        setProgress((current / total) * 100);
        setElapsed({
          min: Math.floor(current / 60),
          sec: Math.floor(current % 60)
        });
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const total = audioRef.current.duration;
      if (!isNaN(total)) {
        setDuration({
          min: Math.floor(total / 60),
          sec: Math.floor(total % 60)
        });
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setPlaying(true);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setPlaying(true);
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* ─── Now Playing Widget ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PixelBorder hover={false} className="h-full p-4">
          <div className="flex items-center gap-2 mb-3">
            <Music size={10} className="text-arcade-yellow" />
            <span className="font-pixel text-[8px] text-arcade-muted uppercase tracking-wider">Now Playing</span>
          </div>

          <audio
            ref={audioRef}
            src={currentTrack.src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          />

          <div className="flex items-center gap-3 mb-3">
            {/* Album art placeholder */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-arcade-border bg-arcade-surface">
              <MusicBars playing={playing} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs text-arcade-white truncate">{currentTrack.title}</p>
              <p className="font-mono text-[10px] text-arcade-muted truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="h-1 w-full bg-arcade-border cursor-pointer" onClick={(e) => {
              if (audioRef.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                audioRef.current.currentTime = clickPos * audioRef.current.duration;
              }
            }}>
              <motion.div
                className="h-full bg-arcade-blue"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[8px] text-arcade-muted">
                {String(elapsed.min).padStart(2, "0")}:{String(elapsed.sec).padStart(2, "0")}
              </span>
              <span className="font-mono text-[8px] text-arcade-muted">
                {String(duration.min).padStart(2, "0")}:{String(duration.sec).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={prevTrack} className="text-arcade-muted hover:text-arcade-white transition-colors" aria-label="Previous">
              <SkipBack size={12} />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="flex h-6 w-6 items-center justify-center border border-arcade-border bg-arcade-surface text-arcade-yellow hover:bg-arcade-yellow/10 transition-colors"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={10} /> : <Play size={10} />}
            </button>
            <button onClick={nextTrack} className="text-arcade-muted hover:text-arcade-white transition-colors" aria-label="Next">
              <SkipForward size={12} />
            </button>
          </div>
        </PixelBorder>
      </motion.div>

      {/* ─── Tech Stack Widget ──────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <PixelBorder hover={false} className="h-full p-4">
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={10} className="text-arcade-blue" />
            <span className="font-pixel text-[8px] text-arcade-muted uppercase tracking-wider">Tech Stack</span>
            <span className="font-pixel text-[8px] text-arcade-yellow ml-auto">›</span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {TECH_ICONS.map((tech, i) => (
              <motion.div
                key={tech.name}
                className="group relative flex flex-col items-center gap-1.5"
                whileHover={{ scale: 1.15, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center border-2 border-arcade-border bg-arcade-surface text-sm transition-all duration-200 group-hover:border-arcade-border-glow"
                  style={{
                    boxShadow: `0 0 0 rgba(${tech.color}, 0)`,
                  }}
                >
                  <span style={{ fontSize: tech.symbol.length > 1 ? 8 : 14 }}>
                    {tech.symbol}
                  </span>
                </div>
                <span className="font-pixel text-[6px] text-arcade-muted group-hover:text-arcade-white transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </PixelBorder>
      </motion.div>

      {/* ─── GitHub Activity Widget ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <PixelBorder hover={false} className="h-full p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitCommit size={10} className="text-arcade-red" />
            <span className="font-pixel text-[8px] text-arcade-muted uppercase tracking-wider">GitHub Activity</span>
            <span className="font-pixel text-[8px] text-arcade-yellow ml-auto">›</span>
          </div>

          <div className="space-y-2.5">
            {GITHUB_ACTIVITY.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <span
                  className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-arcade-white truncate leading-relaxed">
                    {item.text}
                  </p>
                </div>
                <span className="font-mono text-[8px] text-arcade-muted shrink-0 ml-1">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </PixelBorder>
      </motion.div>
    </div>
  );
}
