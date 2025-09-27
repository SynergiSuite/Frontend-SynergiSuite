"use client";
import { useState } from "react";
import { User } from "lucide-react";
import SearchBar from "./searchteams";

export default function Navbar() {
  const navLinks = ["Dashboard", "Teams", "Projects", "Settings"];
  const [active, setActive] = useState("Dashboard");

  const handleClick = (label: string) => {
    setActive(label);
    console.log(`${label} clicked`);
    
  };

  return (
    <>
      <header className="w-full border-b bg-white">
        <div className="flex justify-between items-center px-6 py-3">
          
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">TeamSync</h1>
            <nav className="flex gap-6 text-gray-600">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => handleClick(link)}
                  className={`transition ${
                    active === link
                      ? "text-black font-semibold border-b-2 border-black"
                      : "hover:text-black"
                  }`}
                >
                  {link}
                </button>
              ))}
            </nav>
          </div>

          
          <div className="flex items-center gap-4 w-64">
            <SearchBar />
            <User className="w-8 h-8 rounded-full bg-gray-200 p-1 cursor-pointer" />
          </div>
        </div>
      </header>
    </>
  );
}