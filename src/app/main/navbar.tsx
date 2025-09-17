import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); 
  return (
    <>
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-gray-800">CollabFlow</div>
          <ul className="hidden md:flex space-x-8 text-gray-700 font-medium" id="navLinks">
            <li><a href="#" className="hover:text-orange-500 transition">Features</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Solutions</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Pricing</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Resources</a></li>
          </ul>
          <div className="hidden md:flex space-x-4 items-center nav-buttons">
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Login</a>
            <a href="#" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium">Get Started</a>
          </div>
          <div className="md:hidden text-3xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</div>
       </div>

        <div className={`md:hidden px-4 pb-4 ${menuOpen ? "block" : "hidden"}`}>
          <ul className="space-y-4 text-gray-700 font-medium">
            <li><a href="#" className="block hover:text-orange-500">Features</a></li>
            <li><a href="#" className="block hover:text-orange-500">Solutions</a></li>
            <li><a href="#" className="block hover:text-orange-500">Pricing</a></li>
            <li><a href="#" className="block hover:text-orange-500">Resources</a></li>
          </ul>
          <div className="mt-4 space-y-2">
            <a href="#" className="block text-gray-700 hover:text-orange-500 font-medium">Login</a>
            <a href="#" className="block bg-orange-500 text-white px-4 py-2 rounded-lg text-center hover:bg-orange-600 transition font-medium">Get Started</a>
          </div>
        </div>
      </nav>
    </>
  );
}
