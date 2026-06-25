"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  UserPlus,
  Briefcase,
  Layers,
  Users,
  TrendingUp,
  FileCheck2,
} from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    { label: "Lead captured", icon: UserPlus, color: "text-[#5271ff]", border: "border-[#5271ff]/30 shadow-[#5271ff]/10", overlayBg: "bg-[#5271ff]" },
    { label: "Client onboarded", icon: Briefcase, color: "text-[#a855f7]", border: "border-[#a855f7]/30 shadow-[#a855f7]/10", overlayBg: "bg-[#a855f7]" },
    { label: "Project created", icon: Layers, color: "text-[#22d3ee]", border: "border-[#22d3ee]/30 shadow-[#22d3ee]/10", overlayBg: "bg-[#22d3ee]" },
    { label: "Team assigned", icon: Users, color: "text-blue-500", border: "border-blue-500/30 shadow-blue-500/10", overlayBg: "bg-blue-500" },
    { label: "Progress tracked", icon: TrendingUp, color: "text-emerald-400", border: "border-emerald-400/30 shadow-emerald-400/10", overlayBg: "bg-emerald-400" },
    { label: "Report generated", icon: FileCheck2, color: "text-[#e879f9]", border: "border-[#e879f9]/30 shadow-[#e879f9]/10", overlayBg: "bg-[#e879f9]" },
  ];

  return (
    <section className="bg-[#02000c] py-24 md:py-[10vw] px-6 relative overflow-hidden">
      {/* Background neon grid mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-20 z-0" />
      <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#e879f9]/[0.02] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 h-[600px] w-[600px] rounded-full bg-[#5271ff]/[0.03] blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-20">
          <motion.div
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-1.5 border border-white/[0.08] backdrop-blur-md mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e879f9]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e879f9]">
              Operations Autopilot
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Automate the busywork. Focus on the business.
          </h2>

          <p className="mt-4 text-base md:text-lg text-white/50">
            Set up complex pipelines that update client portals, allocate resource counts, and dispatch employee timesheet tasks automatically.
          </p>
        </div>

        {/* Futuristic horizontal flow pipeline (Desktop) */}
        <div className="hidden lg:flex relative items-center justify-between py-12 px-6 w-full">
          {/* Animated Glowing Connecting Line */}
          <div className="pointer-events-none absolute left-[8%] right-[8%] top-[76px] z-[1] h-0.5 overflow-hidden rounded-full bg-white/[0.05]">
            {/* Pulsing glow timeline path */}
            <motion.div
              className="h-full bg-gradient-to-r from-[#5271ff] via-[#e879f9] to-[#22d3ee] rounded-full"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                x: ["-100%", "100%"],
              }}
              transition={{
                x: { duration: 6, repeat: Infinity, ease: "linear" },
                backgroundPosition: { duration: 6, repeat: Infinity },
              }}
              style={{
                width: "40%",
                backgroundSize: "200% 200%",
                boxShadow: "0 0 12px rgba(232,121,249,0.85)",
              }}
            />
          </div>

          {/* Workflow Steps */}
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                className="flex flex-col items-center relative z-10 w-[14%]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                {/* Node bubble */}
                <div className={`relative z-[5] flex h-14 w-14 items-center justify-center rounded-2xl border bg-[#0a0826] overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg ${step.border}`}>
                  {/* Subtle color backdrop overlay */}
                  <div className={`absolute inset-0 opacity-10 ${step.overlayBg}`} />

                  <Icon className={`h-5.5 w-5.5 ${step.color} relative z-10`} />
                  <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl border border-white/10 bg-white/[0.02] transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Node number tag */}
                <span className="text-[9px] font-bold text-white/30 uppercase mt-4 tracking-widest">
                  STEP 0{index + 1}
                </span>

                {/* Text tag */}
                <h4 className="text-xs font-bold text-white/80 mt-1 uppercase tracking-wider text-center max-w-[110px] min-h-[32px] flex items-center justify-center">
                  {step.label}
                </h4>
              </motion.div>
            );
          })}
        </div>

        {/* Vertical List timeline (Mobile Fallback) */}
        <div className="flex lg:hidden flex-col items-start max-w-sm mx-auto space-y-8 relative pl-6 border-l border-white/[0.08]">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                className="flex items-center gap-4 relative w-full text-left"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Node bullet */}
                <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9 rounded-xl border bg-[#0a0826] border-white/10 text-white shadow-inner">
                  <Icon className={`h-4.5 w-4.5 ${step.color}`} />
                </div>

                {/* Content */}
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block">
                    STAGE 0{index + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider">
                    {step.label}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Trigger info box */}
        <motion.div
          className="mt-16 inline-flex max-w-xl mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 text-xs text-white/50 text-left gap-3 items-center backdrop-blur-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>
            <strong>Pipeline Status:</strong> Lead ingested triggers auto-onboarding folder, creates NextGen mobile sprint cards, assigns developers based on attendance index, and generates auto-weekly BI briefs.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
