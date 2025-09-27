import React, { useState } from "react";
import { Button } from "@/global/buttons";0
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false);
  

  const handleClick = (label: string) => {
    router.push(`/session?form=${label}`);
  };
  
  return (
    <>
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-gray-800">SynergiSuite</div>
          <ul className="hidden md:flex space-x-8 text-gray-700 font-medium" id="navLinks">
            <li><a href="#" className="hover:text-orange-500 transition">Features</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Solutions</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Pricing</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Resources</a></li>
          </ul>
          <div className="hidden md:flex space-x-4 items-center nav-buttons">
            <Button onClick={() => handleClick("login")} className="font-medium text-gray-700">Login</Button>
            <Button onClick={() => handleClick("signup")} className="button_primary_lg">Get Started</Button>
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
            <Button onClick={() => handleClick("login")} className="font-medium text-gray-700">Login</Button>
            <Button onClick={() => handleClick("signup")} className="button_primary_xl">Get Stated</Button>
          </div>
        </div>
      </nav>
    </>
  );
}
