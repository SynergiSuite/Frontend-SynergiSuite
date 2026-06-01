"use client";

import React from "react";
import Navbar from "./navbar";
import HeroSection from "./Herosection";
import TrustStrip from "./TrustStrip";
import ProblemSection from "./ProblemSection";
import StorySection from "./StorySection";
import ServicesSection from "./ServicesSection";
import DashboardShowcase from "./DashboardShowcase";
import BenefitsSection from "./BenefitsSection";
import WorkflowSection from "./WorkflowSection";
import PricingSection from "./PricingSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="landing-bg landing-smooth-scroll min-h-screen text-white select-none antialiased">
      {/* 1. Sticky Navbar */}
      <Navbar />

      <main>
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Trust Strip */}
        <TrustStrip />

        {/* 4. Problem Section */}
        <ProblemSection />

        {/* 5. Scroll-Driven 3D Story Section */}
        <StorySection />

        {/* 6. Modules Section */}
        <ServicesSection />

        {/* 7. Product Dashboard Showcase */}
        <DashboardShowcase />

        {/* 8. Benefits Section */}
        <BenefitsSection />

        {/* 9. Workflow Automation Section */}
        <WorkflowSection />

        {/* 10. Pricing Section */}
        <PricingSection />

        {/* 11. Final CTA Section */}
        <CTASection />
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
