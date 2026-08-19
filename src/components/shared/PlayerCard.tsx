"use client";

import { motion } from "framer-motion";
import { EXPBar } from "./EXPBar";
import { useState } from "react";

export function PlayerCard() {
  const [hovered, setHovered] = useState(false);
  const [pressedA, setPressedA] = useState(false);
  const [pressedB, setPressedB] = useState(false);
  
  // 3D Voxel Rotation State
  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(45);

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="mx-auto"
    >
      {/* Handheld Controller Shell */}
      <div 
        className="relative w-full max-w-[200px] bg-[#1a1a24] p-3 pb-6 rounded-2xl rounded-br-[40px] border-2 border-arcade-border"
        style={{
          boxShadow: "inset -4px -4px 10px rgba(0,0,0,0.5), 10px 10px 0 rgba(0,0,0,0.3)",
        }}
      >
        {/* Top grooves */}
        <div className="absolute top-0 left-4 right-4 flex justify-between px-2 pt-1.5 opacity-30">
          <div className="w-10 h-0.5 bg-arcade-border rounded-full" />
          <div className="w-10 h-0.5 bg-arcade-border rounded-full" />
        </div>

        {/* Screen Bezel */}
        <div className="mt-2 bg-[#050510] border-2 border-[#333] rounded-t-lg rounded-b-2xl p-2.5 pb-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] relative">
          
          {/* Power light */}
          <div className="absolute top-3 left-1.5 flex flex-col items-center gap-1">
            <motion.div 
              className="w-1 h-1 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ boxShadow: "0 0 4px #22c55e" }}
            />
            <span className="font-pixel text-[3px] text-gray-500 tracking-tighter">BATT</span>
          </div>

          {/* Screen Content */}
          <div className="ml-2 border border-arcade-border bg-black overflow-hidden relative flex flex-col">
            
            <div className="relative">
              {/* Interactive 3D Voxel Cube */}
              <div 
                className="w-full aspect-square flex items-center justify-center" 
                style={{ perspective: "800px" }}
              >
                <motion.div 
                  className="w-16 h-16 relative"
                  animate={{ rotateX: rotX, rotateY: rotY }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 bg-[#FFD34E]/90 border-2 border-arcade-yellow flex items-center justify-center shadow-[0_0_15px_#FFD34E]" style={{ transform: "translateZ(32px)" }}>
                    <span className="font-pixel text-[8px] text-[#222]">CODE</span>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 bg-[#FF6B6B]/90 border-2 border-arcade-red flex items-center justify-center shadow-[0_0_15px_#FF6B6B]" style={{ transform: "translateZ(-32px) rotateY(180deg)" }}>
                    <span className="font-pixel text-[8px] text-[#222]">SHIP</span>
                  </div>
                  {/* Right */}
                  <div className="absolute inset-0 bg-[#5AC8FA]/90 border-2 border-arcade-blue flex items-center justify-center shadow-[0_0_15px_#5AC8FA]" style={{ transform: "rotateY(90deg) translateZ(32px)" }}>
                    <span className="font-pixel text-[8px] text-[#222]">PLAY</span>
                  </div>
                  {/* Left */}
                  <div className="absolute inset-0 bg-[#4ADE80]/90 border-2 border-green-400 flex items-center justify-center shadow-[0_0_15px_#4ADE80]" style={{ transform: "rotateY(-90deg) translateZ(32px)" }}>
                    <span className="font-pixel text-[8px] text-[#222]">DEV</span>
                  </div>
                  {/* Top */}
                  <div className="absolute inset-0 bg-[#A78BFA]/90 border-2 border-purple-400" style={{ transform: "rotateX(90deg) translateZ(32px)" }} />
                  {/* Bottom */}
                  <div className="absolute inset-0 bg-gray-600 border-2 border-gray-400" style={{ transform: "rotateX(-90deg) translateZ(32px)" }} />
                </motion.div>
              </div>

              {/* Overlay Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-20"
                   style={{ backgroundImage: "linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)", backgroundSize: "100% 2px" }} 
              />

              {/* Sparkles */}
              {hovered && (
                <>
                  {[
                    { top: "10%", left: "15%", delay: 0 },
                    { top: "20%", right: "10%", delay: 0.3 },
                    { bottom: "25%", left: "8%", delay: 0.5 },
                  ].map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute pointer-events-none"
                      style={pos}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180] }}
                      transition={{ duration: 1, delay: pos.delay, repeat: Infinity, repeatDelay: 0.8 }}
                    >
                      <span className="text-arcade-yellow text-[8px]">✦</span>
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Screen UI Overlay (Stats) - Now cleanly below avatar */}
            <div className="bg-[#050505] p-2 border-t-2 border-[#111]">
              <div className="flex justify-between items-center mb-1">
                <span className="font-pixel text-[6px] text-arcade-white">LVL.24</span>
                <span className="font-pixel text-[5px] text-arcade-blue">ONLINE</span>
              </div>
              <div className="py-0.5">
                <EXPBar label="EXP" value={99} color="#FFD34E" />
              </div>
              <div className="flex justify-between mt-1.5">
                <div className="flex gap-[1px]">
                  {[1,2,3].map(i => <span key={i} className="text-[5px]">❤️</span>)}
                </div>
                <div className="flex gap-1.5 font-pixel text-[4px]">
                  <span className="text-arcade-red">S:88</span>
                  <span className="text-arcade-blue">I:95</span>
                  <span className="text-arcade-yellow">D:82</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-2 font-pixel text-[4px] text-gray-500 uppercase tracking-widest">
            Harshil System
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex justify-between px-1 pt-6 pb-2 items-center">
          
          {/* D-Pad */}
          <div className="relative w-12 h-12 group">
            {/* Base Shape */}
            <motion.div 
              className="absolute top-1/4 left-0 w-full h-[50%] bg-[#2a2a35] rounded-sm pointer-events-none"
              style={{ boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.6), inset 1px 1px 1px rgba(255,255,255,0.1)" }}
            />
            <motion.div 
              className="absolute left-1/4 top-0 w-[50%] h-full bg-[#2a2a35] rounded-sm pointer-events-none"
              style={{ boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.6), inset 1px 1px 1px rgba(255,255,255,0.1)" }}
            />
            {/* Center indent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#202028] rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] pointer-events-none" />
            
            {/* Interactive Zones */}
            <button 
              className="absolute top-0 left-1/4 w-1/2 h-[35%] z-10 active:bg-black/20 rounded-t-sm" 
              onClick={() => setRotX(x => x + 90)}
              aria-label="Rotate Up"
            />
            <button 
              className="absolute bottom-0 left-1/4 w-1/2 h-[35%] z-10 active:bg-black/20 rounded-b-sm" 
              onClick={() => setRotX(x => x - 90)}
              aria-label="Rotate Down"
            />
            <button 
              className="absolute left-0 top-1/4 w-[35%] h-1/2 z-10 active:bg-black/20 rounded-l-sm" 
              onClick={() => setRotY(y => y - 90)}
              aria-label="Rotate Left"
            />
            <button 
              className="absolute right-0 top-1/4 w-[35%] h-1/2 z-10 active:bg-black/20 rounded-r-sm" 
              onClick={() => setRotY(y => y + 90)}
              aria-label="Rotate Right"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 -rotate-12 items-end mt-2">
            <div className="flex flex-col items-center">
              <motion.button 
                onMouseDown={() => setPressedB(true)}
                onMouseUp={() => setPressedB(false)}
                onMouseLeave={() => setPressedB(false)}
                animate={{ scale: pressedB ? 0.85 : 1 }}
                className="w-6 h-6 rounded-full bg-[#FF6B6B] border border-[#cc3d3d]"
                style={{
                  boxShadow: pressedB 
                    ? "inset 2px 2px 5px rgba(0,0,0,0.6)"
                    : "inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.3), 1px 2px 2px rgba(0,0,0,0.5)",
                }}
              />
              <span className="font-pixel text-[5px] text-gray-400 mt-1.5 rotate-12">B</span>
            </div>
            
            <div className="flex flex-col items-center mb-3">
              <motion.button 
                onMouseDown={() => setPressedA(true)}
                onMouseUp={() => setPressedA(false)}
                onMouseLeave={() => setPressedA(false)}
                animate={{ scale: pressedA ? 0.85 : 1 }}
                className="w-6 h-6 rounded-full bg-[#5AC8FA] border border-[#2a9ac9]"
                style={{
                  boxShadow: pressedA 
                    ? "inset 2px 2px 5px rgba(0,0,0,0.6)"
                    : "inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.3), 1px 2px 2px rgba(0,0,0,0.5)",
                }}
              />
              <span className="font-pixel text-[5px] text-gray-400 mt-1.5 rotate-12">A</span>
            </div>
          </div>
        </div>

        {/* Start / Select Buttons */}
        <div className="flex justify-center gap-3 mt-1">
          <div className="flex flex-col items-center">
            <motion.div 
              whileTap={{ scale: 0.9, y: 1 }}
              className="w-6 h-1.5 bg-[#444] border border-[#222] -rotate-12 rounded-full cursor-pointer shadow-[1px_1px_1px_rgba(0,0,0,0.5)]" 
            />
            <span className="font-pixel text-[4px] text-gray-500 mt-1 uppercase">Select</span>
          </div>
          <div className="flex flex-col items-center">
            <motion.div 
              whileTap={{ scale: 0.9, y: 1 }}
              className="w-6 h-1.5 bg-[#444] border border-[#222] -rotate-12 rounded-full cursor-pointer shadow-[1px_1px_1px_rgba(0,0,0,0.5)]" 
            />
            <span className="font-pixel text-[4px] text-gray-500 mt-1 uppercase">Start</span>
          </div>
        </div>

        {/* Speaker Grill */}
        <div className="absolute bottom-4 right-4 flex gap-1 -rotate-12 opacity-50">
          <div className="w-[2px] h-6 bg-black rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="w-[2px] h-6 bg-black rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="w-[2px] h-6 bg-black rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
          <div className="w-[2px] h-6 bg-black rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
        </div>
      </div>
    </motion.div>
  );
}
