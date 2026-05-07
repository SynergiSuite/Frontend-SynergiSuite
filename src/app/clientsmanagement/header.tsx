"use client";

import React from "react";

const Header = () => {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Client Management
        </h1>

        <img
          src="https://i.pravatar.cc/100?img=8"
          alt="profile"
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </>
  );
};

export default Header;