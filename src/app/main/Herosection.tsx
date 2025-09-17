import React from "react";

export default function HeroSection() {
  return (
    <>
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center justify-between">
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Streamline Your Team's Workflow
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              All-in-one collaboration platform for modern teams to manage projects, track time, and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4">
              <a
                href="#"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Start Free Trial
              </a>
              <a
                href="#"
                className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition"
              >
                Book a Demo
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-2">Trusted by 10,000+ teams worldwide</p>
          </div>

          {/* Right Side Image */}
          <div className="w-full lg:w-1/2 lg:ml-6">
            <img
              src=""
              alt="Hero illustration"
              className="w-full max-w-md mx-auto lg:max-w-full rounded-xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
