"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section
      className="bg-[#030114] py-24 md:py-[8vw] px-6 relative overflow-hidden"
      id="dashboard"
    >
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[#5271ff]/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[#22d3ee]/[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-3xl">
          <motion.div
            className="inline-flex items-center gap-1.5 rounded-full bg-[#5271ff]/10 px-4 py-1.5 border border-[#5271ff]/20 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Activity className="w-3.5 h-3.5 text-[#5271ff] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5271ff]">
              LIVE BUSINESS OVERVIEW
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            The single screen that orchestrates operations
          </h2>

          <p className="mt-4 text-base md:text-lg text-white/50">
            Real-time metric flows, employee records, dynamic client funnels, and contract trackers synced flawlessly.
          </p>
        </div>

        {/* Dashboard Glass Mockup Frame Container */}
        <motion.div
          className="relative w-full max-w-5xl rounded-3xl border border-white/[0.08] bg-[#0a0826]/30 backdrop-blur-xl p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ perspective: 1200 }}
        >
          {/* Top Bar Glass Design */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f43f5e]" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider ml-2">
                synergisuite-admin-v2.0
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[10px] font-bold text-white/50 tracking-wider">
              🟢 ALL SYSTEMS SECURE & ACTIVE
            </div>
          </div>

          {/* Grid Layout of the Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Widget 1: Revenue & Productivity Analytics (Large Line Chart area) */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-8 rounded-2xl bg-[#030114]/50 border border-white/[0.06] p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#5271ff] uppercase">Company Health</span>
                  <h3 className="text-lg font-bold text-white mt-1">Productivity & Margin</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>+28.4% This Qtr</span>
                </div>
              </div>

              {/* Graphic Chart representation using SVG paths */}
              <div className="h-44 w-full relative mt-4 select-none">
                <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  
                  {/* Glowing line paths */}
                  <path
                    d="M 0 130 C 50 110, 100 120, 150 70 C 200 20, 250 80, 300 40 C 350 0, 400 30, 450 10 C 480 0, 500 10, 500 10"
                    fill="none"
                    stroke="#5271ff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 140 C 60 120, 120 130, 180 90 C 240 50, 300 100, 360 60 C 420 20, 460 40, 500 25"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-center border-t border-white/[0.04] pt-4 mt-4">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5271ff]" />
                    <span>Project Margin</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee]" />
                    <span>Employee Output</span>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-[#5271ff] hover:underline uppercase flex items-center gap-1">
                  View Report <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Widget 2: Client Pipeline Funnel Tracker */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-4 rounded-2xl bg-[#030114]/50 border border-white/[0.06] p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#a855f7] uppercase">Clients CRM</span>
                <h3 className="text-lg font-bold text-white mt-1">Lead Conversion</h3>
              </div>

              <div className="space-y-3.5 my-4">
                {/* Funnel rows */}
                <div>
                  <div className="flex justify-between text-xs text-white/70 font-semibold mb-1">
                    <span>Active Leads</span>
                    <span>140</span>
                  </div>
                  <div className="w-full bg-white/[0.03] rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#a855f7] to-[#5271ff] h-2 rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/70 font-semibold mb-1">
                    <span>Contracts Proposed</span>
                    <span>42</span>
                  </div>
                  <div className="w-full bg-white/[0.03] rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] h-2 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/70 font-semibold mb-1">
                    <span>Onboarded Teams</span>
                    <span>28</span>
                  </div>
                  <div className="w-full bg-white/[0.03] rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: "40%" }} />
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04] text-[11px] text-white/60">
                ⭐ Average conversion velocity is <span className="text-emerald-400 font-bold">12.5 days faster</span> than standard agency average.
              </div>
            </motion.div>

            {/* Widget 3: HR Attendance & Payroll Tracker */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-4 rounded-2xl bg-[#030114]/50 border border-white/[0.06] p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#22d3ee] uppercase">HR Module</span>
                <h3 className="text-lg font-bold text-white mt-1">Today's Check-ins</h3>
              </div>

              <div className="flex items-center gap-6 my-6 justify-center">
                {/* Circular progress meter */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                    <path
                      className="text-white/[0.04]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#22d3ee]"
                      strokeWidth="3.5"
                      strokeDasharray="94, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">94%</span>
                    <span className="text-[8px] text-white/40 uppercase font-semibold">Capacity</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-white">94 Active Staff</div>
                  <div className="text-[11px] text-white/50">4 Remote</div>
                  <div className="text-[11px] text-white/50">2 Leaves Appr.</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 text-[11px] text-white/50">
                <span>Next payroll due in 4 days</span>
                <span className="text-[#22d3ee] font-bold uppercase hover:underline cursor-pointer">Reconcile</span>
              </div>
            </motion.div>

            {/* Widget 4: Project Management & Task Workload status */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-5 rounded-2xl bg-[#030114]/50 border border-white/[0.06] p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#5271ff] uppercase">Workspace</span>
                  <h3 className="text-lg font-bold text-white mt-1">Project Milestone progress</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">12 Sprints</span>
              </div>

              <div className="space-y-3.5 my-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-white font-medium">SynergiSuite App</span>
                  </div>
                  <span className="text-xs text-white/60 font-semibold">100% (Done)</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-ping"
                    />
                    <span className="text-xs text-white font-medium">NextGen Mobile Client</span>
                  </div>
                  <span className="text-xs text-[#22d3ee] font-semibold">82% (Active)</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/20" />
                    <span className="text-xs text-white/60 font-medium">Enterprise API Nodes</span>
                  </div>
                  <span className="text-xs text-white/40">Starts June 1</span>
                </div>
              </div>

              <div className="border-t border-white/[0.04] pt-3 flex justify-between items-center text-[10px] text-white/40">
                <span>Updated 2 mins ago</span>
                <span className="text-white/60 hover:text-white cursor-pointer underline">Timeline Calendar</span>
              </div>
            </motion.div>

            {/* Widget 5: Recent Automated Workflow Activities */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-3 rounded-2xl bg-[#030114]/50 border border-white/[0.06] p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#e879f9] uppercase">Flow Automation</span>
                <h3 className="text-lg font-bold text-white mt-1">Recent triggers</h3>
              </div>

              <div className="my-4 space-y-3.5">
                <div className="flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="text-[11px]">
                    <span className="font-bold text-white">HR Invoice generated</span> for Engineering Team
                    <p className="text-[9px] text-white/30 mt-0.5">3 secs ago</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="text-[11px]">
                    <span className="font-bold text-white">Client Proposal signed</span> by Modus
                    <p className="text-[9px] text-white/30 mt-0.5">5 mins ago</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5271ff] mt-1.5 shrink-0" />
                  <div className="text-[11px]">
                    <span className="font-bold text-white">Weekly BI Report</span> mailed to CEO
                    <p className="text-[9px] text-white/30 mt-0.5">1 hour ago</p>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#e879f9] font-bold hover:underline cursor-pointer uppercase flex items-center gap-1">
                Configure pipeline triggers →
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
