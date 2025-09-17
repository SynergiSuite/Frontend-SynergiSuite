"use client"
import React from "react";

import Navbar from "./navbar";
import HeroSection from "./Herosection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import CTASection from "./CTASection";
import Footer from "./Footer";


export default function Home() {
  return (
    <>
      <Navbar />
       <main className="pt-16">
        <h1 className="text-4xl font-bold text-center mt-20">Welcome to SynergiSuite</h1>
        <HeroSection />
        <FeaturesSection/>
        <TestimonialsSection/>
        <PricingSection/>
        <CTASection/>
        <Footer/>

      </main>
    </>
  );
}
