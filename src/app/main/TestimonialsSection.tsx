import React from "react";

export default function TestimonialsSection() {
  return (
    <>
      <section className="py-16 bg-white testimonials-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Loved by Teams Worldwide
          </h2>
          <p className="text-center text-gray-600 mb-12">
            See what our customers have to say
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
          <div className="testimonial-card bg-gray-100 rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transform transition duration-300">
              <div className="flex items-center mb-4 space-x-4">
                <img
                  src=""
                  alt="Sarah Johnson"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Sarah Johnson</h3>
                  <p className="text-sm text-gray-500">Product Manager at TechCorp</p>
                </div>
              </div>
              <div className="text-yellow-500 text-lg mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700">
                CollabFlow has transformed how our team works together. The intuitive interface and powerful features make project management a breeze.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4 space-x-4">
                <img
                  src=""
                  alt="Michael Chen"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Michael Chen</h3>
                  <p className="text-sm text-gray-500">CEO at StartupX</p>
                </div>
              </div>
              <div className="text-yellow-500 text-lg mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700">
                Since implementing CollabFlow, we've seen a 40% increase in team productivity. It’s become an essential part of our daily operations.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card bg-gray-100 rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transform transition duration-300">
              <div className="flex items-center mb-4 space-x-4">
                <img
                  src=""
                  alt="Emily Davis"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Emily Davis</h3>
                  <p className="text-sm text-gray-500">Design Director at CreativeStudio</p>
                </div>
              </div>
              <div className="text-yellow-500 text-lg mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700">
                The collaboration features are outstanding. Our team can now work seamlessly across different time zones and projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
