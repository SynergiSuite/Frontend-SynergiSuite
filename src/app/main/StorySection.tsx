"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to 3D model properties (scale, rotate, positions, stages)
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.8, 1.1, 1, 1.2]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [15, 30, 20, 35]);
  const rotateY = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [-25, 45, 180, 360]);

  // Stage 1 (0 to 0.25): Scattered positions for blocks
  const block1X = useTransform(scrollYProgress, [0, 0.3], [-120, 0]);
  const block1Y = useTransform(scrollYProgress, [0, 0.3], [-100, 0]);
  const block1Z = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  const block2X = useTransform(scrollYProgress, [0, 0.3], [140, 0]);
  const block2Y = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);
  const block2Z = useTransform(scrollYProgress, [0, 0.3], [-50, 0]);

  const block3X = useTransform(scrollYProgress, [0, 0.3], [-110, 0]);
  const block3Y = useTransform(scrollYProgress, [0, 0.3], [90, 0]);
  const block3Z = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);

  const block4X = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const block4Y = useTransform(scrollYProgress, [0, 0.3], [110, 0]);
  const block4Z = useTransform(scrollYProgress, [0, 0.3], [60, 0]);

  // Stage 2 & 3: Connection lines opacity
  const linesOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.55], [0, 1, 0.4]);

  // Stage 4: Expansion of orbiting module cards
  const orbit1Opacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);
  const orbit1Scale = useTransform(scrollYProgress, [0.65, 0.85], [0.5, 1]);

  // Text panel animations based on scroll ranges
  const text1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.28], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.22, 0.28], [0, 0, -20]);

  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.32, 0.52, 0.58], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.25, 0.32, 0.52, 0.58], [20, 0, 0, -20]);

  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.62, 0.82, 0.88], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.55, 0.62, 0.82, 0.88], [20, 0, 0, -20]);

  const text4Opacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const text4Y = useTransform(scrollYProgress, [0.85, 0.95], [20, 0]);

  const stages = [
    {
      title: "Before SynergiSuite",
      text: "Disconnected systems, duplicated work, and zero cross-department visibility.",
      opacity: text1Opacity,
      y: text1Y,
    },
    {
      title: "Connected Operational Layer",
      text: "SynergiSuite bridges every department into a highly responsive, shared layer.",
      opacity: text2Opacity,
      y: text2Y,
    },
    {
      title: "Unified Command Center",
      text: "Your team gets one clean source of truth for people, clients, projects, and execution.",
      opacity: text3Opacity,
      y: text3Y,
    },
    {
      title: "Enterprise Velocity",
      text: "Scale exponentially with automated workflows, real-time analytics, and instant hand-offs.",
      opacity: text4Opacity,
      y: text4Y,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-[#030114] h-[300vh] md:h-[400vh]"
      id="story"
    >
      {/* Sticky screen container */}
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden px-6 md:px-16 z-20">
        
        {/* Background glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#5271ff]/10 to-[#a855f7]/10 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,1,20,0.8)_0%,#030114_100%)] pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 h-full py-16 md:py-0">
          
          {/* Left panel: Transforming Copy */}
          <div className="w-full md:w-5/12 flex items-center h-[180px] md:h-[300px] relative">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.title}
                className="absolute flex flex-col text-left max-w-md pointer-events-none"
                style={{
                  opacity: stage.opacity,
                  y: stage.y,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5271ff] bg-[#5271ff]/10 px-3 py-1 rounded-full border border-white/[0.04]">
                    STAGE 0{i + 1}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                  {stage.title}
                </h3>
                <p className="text-sm md:text-base text-white/50 leading-relaxed">
                  {stage.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right panel: Transforming 3D Node Centerpiece */}
          <div className="w-full md:w-6/12 flex items-center justify-center h-[350px] md:h-[500px]">
            <motion.div
              className="relative w-[320px] h-[320px]"
              style={{
                scale,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              {/* CENTRAL glowing hub sphere/cube */}
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#5271ff] via-[#a855f7] to-[#22d3ee] flex items-center justify-center p-[2px] shadow-[0_0_40px_rgba(82,113,255,0.4)] z-25"
                style={{ transform: "translate3d(-50%, -50%, 0)" }}
              >
                <div className="w-full h-full bg-[#030114]/90 rounded-[14px] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Fragmented Modules (Transform position relative to center) */}
              {/* Block 1: HR */}
              <motion.div
                className="absolute w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -24,
                  marginTop: -24,
                  x: block1X,
                  y: block1Y,
                  z: block1Z,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="absolute inset-0 bg-[#5271ff]/10 rounded-xl blur-[1px]" />
                <span className="text-[10px] font-bold text-[#5271ff]">HR</span>
              </motion.div>

              {/* Block 2: Clients */}
              <motion.div
                className="absolute w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -24,
                  marginTop: -24,
                  x: block2X,
                  y: block2Y,
                  z: block2Z,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="absolute inset-0 bg-[#a855f7]/10 rounded-xl blur-[1px]" />
                <span className="text-[10px] font-bold text-[#a855f7]">CRM</span>
              </motion.div>

              {/* Block 3: Projects */}
              <motion.div
                className="absolute w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -24,
                  marginTop: -24,
                  x: block3X,
                  y: block3Y,
                  z: block3Z,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="absolute inset-0 bg-[#22d3ee]/10 rounded-xl blur-[1px]" />
                <span className="text-[10px] font-bold text-[#22d3ee]">PM</span>
              </motion.div>

              {/* Block 4: Analytics */}
              <motion.div
                className="absolute w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -24,
                  marginTop: -24,
                  x: block4X,
                  y: block4Y,
                  z: block4Z,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="absolute inset-0 bg-emerald-500/10 rounded-xl blur-[1px]" />
                <span className="text-[10px] font-bold text-emerald-400">BI</span>
              </motion.div>

              {/* Connected glowing neon SVGs overlay lines */}
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: linesOpacity, transformStyle: "preserve-3d" }}
                viewBox="0 0 320 320"
              >
                <defs>
                  <linearGradient id="glow-line" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5271ff" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                {/* Connecting lines between central node and blocks */}
                <line x1="160" y1="160" x2="160" y2="70" stroke="url(#glow-line)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="160" y1="160" x2="260" y2="160" stroke="url(#glow-line)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="160" y1="160" x2="60" y2="160" stroke="url(#glow-line)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="160" y1="160" x2="160" y2="250" stroke="url(#glow-line)" strokeWidth="1.5" strokeDasharray="3 3" />
              </motion.svg>

              {/* Orbiting card ecosystem (Stage 4 expansion visual) */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/[0.04] flex items-center justify-center"
                style={{
                  opacity: orbit1Opacity,
                  scale: orbit1Scale,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Outer Orbit Module Elements */}
                <div className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-[#0a0826]/90 border border-emerald-500/20 text-[9px] font-bold text-white shadow-md">
                  🚀 Automation Active
                </div>
                <div className="absolute bottom-4 left-2 px-3 py-1.5 rounded-lg bg-[#0a0826]/90 border border-[#5271ff]/20 text-[9px] font-bold text-white shadow-md">
                  💡 Real-time Sync
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
