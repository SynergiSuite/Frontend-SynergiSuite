"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Link2Off, Sparkles, HardDriveUpload } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      title: "Scattered HR data",
      desc: "Employee profiles, payroll calculators, documents, and time trackers reside on separate software, creating security loopholes and double-entry fatigue.",
      icon: AlertCircle,
      gradient: "from-[#5271ff]/40 to-[#a855f7]/40",
      glow: "rgba(82,113,255,0.15)",
    },
    {
      title: "Disconnected clients",
      desc: "Client communication is fragmented between email, chat apps, and generic CRMs, leaving team members blind to critical contract requests and timelines.",
      icon: Link2Off,
      gradient: "from-[#a855f7]/40 to-[#22d3ee]/40",
      glow: "rgba(168,85,247,0.15)",
    },
    {
      title: "Stuck in dashboard hell",
      desc: "Projects get stuck because assets, automation protocols, status checklists, and reporting lines live in different tools that refuse to talk to each other.",
      icon: HardDriveUpload,
      gradient: "from-[#22d3ee]/40 to-[#5271ff]/40",
      glow: "rgba(34,211,238,0.15)",
    },
  ];

  return (
    <section
      className="bg-[#030114] py-20 md:py-[8vw] px-6 relative overflow-hidden"
      id="problem"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-600/[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-1.5 border border-white/[0.08] backdrop-blur-md mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a855f7]">
              The Operational Crisis
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Business tools should work together, not against you.
          </motion.h2>

          <motion.p
            className="mt-4 text-base md:text-lg text-white/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Modern businesses drown in disconnected app ecosystems. Every tool you add builds another wall between your departments.
          </motion.p>
        </div>

        {/* 3 Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob, index) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.title}
                className="group relative rounded-2xl bg-[#0a0826]/30 backdrop-blur-md p-8 border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-1.5 select-none"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                style={{
                  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4)`,
                }}
              >
                {/* Glow Background Overlay */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${prob.glow} 0%, transparent 60%)`,
                  }}
                />

                {/* Animated Gradient Border overlay */}
                <div
                  className={`absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-tr ${prob.gradient} opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`}
                />

                {/* 3D-styled Icon */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white shadow-inner mb-6 group-hover:scale-105 group-hover:bg-white/[0.06] transition-all duration-300">
                  <Icon className="h-6 w-6 text-white/80 group-hover:text-white transition-colors" />
                  {/* Subtle neon drop shadow for icon */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#5271ff]/10 to-[#a855f7]/10 opacity-30 blur-[2px]" />
                </div>

                {/* Text Content */}
                <h3 className="relative z-10 text-xl font-bold text-white mb-3">
                  {prob.title}
                </h3>
                <p className="relative z-10 text-sm text-white/55 leading-relaxed">
                  {prob.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
