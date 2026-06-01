"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TrustStrip() {
  const companies = [
    "Aether",
    "Nebula",
    "Vertex",
    "Synapse",
    "Modus",
    "Hexa",
    "Krypton",
    "Onyx",
  ];

  return (
    <section className="bg-[#030114] py-12 border-y border-white/[0.04] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-semibold mb-8 text-center">
          Trusted by teams building smarter operations
        </p>

        {/* Marquee Track */}
        <div className="relative w-full flex overflow-x-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030114] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030114] to-transparent z-10 pointer-events-none" />

          {/* Dual tracks for seamless marquee */}
          <div className="flex gap-16 py-2 animate-marquee whitespace-nowrap min-w-full">
            {companies.concat(companies).map((company, index) => (
              <div
                key={`${company}-${index}`}
                className="flex items-center gap-2.5 text-white/20 hover:text-white/50 transition-colors duration-300 cursor-pointer"
              >
                <div className="h-5 w-5 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold tracking-wider">
                  {company[0]}
                </div>
                <span className="text-sm font-semibold tracking-wider uppercase">
                  {company}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-16 py-2 animate-marquee whitespace-nowrap min-w-full" aria-hidden="true">
            {companies.concat(companies).map((company, index) => (
              <div
                key={`${company}-${index}-duplicate`}
                className="flex items-center gap-2.5 text-white/20 hover:text-white/50 transition-colors duration-300 cursor-pointer"
              >
                <div className="h-5 w-5 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold tracking-wider">
                  {company[0]}
                </div>
                <span className="text-sm font-semibold tracking-wider uppercase">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
