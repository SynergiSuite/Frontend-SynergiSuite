"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  Cloud,
  Briefcase,
  FolderKanban,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  const setStoryContainer = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;

    if (!node) {
      setScrollContainer(null);
      return;
    }

    let parent = node.parentElement;

    while (parent && parent !== document.body) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      const canScroll = parent.scrollHeight > parent.clientHeight;

      if (canScroll && /auto|scroll|overlay/.test(overflowY)) {
        setScrollContainer(parent);
        return;
      }

      parent = parent.parentElement;
    }

    setScrollContainer(null);
  }, []);

  // Track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer ? { current: scrollContainer } : undefined,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to 3D model properties (scale, rotate, positions, stages)
  // Subtle rotation keeps text completely readable while providing the 3D depth effect
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.85, 1.05, 1, 1.1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [12, 18, 14, 20]);
  const rotateY = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [-15, 5, -8, 12]);

  // Stage 1 -> Stage 3: Positions for the 6 high-fidelity dashboard cards
  // Cards settle in a beautifully spaced ellipse layout around the central hub to prevent overlapping

  // Card 1: HR Directory (Top-Left)
  const block1X = useTransform(scrollYProgress, [0, 0.35], [-360, -260]);
  const block1Y = useTransform(scrollYProgress, [0, 0.35], [-240, -150]);
  const block1Z = useTransform(scrollYProgress, [0, 0.35], [120, 0]);
  const block1Rotate = useTransform(scrollYProgress, [0, 0.35], [-12, 0]);

  // Card 2: Cloud Sync (Top-Center)
  const block2X = useTransform(scrollYProgress, [0, 0.35], [-40, 0]);
  const block2Y = useTransform(scrollYProgress, [0, 0.35], [-340, -220]);
  const block2Z = useTransform(scrollYProgress, [0, 0.35], [-80, 0]);
  const block2Rotate = useTransform(scrollYProgress, [0, 0.35], [8, 0]);

  // Card 3: CRM Sales Pipeline (Top-Right)
  const block3X = useTransform(scrollYProgress, [0, 0.35], [360, 260]);
  const block3Y = useTransform(scrollYProgress, [0, 0.35], [-240, -150]);
  const block3Z = useTransform(scrollYProgress, [0, 0.35], [100, 0]);
  const block3Rotate = useTransform(scrollYProgress, [0, 0.35], [-6, 0]);

  // Card 4: Project Track (Bottom-Left)
  const block4X = useTransform(scrollYProgress, [0, 0.35], [-360, -260]);
  const block4Y = useTransform(scrollYProgress, [0, 0.35], [240, 150]);
  const block4Z = useTransform(scrollYProgress, [0, 0.35], [-120, 0]);
  const block4Rotate = useTransform(scrollYProgress, [0, 0.35], [10, 0]);

  // Card 5: Collab Chat (Bottom-Center)
  const block5X = useTransform(scrollYProgress, [0, 0.35], [40, 0]);
  const block5Y = useTransform(scrollYProgress, [0, 0.35], [340, 220]);
  const block5Z = useTransform(scrollYProgress, [0, 0.35], [80, 0]);
  const block5Rotate = useTransform(scrollYProgress, [0, 0.35], [-10, 0]);

  // Card 6: BI Analytics (Bottom-Right)
  const block6X = useTransform(scrollYProgress, [0, 0.35], [360, 260]);
  const block6Y = useTransform(scrollYProgress, [0, 0.35], [240, 150]);
  const block6Z = useTransform(scrollYProgress, [0, 0.35], [-100, 0]);
  const block6Rotate = useTransform(scrollYProgress, [0, 0.35], [14, 0]);

  // Common opacity and scale transforms for entry
  const opacityTransforms = useTransform(scrollYProgress, [0, 0.28], [0.15, 1]);
  const scaleTransforms = useTransform(scrollYProgress, [0, 0.28], [0.85, 1]);

  // Stage 2 & 3: Connection lines opacity
  const linesOpacity = useTransform(scrollYProgress, [0.18, 0.38, 0.55], [0, 1, 0.5]);

  // Stage 4: Expansion of orbiting module cards
  const orbit1Opacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);
  const orbit1Scale = useTransform(scrollYProgress, [0.65, 0.85], [0.6, 1]);

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
      ref={setStoryContainer}
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
          <div className="w-full md:w-6/12 flex items-center justify-center h-[400px] md:h-[600px]">
            <motion.div
              className="relative w-[320px] h-[320px] scale-[0.45] xs:scale-[0.55] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 origin-center select-none"
              style={{
                scale,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              {/* CENTRAL glowing hub sphere/cube */}
              <div
                className="absolute left-[63%] top-[63%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#5271ff] via-[#a855f7] to-[#22d3ee] flex items-center justify-center p-[2px] shadow-[0_0_40px_rgba(82,113,255,0.4)] z-25"
                style={{ transform: "translate3d(-50%, -50%, 0)" }}
              >
                <div className="w-full h-full bg-[#030114]/90 rounded-[14px] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Fragmented Modules (Transform position relative to center) */}

              {/* Card 1: HR Directory */}
              <motion.div
                className="absolute w-[220px] h-[130px] rounded-2xl border bg-[#0a0826]/75 backdrop-blur-xl flex flex-col p-4 shadow-2xl justify-between border-white/[0.08]"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -110,
                  marginTop: -65,
                  x: block1X,
                  y: block1Y,
                  z: block1Z,
                  rotate: block1Rotate,
                  opacity: opacityTransforms,
                  scale: scaleTransforms,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Users size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">Talent Pool</h4>
                    <p className="text-[9px] text-white/40">Human Resources</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 mt-2">
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#5271ff] text-[8px] font-bold flex items-center justify-center text-white border border-slate-900">SC</div>
                    <div className="w-5 h-5 rounded-full bg-[#a855f7] text-[8px] font-bold flex items-center justify-center text-white border border-slate-900">AM</div>
                    <div className="w-5 h-5 rounded-full bg-[#10b981] text-[8px] font-bold flex items-center justify-center text-white border border-slate-900">ER</div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    98% Retained
                  </span>
                </div>
              </motion.div>

              {/* Card 2: Cloud Storage */}
              <motion.div
                className="absolute w-[220px] h-[130px] rounded-2xl border bg-[#0a0826]/75 backdrop-blur-xl flex flex-col p-4 shadow-2xl justify-between border-white/[0.08]"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -110,
                  marginTop: -65,
                  x: block2X,
                  y: block2Y,
                  z: block2Z,
                  rotate: block2Rotate,
                  opacity: opacityTransforms,
                  scale: scaleTransforms,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Cloud size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">Storage Sync</h4>
                    <p className="text-[9px] text-white/40">Cloud Filesystem</p>
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-white/[0.04] pt-2 mt-2 text-left">
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-[42%]" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-white/50">
                    <span>Active Sync</span>
                    <span>2.1 TB / 5.0 TB</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: CRM Sales Pipeline */}
              <motion.div
                className="absolute w-[220px] h-[130px] rounded-2xl border bg-[#0a0826]/75 backdrop-blur-xl flex flex-col p-4 shadow-2xl justify-between border-white/[0.08]"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -110,
                  marginTop: -65,
                  x: block3X,
                  y: block3Y,
                  z: block3Z,
                  rotate: block3Rotate,
                  opacity: opacityTransforms,
                  scale: scaleTransforms,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Briefcase size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">Sales CRM</h4>
                    <p className="text-[9px] text-white/40">Client Relations</p>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-white/[0.04] pt-2 mt-2">
                  <div className="text-left">
                    <p className="text-[8px] uppercase tracking-wider text-white/30">Total Value</p>
                    <p className="text-sm font-black text-white">$124,500</p>
                  </div>
                  <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                    42 Leads
                  </span>
                </div>
              </motion.div>

              {/* Card 4: Projects PM */}
              <motion.div
                className="absolute w-[220px] h-[130px] rounded-2xl border bg-[#0a0826]/75 backdrop-blur-xl flex flex-col p-4 shadow-2xl justify-between border-white/[0.08]"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -110,
                  marginTop: -65,
                  x: block4X,
                  y: block4Y,
                  z: block4Z,
                  rotate: block4Rotate,
                  opacity: opacityTransforms,
                  scale: scaleTransforms,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <FolderKanban size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">Projects Gantt</h4>
                    <p className="text-[9px] text-white/40">Workflow Tracker</p>
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-white/[0.04] pt-2 mt-2 text-left">
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[78%]" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-white/50">
                    <span>14 Active Boards</span>
                    <span>78% Done</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 5: Collab Chat */}
              <motion.div
                className="absolute w-[220px] h-[130px] rounded-2xl border bg-[#0a0826]/75 backdrop-blur-xl flex flex-col p-4 shadow-2xl justify-between border-white/[0.08]"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -110,
                  marginTop: -65,
                  x: block5X,
                  y: block5Y,
                  z: block5Z,
                  rotate: block5Rotate,
                  opacity: opacityTransforms,
                  scale: scaleTransforms,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <MessageSquare size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">Sync Chat</h4>
                    <p className="text-[9px] text-white/40">Collab Station</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 mt-2">
                  <div className="flex items-center gap-1.5 bg-indigo-500/5 border border-indigo-500/10 px-2 py-1 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[9px] text-indigo-300 font-bold">Secure Line</span>
                  </div>
                  <span className="text-[9px] text-white/50 font-mono">3 Active Streams</span>
                </div>
              </motion.div>

              {/* Card 6: BI Analytics */}
              <motion.div
                className="absolute w-[220px] h-[130px] rounded-2xl border bg-[#0a0826]/75 backdrop-blur-xl flex flex-col p-4 shadow-2xl justify-between border-white/[0.08]"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -110,
                  marginTop: -65,
                  x: block6X,
                  y: block6Y,
                  z: block6Z,
                  rotate: block6Rotate,
                  opacity: opacityTransforms,
                  scale: scaleTransforms,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <BarChart3 size={16} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">BI Operations</h4>
                    <p className="text-[9px] text-white/40">Operational Intel</p>
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-white/[0.04] pt-2 mt-2">
                  <div className="flex items-end gap-1 pb-1">
                    <div className="w-1.5 bg-rose-500/30 h-3 rounded-sm" />
                    <div className="w-1.5 bg-rose-500/60 h-6 rounded-sm" />
                    <div className="w-1.5 bg-rose-500 h-9 rounded-sm animate-pulse" />
                  </div>
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">
                    +24.8% Productive
                  </span>
                </div>
              </motion.div>

              {/* Connected glowing neon SVGs overlay lines - centered in -inset-[300px] frame (total 920x920) */}
              <motion.svg
                className="absolute -inset-[300px] w-[920px] h-[920px] pointer-events-none"
                style={{ opacity: linesOpacity, transformStyle: "preserve-3d" }}
                viewBox="0 0 920 920"
              >
                <defs>
                  <linearGradient id="line-hr" x1="200" y1="310" x2="460" y2="460" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#5271ff" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="line-cloud" x1="460" y1="240" x2="460" y2="460" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#5271ff" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="line-crm" x1="720" y1="310" x2="460" y2="460" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#5271ff" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="line-pm" x1="200" y1="610" x2="460" y2="460" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#5271ff" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="line-chat" x1="460" y1="680" x2="460" y2="460" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#5271ff" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="line-bi" x1="720" y1="610" x2="460" y2="460" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#5271ff" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Connecting lines between central hub (460,460) and 6 card coordinates */}
                <line x1="460" y1="460" x2="200" y2="310" stroke="url(#line-hr)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="460" y1="460" x2="460" y2="240" stroke="url(#line-cloud)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="460" y1="460" x2="720" y2="310" stroke="url(#line-crm)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="460" y1="460" x2="200" y2="610" stroke="url(#line-pm)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="460" y1="460" x2="460" y2="680" stroke="url(#line-chat)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="460" y1="460" x2="720" y2="610" stroke="url(#line-bi)" strokeWidth="2" strokeDasharray="4 4" />
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
                <div className="absolute -top-12 -right-12 px-3 py-1.5 rounded-lg bg-[#0a0826]/95 border border-emerald-500/20 text-[9px] font-bold text-white shadow-md flex items-center gap-1.5">
                  <Zap size={10} className="text-emerald-400 animate-pulse" />
                  🚀 Automation Active
                </div>
                <div className="absolute -bottom-12 -left-12 px-3 py-1.5 rounded-lg bg-[#0a0826]/95 border border-[#5271ff]/20 text-[9px] font-bold text-white shadow-md flex items-center gap-1.5">
                  <Activity size={10} className="text-blue-400" />
                  ⚡ Real-time Sync
                </div>
                <div className="absolute -top-16 left-12 px-3 py-1.5 rounded-lg bg-[#0a0826]/95 border border-purple-500/20 text-[9px] font-bold text-white shadow-md flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-purple-400" />
                  🔒 Cryptographic Lock
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
