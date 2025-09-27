import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-100 border-t border-gray-300 pt-10 pb-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">SynergiSuite</h2>
            <p className="text-sm text-gray-600">
              The all-in-one platform for team collaboration, productivity, and project management.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-2">Product</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-orange-500">Features</a></li>
              <li><a href="#" className="hover:text-orange-500">Integrations</a></li>
              <li><a href="#" className="hover:text-orange-500">Pricing</a></li>
              <li><a href="#" className="hover:text-orange-500">What's New</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-orange-500">About</a></li>
              <li><a href="#" className="hover:text-orange-500">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500">Press</a></li>
              <li><a href="#" className="hover:text-orange-500">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-orange-500">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-500">Contact</a></li>
              <li><a href="#" className="hover:text-orange-500">Status</a></li>
              <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SynergiSuite. All rights reserved.
        </div>
      </footer>
    </>
  );
}
