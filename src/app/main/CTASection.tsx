import React from "react";

export default function CTASection() {
  return (
    <>
      <div className="bg-orange-500 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Supercharge Your Team?
          </h2>
          <p className="text-lg mb-8">
            Get started with CollabFlow and experience seamless collaboration, project tracking, and productivity — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="bg-white text-orange-500 font-semibold py-3 px-6 rounded-lg hover:bg-orange-100 transition"
            >
              Start Free Trial
            </a>
            <a
              href="#"
              className="border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-orange-500 transition"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
