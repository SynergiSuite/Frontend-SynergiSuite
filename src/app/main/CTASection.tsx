"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-[#030114] py-28 md:py-[12vw] px-6 text-center select-none">
      {/* Spectacular Glowing 3D Hub Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-[400px] h-[400px] opacity-20 blur-[2px]"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Inner glowing core rings */}
          <div className="absolute inset-[30px] rounded-full border border-dashed border-[#5271ff]/30 animate-pulse" />
          <div className="absolute inset-[60px] rounded-full border border-double border-[#a855f7]/30" />
          <div className="absolute inset-[90px] rounded-full border border-emerald-500/20" />
          
          {/* Symmetrical glowing satellite nodes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-lg bg-gradient-to-tr from-[#5271ff] to-[#a855f7] blur-[2px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-lg bg-gradient-to-tr from-[#a855f7] to-[#22d3ee] blur-[2px]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-gradient-to-tr from-[#22d3ee] to-[#5271ff] blur-[2px]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 blur-[2px]" />
        </motion.div>
      </div>

      {/* Deep space radial lighting overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,113,255,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#a855f7]/[0.03] blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">
        {/* Header decoration */}
        <motion.div
          className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-4 py-1.5 border border-white/[0.08] backdrop-blur-md mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22d3ee] animate-spin" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#22d3ee]">
            GET STARTED TODAY
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Bring your business into perfect synergy.
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-base sm:text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Replace scattered tools with one intelligent suite built for modern operations.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 w-full sm:w-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={() => router.push("/session?form=signup")}
            className="landing-btn-primary group !py-4 !px-8 text-sm md:text-base w-full sm:w-auto justify-center flex items-center gap-2.5 cursor-pointer shadow-[0_0_30px_rgba(82,113,255,0.35)]"
          >
            Get Started With SynergiSuite
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
          
          <button
            onClick={() => router.push("/session?form=login")}
            className="landing-btn-outline group !py-4 !px-8 text-sm md:text-base w-full sm:w-auto justify-center cursor-pointer"
          >
            Talk to Sales
          </button>
        </motion.div>

        {/* Lower aesthetic indicators */}
        <div className="flex items-center gap-2 justify-center mt-16 opacity-30">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>
    </section>
  );
}
