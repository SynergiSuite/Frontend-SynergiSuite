"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Briefcase,
  Layers,
  MessagesSquare,
  BarChart3,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const modules = [
    {
      title: "HR Management",
      desc: "Manage employees, attendance, payroll, leaves, documents, and performance in one place.",
      icon: Users,
      color: "text-[#5271ff]",
      bg: "group-hover:bg-[#5271ff]/10",
      border: "hover:border-[#5271ff]/30",
      shadow: "shadow-[#5271ff]/5",
    },
    {
      title: "Client Management",
      desc: "Track leads, clients, conversations, contracts, onboarding, and long-term relationships.",
      icon: Briefcase,
      color: "text-[#a855f7]",
      bg: "group-hover:bg-[#a855f7]/10",
      border: "hover:border-[#a855f7]/30",
      shadow: "shadow-[#a855f7]/5",
    },
    {
      title: "Project Management",
      desc: "Plan projects, assign tasks, manage timelines, monitor workload, and deliver faster.",
      icon: Layers,
      color: "text-[#22d3ee]",
      bg: "group-hover:bg-[#22d3ee]/10",
      border: "hover:border-[#22d3ee]/30",
      shadow: "shadow-[#22d3ee]/5",
    },
    {
      title: "Team Collaboration",
      desc: "Keep teams aligned with shared workspaces, updates, approvals, and internal communication.",
      icon: MessagesSquare,
      color: "text-blue-500",
      bg: "group-hover:bg-blue-500/10",
      border: "hover:border-blue-500/30",
      shadow: "shadow-blue-500/5",
    },
    {
      title: "Analytics & Reports",
      desc: "Get real-time visibility across departments with intelligent dashboards and performance insights.",
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "group-hover:bg-emerald-400/10",
      border: "hover:border-emerald-400/30",
      shadow: "shadow-emerald-400/5",
    },
    {
      title: "Workflow Automation",
      desc: "Automate repetitive approvals, reminders, follow-ups, status updates, and operational tasks.",
      icon: Cpu,
      color: "text-[#e879f9]",
      bg: "group-hover:bg-[#e879f9]/10",
      border: "hover:border-[#e879f9]/30",
      shadow: "shadow-[#e879f9]/5",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={containerRef}
      className="bg-[#030114] py-24 md:py-[8vw] px-6 relative overflow-hidden"
      id="modules"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#5271ff] font-semibold mb-4"
          >
            THE MODULAR PLATFORM
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            One suite. Every core business function.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-white/50"
          >
            Say goodbye to fragmenting your payroll, workspace, and contacts across multiple apps. Power them all from a single secure login.
          </motion.p>
        </div>

        {/* Modules Responsive Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-2xl bg-[#0a0826]/30 border border-white/[0.08] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${mod.border} ${mod.shadow} select-none`}
              >
                {/* Accent ambient glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Floating header section with icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] transition-all duration-300 ${mod.color} ${mod.bg}`}>
                    <Icon className="h-5.5 w-5.5 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-105" />
                  </div>
                  <ArrowUpRight className="h-4.5 w-4.5 text-white/20 group-hover:text-white/80 transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {mod.title}
                </h3>
                
                <p className="text-sm text-white/55 leading-relaxed">
                  {mod.desc}
                </p>

                {/* Grid backdrop card pattern decor */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
