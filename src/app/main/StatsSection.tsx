"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: string;
  numericValue: number;
  suffix: string;
  prefix: string;
  hasDecimal: boolean;
  label: string;
}

const stats: StatItem[] = [
  {
    value: "10,000+",
    numericValue: 10000,
    suffix: "+",
    prefix: "",
    hasDecimal: false,
    label: "Teams Worldwide",
  },
  {
    value: "500K+",
    numericValue: 500,
    suffix: "K+",
    prefix: "",
    hasDecimal: false,
    label: "Employees Managed",
  },
  {
    value: "99.9%",
    numericValue: 99.9,
    suffix: "%",
    prefix: "",
    hasDecimal: true,
    label: "Platform Uptime",
  },
  {
    value: "40%",
    numericValue: 40,
    suffix: "%",
    prefix: "",
    hasDecimal: false,
    label: "Productivity Boost",
  },
];

function formatNumber(num: number, hasDecimal: boolean, useCommas: boolean): string {
  if (hasDecimal) {
    return num.toFixed(1);
  }
  const rounded = Math.floor(num);
  if (useCommas) {
    return rounded.toLocaleString("en-US");
  }
  return rounded.toString();
}

function useCountUp(
  target: number,
  isActive: boolean,
  duration: number = 2000,
  hasDecimal: boolean = false
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, target, duration, hasDecimal]);

  return count;
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section className="bg-[#030114] py-16 md:py-[6vw] border-t border-b border-white/[0.08]">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  index,
  isInView,
}: {
  stat: StatItem;
  index: number;
  isInView: boolean;
}) {
  const count = useCountUp(stat.numericValue, isInView, 2000, stat.hasDecimal);

  // Determine if this stat needs comma formatting (for 10,000+)
  const useCommas = stat.numericValue >= 1000;
  const displayValue = formatNumber(count, stat.hasDecimal, useCommas);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className="text-center"
    >
      <span className="text-4xl md:text-5xl font-bold text-white landing-serif block">
        {stat.prefix}
        {displayValue}
        {stat.suffix}
      </span>
      <p className="text-sm md:text-base text-white/60 mt-2">{stat.label}</p>
    </motion.div>
  );
}
