"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAction = (label: string) => {
    router.push(`/session?form=${label}`);
  };

  const navLinks = [
    { label: "Product", href: "#hero" },
    { label: "Modules", href: "#modules" },
    { label: "Solutions", href: "#problem" },
    { label: "Pricing", href: "#pricing" },
    { label: "Resources", href: "#dashboard" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 md:px-12 ${
          scrolled
            ? "bg-[#030114]/80 backdrop-blur-md border-b border-white/[0.06] py-3 shadow-[0_4px_30px_rgba(3,1,20,0.5)]"
            : "bg-transparent py-5"
        }`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Futuristic connected 'S' Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5271ff]/20 to-[#a855f7]/20 border border-white/[0.08] group-hover:border-[#5271ff]/30 transition-all duration-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Node-based futuristic S mark */}
                <path d="M16.5 4.5H9.5C8.39543 4.5 7.5 5.39543 7.5 6.5C7.5 7.60457 8.39543 8.5 9.5 8.5H14.5C15.6046 8.5 16.5 9.39543 16.5 10.5C16.5 11.6046 15.6046 12.5 14.5 12.5H7.5" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.5 11.5H9.5C8.39543 11.5 7.5 12.3954 7.5 13.5C7.5 14.6046 8.39543 15.5 9.5 15.5H14.5C15.6046 15.5 16.5 16.3954 16.5 17.5C16.5 18.6046 15.6046 19.5 14.5 19.5H7.5" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Node connection joints */}
                <circle cx="16.5" cy="4.5" r="1.5" fill="#a855f7" />
                <circle cx="7.5" cy="12.5" r="1.5" fill="#5271ff" />
                <circle cx="16.5" cy="11.5" r="1.5" fill="#22d3ee" />
                <circle cx="7.5" cy="19.5" r="1.5" fill="#a855f7" />
                <defs>
                  <linearGradient id="logo-grad" x1="7.5" y1="4.5" x2="16.5" y2="19.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5271ff" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 rounded-xl bg-[#5271ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white select-none bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Synergi<span className="text-[#5271ff] font-extrabold">Suite</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="relative text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 py-1 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5271ff] transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => handleAction("login")}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-300"
            >
              Login
            </button>
            <button
              onClick={() => handleAction("login")}
              className="relative overflow-hidden group rounded-xl bg-gradient-to-r from-[#5271ff] to-[#a855f7] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(82,113,255,0.4)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Book a Demo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.08] text-white hover:bg-white/[0.06] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="4" cy="4" r="1.5" fill="white" />
              <circle cx="10" cy="4" r="1.5" fill="white" />
              <circle cx="16" cy="4" r="1.5" fill="white" />
              <circle cx="4" cy="10" r="1.5" fill="white" />
              <circle cx="10" cy="10" r="1.5" fill="white" />
              <circle cx="16" cy="10" r="1.5" fill="white" />
              <circle cx="4" cy="16" r="1.5" fill="white" />
              <circle cx="10" cy="16" r="1.5" fill="white" />
              <circle cx="16" cy="16" r="1.5" fill="white" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-[#030114]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5271ff]/10 border border-white/[0.08]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M16.5 4.5H9.5C8.39543 4.5 7.5 5.39543 7.5 6.5C7.5 7.60457 8.39543 8.5 9.5 8.5H14.5C15.6046 8.5 16.5 9.39543 16.5 10.5C16.5 11.6046 15.6046 12.5 14.5 12.5H7.5" stroke="#5271ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.5 11.5H9.5C8.39543 11.5 7.5 12.3954 7.5 13.5C7.5 14.6046 8.39543 15.5 9.5 15.5H14.5C15.6046 15.5 16.5 16.3954 16.5 17.5C16.5 18.6046 15.6046 19.5 14.5 19.5H7.5" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">SynergiSuite</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.08] text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col flex-1 justify-center px-8 gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl font-bold text-white py-3 border-b border-white/[0.06] hover:text-[#5271ff] transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <div className="p-8 space-y-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleAction("signup");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#a855f7] py-3.5 text-sm font-semibold text-white"
              >
                Book a Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleAction("login");
                }}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3.5 text-sm font-semibold text-white/70"
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
