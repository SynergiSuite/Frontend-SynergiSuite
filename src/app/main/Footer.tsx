"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Integrations", "Pricing", "What's New"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Blog"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact", "Status", "Privacy Policy"],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Cookie Policy", "GDPR", "Security"],
    },
  ];

  const socialLinks = ["Twitter", "LinkedIn", "GitHub"];

  return (
    <footer className="bg-[#030114] border-t border-white/[0.08] pt-16 md:pt-20 pb-8 px-6 relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12">
          {/* Logo & Tagline */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            <a href="#" className="flex items-center gap-2.5 group mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5271ff]/10 border border-white/[0.08]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M16.5 4.5H9.5C8.39543 4.5 7.5 5.39543 7.5 6.5C7.5 7.60457 8.39543 8.5 9.5 8.5H14.5C15.6046 8.5 16.5 9.39543 16.5 10.5C16.5 11.6046 15.6046 12.5 14.5 12.5H7.5" stroke="#5271ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.5 11.5H9.5C8.39543 11.5 7.5 12.3954 7.5 13.5C7.5 14.6046 8.39543 15.5 9.5 15.5H14.5C15.6046 15.5 16.5 16.3954 16.5 17.5C16.5 18.6046 15.6046 19.5 14.5 19.5H7.5" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Synergi<span className="text-[#5271ff]">Suite</span>
              </span>
            </a>
            <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-xs">
              AI-powered platform for HR, project management, client relationship management, and team collaboration.
            </p>
          </div>

          {/* 4-Column Link Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerLinks.map((column) => (
              <div key={column.title} className="flex flex-col text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs text-white/40 hover:text-[#5271ff] transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} SynergiSuite. All rights reserved.
          </p>
          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
