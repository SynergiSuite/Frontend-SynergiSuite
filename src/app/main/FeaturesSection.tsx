"use client"
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LayoutDashboard,
  BrainCircuit,
  Users,
  Shield,
  Workflow,
  Plug,
} from "lucide-react";

const smoothEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const features = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description:
      "Get a bird's-eye view of your entire organization. Real-time metrics, KPIs, and actionable insights — all in one customizable command center.",
    size: "large" as const,
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Reports",
    description:
      "Let artificial intelligence crunch your data. Auto-generated reports, predictive trends, sentiment analysis, and smart recommendations delivered to your inbox.",
    size: "large" as const,
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Work seamlessly across teams and time zones with live updates, shared workspaces, and instant notifications.",
    size: "small" as const,
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Enterprise-grade security with granular permissions. Control who sees what, at every level.",
    size: "small" as const,
  },
  {
    icon: Workflow,
    title: "Automated Workflows",
    description:
      "Eliminate manual processes. Set up triggers, approvals, and notifications that run on autopilot.",
    size: "small" as const,
  },
  {
    icon: Plug,
    title: "Integrations",
    description:
      "Connect with Slack, Google Workspace, Microsoft 365, and 100+ tools your team already uses.",
    size: "small" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
};

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="landing-bg py-20 md:py-[8vw] px-5 md:px-[5vw]"
      id="features"
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-16 md:mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm uppercase tracking-[0.2em] landing-text-tertiary mb-4">
          Features
        </p>
        <h2 className="text-4xl md:text-5xl landing-serif text-white">
          Everything your team needs
        </h2>
        <p className="mt-4 text-base md:text-lg landing-text-secondary max-w-2xl mx-auto">
          Powerful features designed for modern teams to manage, collaborate, and grow — all from a single platform.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isLarge = feature.size === "large";

          return (
            <motion.div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl landing-card-bg landing-border-subtle p-7 md:p-8 flex flex-col transition-all duration-300 hover:border-white/[0.15] hover:-translate-y-1 ${
                isLarge ? "md:col-span-2 md:row-span-1 min-h-[220px]" : "min-h-[200px]"
              }`}
              variants={itemVariants}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#5271ff]/[0.06] blur-3xl" />
              </div>

              {/* Icon */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.05] mb-5 group-hover:bg-[#5271ff]/10 transition-colors duration-300">
                <Icon className="w-5 h-5 text-[#5271ff]" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm landing-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/10"
                >
                  <circle cx="4" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="20" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="20" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="4" cy="20" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="20" r="1.5" fill="currentColor" />
                  <circle cx="20" cy="20" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
