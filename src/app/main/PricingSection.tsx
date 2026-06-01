"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      tagline: "For small teams organizing operations.",
      price: "$10",
      features: [
        "Up to 10 team members",
        "5GB secure storage",
        "Basic project milestones",
        "Personal task labels",
      ],
      featured: false,
    },
    {
      name: "Growth",
      tagline: "For companies managing clients, HR, and projects together.",
      price: "$25",
      features: [
        "Up to 50 team members",
        "50GB shared cloud storage",
        "Full HR & CRM integrations",
        "From/For Client workflows",
        "Priority live support",
      ],
      featured: true,
    },
    {
      name: "Enterprise",
      tagline: "For advanced workflows, analytics, permissions, and scale.",
      price: "Custom",
      features: [
        "Unlimited active members",
        "Unlimited cloud storage",
        "Custom labels & roles validation",
        "Advanced BI reporting",
        "Dedicated database instance",
        "24/7 priority SLA",
      ],
      featured: false,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.12,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#030114] py-24 md:py-[8vw] px-6 text-white relative overflow-hidden"
      id="pricing"
    >
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5271ff]/[0.02] blur-[140px] rounded-full pointer-events-none z-0" />

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
            <Sparkles className="w-3.5 h-3.5 text-[#5271ff]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5271ff]">
              MODULAR SUBSCRIPTIONS
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Start with the modules you need. Scale when you’re ready.
          </h2>

          <p className="mt-4 text-base md:text-lg text-white/50">
            Deploy specifically the client management, workforce logs, or automation pipelines your workspace demands.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className={`relative rounded-2xl p-8 border bg-[#0a0826]/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between ${
                plan.featured
                  ? "border-[#5271ff]/40 hover:border-[#5271ff]/70 shadow-[#5271ff]/5"
                  : "border-white/[0.08] hover:border-white/[0.15]"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#5271ff] to-[#a855f7] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-6 min-h-[32px]">
                  {plan.tagline}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm text-white/40">/month</span>
                  )}
                </div>

                <div className="border-t border-white/[0.06] my-6" />

                <ul className="space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#5271ff] shrink-0 mt-0.5" />
                      <span className="text-xs text-white/70 font-semibold leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => router.push("/session?form=signup")}
                  className={`w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    plan.featured
                      ? "bg-gradient-to-r from-[#5271ff] to-[#a855f7] text-white shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_20px_rgba(82,113,255,0.4)]"
                      : "bg-white/[0.02] border border-white/[0.08] text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {plan.price === "Custom" ? "Book a Demo" : "Start Free Trial"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom dual controls as required */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push("/session?form=signup")}
            className="landing-btn-primary group !py-3.5 !px-8 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Book a Demo
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("modules");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="landing-btn-outline group !py-3.5 !px-8 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            View Modules Pricing
          </button>
        </div>
      </div>
    </section>
  );
}
