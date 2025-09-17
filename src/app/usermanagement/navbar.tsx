import React, { useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState("Overview"); 

  const handleClick = (name: string) => {
    console.log(`${name} clicked`);
    setActive(name); 
  };

  return (
    <>
      <header className="w-full border-b border-gray-300">
        <div className="flex justify-between items-center py-3 px-6">
          
          <div className="flex items-center space-x-10">
            <h2 
              className="font-bold text-lg cursor-pointer" 
              onClick={() => handleClick("Business Pro")}
            >
              Business Pro
            </h2>

            <nav className="flex space-x-6 text-sm">
              {["Overview", "Team", "Projects", "Reports"].map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`${
                    active === item ? "text-black font-semibold underline" : "text-gray-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

        
          <div 
            className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"
            onClick={() => handleClick("Profile Avatar")}
          ></div>
        </div>
      </header>
    </>
  );
}
