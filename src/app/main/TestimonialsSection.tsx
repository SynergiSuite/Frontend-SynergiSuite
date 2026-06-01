"use client"
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star } from "lucide-react";
import BrandLogo from "./BrandLogo";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    rating: 4,
    quoteStart: "has transformed how our team works together. The intuitive interface and powerful features make project management a breeze.",
    startsWithBrand: true,
  },
  {
    name: "Michael Chen",
    role: "CEO at StartupX",
    rating: 5,
    quoteStart: "Since implementing",
    quoteEnd: "we've seen a 40% increase in team productivity. It's become an essential part of our daily operations.",
    includesBrand: true,
  },
  {
    name: "Emily Davis",
    role: "Design Director at CreativeStudio",
    rating: 5,
    quoteStart: "The collaboration features are outstanding. Our team can now work seamlessly across different time zones and projects.",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const testimonial = testimonials[current];

  return (
    <section
      ref={sectionRef}
      className="bg-[#030114] py-20 md:py-[8vw] px-6"
      id="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        {/* Section Label */}
        <p className="text-sm text-white/40 tracking-[0.2em] text-center uppercase">
          TESTIMONIALS
        </p>

        {/* Section Heading */}
        <h2 className="landing-serif text-4xl md:text-5xl text-white text-center mt-4">
          Loved by Teams Worldwide
        </h2>

        {/* Carousel */}
        <div className="mt-16 min-h-[320px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Quote */}
              <p className="text-2xl md:text-3xl lg:text-4xl landing-serif italic text-white text-center max-w-4xl mx-auto leading-relaxed">
                &ldquo;
                {testimonial.startsWithBrand && (
                  <>
                    <BrandLogo className="mx-1 inline-flex h-8 md:h-10 translate-y-1" />
                    {" "}
                  </>
                )}
                {testimonial.quoteStart}
                {testimonial.includesBrand && (
                  <>
                    {" "}
                    <BrandLogo className="mx-1 inline-flex h-8 md:h-10 translate-y-1" />
                    {" "}
                  </>
                )}
                {testimonial.quoteEnd}
                &rdquo;
              </p>

              {/* Star Rating */}
              <div className="flex gap-1 justify-center mt-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= testimonial.rating
                        ? "fill-[#5271ff] text-[#5271ff]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Author Info */}
              <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-white/50 mt-1">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 justify-center mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === current ? "bg-[#5271ff]" : "bg-white/20"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
