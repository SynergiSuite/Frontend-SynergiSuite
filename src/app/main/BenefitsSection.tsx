"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Library, Zap, Eye, BarChart4 } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Single Source of Truth",
      desc: "Erase administrative redundancies and directory mismatches. With files, payroll accounts, project nodes, and employee contracts tied to single records, your administration runs completely unified.",
      icon: Library,
      color: "from-[#5271ff]/10 to-[#a855f7]/10",
      accent: "#5271ff",
      side: "left",
      visual: (
        <div className="relative w-72 h-48 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
            <span className="text-[10px] font-bold text-[#5271ff] uppercase">Central Records</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="space-y-2.5 my-3">
            <div className="h-6 w-full rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center px-2 text-[10px] text-white/60 font-semibold gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5271ff]" /> Sarah Johnson (Product Manager)
            </div>
            <div className="h-6 w-full rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center px-2 text-[10px] text-white/60 font-semibold gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" /> $120/hr Contract Bound
            </div>
          </div>
          <div className="text-[9px] text-white/30 text-center uppercase tracking-widest border-t border-white/[0.04] pt-2">
            Synchronized to all workspace layers
          </div>
        </div>
      ),
    },
    {
      title: "Faster Team Execution",
      desc: "Stop tab-switching between task manager feeds, chat applications, and file repositories. Hand off work in milliseconds, track timeline sprints dynamically, and coordinate seamlessly in real-time.",
      icon: Zap,
      color: "from-[#a855f7]/10 to-[#22d3ee]/10",
      accent: "#a855f7",
      side: "right",
      visual: (
        <div className="relative w-72 h-48 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold uppercase text-[#a855f7] tracking-wider">Milestone Alert</span>
            <span className="text-[8px] text-[#22d3ee] px-2 py-0.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/20 font-bold">1.2s Sync</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="flex items-center justify-between text-[11px] text-white">
              <span>Task: Build API Gateway</span>
              <span className="text-emerald-400 font-bold">Done</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#a855f7] to-[#22d3ee] rounded-full"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
          <div className="text-[10px] text-white/40 text-center italic mt-2">
            "Automation bypassed 3 manual checkpoints."
          </div>
        </div>
      ),
    },
    {
      title: "Better Client Visibility",
      desc: "Onboard clients into highly secure, custom-labeled guest portals. Show them actual milestone progress, manage invoicing flows, share specific project reports, and contract approvals under unified permissions.",
      icon: Eye,
      color: "from-[#22d3ee]/10 to-[#5271ff]/10",
      accent: "#22d3ee",
      side: "left",
      visual: (
        <div className="relative w-72 h-48 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
            <span className="text-[10px] font-bold text-[#22d3ee] uppercase">Guest Client Portal</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold">Logged In</span>
          </div>
          <div className="space-y-3.5 my-3">
            <div className="flex items-center justify-between text-[10px] text-white/70">
              <span>NextGen Mobile Client Progress</span>
              <span className="text-[#22d3ee] font-bold">82% Completed</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/50">
              <span>Shared Assets: Q2 Spec doc</span>
              <span className="text-white font-semibold">Available</span>
            </div>
          </div>
          <div className="text-[9px] text-white/40 text-center border-t border-white/[0.04] pt-2">
            Client scoped parameters enforced
          </div>
        </div>
      ),
    },
    {
      title: "Smarter Decisions With Analytics",
      desc: "Stop guessing employee capacity or tracking project margin ratios blindly. SynergiSuite analytics aggregates timesheets, revenue figures, and employee output to build highly intelligent predictive BI insights.",
      icon: BarChart4,
      color: "from-[#5271ff]/10 to-[#22d3ee]/10",
      accent: "#22d3ee",
      side: "right",
      visual: (
        <div className="relative w-72 h-48 rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 flex flex-col justify-between shadow-2xl select-none">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
            <span className="text-[10px] font-bold text-[#22d3ee] uppercase">BI Analytics</span>
            <span className="text-[9px] text-[#5271ff] font-bold">Active Engine</span>
          </div>
          {/* Vertical Bar Chart Graphic */}
          <div className="flex items-end justify-around h-20 my-2">
            {[40, 70, 55, 90, 65, 80].map((h, i) => (
              <div key={i} className="w-4 bg-white/[0.02] border border-white/[0.06] rounded-t-md h-full flex items-end">
                <motion.div
                  className="w-full bg-gradient-to-t from-[#5271ff] to-[#22d3ee] rounded-t-md"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            ))}
          </div>
          <div className="text-[10px] text-white/55 text-center mt-1 font-semibold flex items-center justify-center gap-1">
            🚀 System Productivity up <span className="text-emerald-400 font-bold">+18.5%</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-[#030114] py-24 md:py-[8vw] px-6 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5271ff]/[0.02] blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-1.5 border border-white/[0.08] backdrop-blur-md mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#22d3ee]">
              Value Proposition
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Built to simplify operations and unlock growth.
          </h2>

          <p className="mt-4 text-base md:text-lg text-white/50">
            Every feature is engineered to connect. Experience instant hand-offs and absolute alignment.
          </p>
        </div>

        {/* Benefit Alternating Layout Rows */}
        <div className="space-y-24 md:space-y-36">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isLeft = benefit.side === "left";

            return (
              <div
                key={benefit.title}
                className={`flex flex-col items-center gap-12 md:gap-16 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Column 1: Copy details */}
                <motion.div
                  className="w-full md:w-1/2 flex flex-col text-left"
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6 shadow-md" style={{ color: benefit.accent }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    {benefit.title}
                  </h3>

                  <p className="text-sm md:text-base text-white/55 leading-relaxed">
                    {benefit.desc}
                  </p>
                </motion.div>

                {/* Column 2: Graphic illustration portal */}
                <motion.div
                  className="w-full md:w-1/2 flex justify-center items-center"
                  initial={{ opacity: 0, scale: 0.9, rotateY: isLeft ? 15 : -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ perspective: 1000 }}
                >
                  <div className="relative group p-4 sm:p-6 rounded-[28px] border border-white/[0.08] bg-[#0a0826]/10 backdrop-blur-md hover:border-white/[0.15] transition-all duration-500 shadow-2xl flex items-center justify-center">
                    {/* Glowing back orb */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[28px]" />
                    <div className="absolute inset-10 bg-[#5271ff]/10 rounded-full opacity-35 blur-[35px] group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                    
                    {/* Custom component visual */}
                    {benefit.visual}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
