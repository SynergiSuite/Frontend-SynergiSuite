"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, CheckCircle } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const handleStartTrial = () => {
    router.push("/session?form=signup");
  };

  const floatingCards = [
    { text: "12 Projects Active", x: "-30%", y: "-35%", delay: 0.1, color: "border-[#5271ff]/30 shadow-[#5271ff]/10" },
    { text: "94% Team Capacity", x: "32%", y: "-25%", delay: 0.3, color: "border-[#a855f7]/30 shadow-[#a855f7]/10" },
    { text: "New Client Onboarded", x: "-42%", y: "20%", delay: 0.5, color: "border-[#22d3ee]/30 shadow-[#22d3ee]/10" },
    { text: "Payroll Ready", x: "38%", y: "25%", delay: 0.7, color: "border-emerald-500/30 shadow-emerald-500/10" },
    { text: "3 Tasks Automated", x: "-5%", y: "45%", delay: 0.9, color: "border-purple-500/30 shadow-purple-500/10" },
  ];

  const orbitModules = [
    { name: "HR", angle: 0, color: "from-[#5271ff] to-[#3a4ec4]" },
    { name: "Clients", angle: 60, color: "from-[#a855f7] to-[#7e22ce]" },
    { name: "Projects", angle: 120, color: "from-[#22d3ee] to-[#0891b2]" },
    { name: "Analytics", angle: 180, color: "from-[#3b82f6] to-[#1d4ed8]" },
    { name: "Automation", angle: 240, color: "from-emerald-500 to-teal-600" },
    { name: "Teams", angle: 300, color: "from-[#f43f5e] to-[#be123c]" },
  ];

  return (
    <section
      aria-label="Futuristic Interactive Hero"
      className="relative w-full overflow-hidden bg-[#030114] pt-28 md:pt-40 pb-20 md:pb-32 flex items-center min-h-[90vh]"
      id="hero"
    >
      {/* Glow overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,113,255,0.06)_0%,transparent_75%)] pointer-events-none z-0" />
      <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-[#5271ff]/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-[600px] w-[600px] rounded-full bg-[#a855f7]/[0.03] blur-[150px] pointer-events-none" />

      {/* Digital Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20 z-0" />

      {/* Moving Particles (Background) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#5271ff]/20 blur-[1px]"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100 - Math.random() * 100],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side Content */}
        <div className="lg:col-span-6 flex flex-col text-left">
          {/* Tagline */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-1.5 border border-white/[0.08] backdrop-blur-md mb-6 w-fit hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5271ff]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#22d3ee]">
              NEXT-GEN ENTERPRISE OPERATING SYSTEM
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Run Your Entire Business From One Intelligent Suite
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            SynergiSuite unifies HR, clients, projects, teams, workflows, and analytics into one beautifully connected platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={handleStartTrial}
              className="landing-btn-primary group !py-4 !px-8 text-base w-full sm:w-auto justify-center flex items-center gap-2.5 cursor-pointer shadow-[0_0_30px_rgba(82,113,255,0.35)]"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("dashboard");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="landing-btn-outline group !py-4 !px-8 text-base w-full sm:w-auto justify-center flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#22d3ee] fill-[#22d3ee]/20 group-hover:scale-110 transition-transform" />
              Watch Product Tour
            </button>
          </motion.div>

          {/* Trust Text */}
          <motion.div
            className="flex items-center gap-2 text-xs text-white/40 font-medium uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Built for growing teams, agencies, startups, and enterprise operations.</span>
          </motion.div>
        </div>

        {/* Right Side 3D Visual Hub Representation */}
        <div className="lg:col-span-6 relative flex justify-center items-center h-[500px] w-full mt-10 lg:mt-0 select-none">
          {/* Main 3D Container with custom CSS perspective */}
          <motion.div
            className="relative flex items-center justify-center w-[300px] h-[300px]"
            initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            {/* Glowing Core Business Hub Cube */}
            <motion.div
              className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#5271ff] via-[#a855f7] to-[#22d3ee] flex items-center justify-center p-[2px] shadow-[0_0_50px_rgba(82,113,255,0.4)] z-20 border border-white/20"
              animate={{
                rotate: 360,
                y: [0, -10, 0],
              }}
              transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="w-full h-full bg-[#030114]/90 rounded-[22px] flex flex-col items-center justify-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5271ff]/10 to-[#a855f7]/10 border border-white/[0.08]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#5271ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-white/90 tracking-[0.1em] uppercase">SS Core</span>
              </div>
            </motion.div>

            {/* Orbit Paths and Orbiting Modules */}
            <motion.div
              className="absolute w-[260px] h-[260px] rounded-full border border-white/[0.06] flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {orbitModules.map((module) => {
                const rad = (module.angle * Math.PI) / 180;
                const x = 130 * Math.cos(rad);
                const y = 130 * Math.sin(rad);

                return (
                  <div
                    key={module.name}
                    className="absolute flex items-center justify-center w-12 h-12 rounded-xl bg-[#0a0826] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <div className={`absolute inset-0.5 rounded-lg bg-gradient-to-br ${module.color} opacity-20 blur-[1px]`} />
                    <span className="relative z-10 text-[10px] font-bold text-white/90 tracking-wide">{module.name}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* Interactive Network Connecting Lines (SVG background nodes) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0" viewBox="0 0 300 300">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5271ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <line x1="150" y1="150" x2="50" y2="70" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="150" y1="150" x2="250" y2="70" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="150" y1="150" x2="40" y2="210" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="150" y1="150" x2="260" y2="220" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="150" y1="150" x2="150" y2="280" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 2" />
            </svg>
          </motion.div>

          {/* Floating UI status cards orbiting hub */}
          {floatingCards.map((card) => (
            <motion.div
              key={card.text}
              className={`absolute px-4 py-2.5 rounded-xl bg-[#0a0826]/75 backdrop-blur-md border text-xs font-semibold text-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-2 ${card.color}`}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                x: [card.x, card.x],
                y: [
                  `calc(${card.y} - 8px)`,
                  `calc(${card.y} + 8px)`,
                  `calc(${card.y} - 8px)`,
                ],
              }}
              transition={{
                y: {
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: card.delay,
                },
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#5271ff] animate-ping" />
              <span>{card.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
