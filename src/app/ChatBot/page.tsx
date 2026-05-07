"use client";

import React from "react";

import Header from "./Header";
import Sidebar from "./RightBar";
import ChatArea from "./ChatArea";

const Page = () => {
  return (
    <>
      <div className="w-full min-h-screen bg-[#eaeaea] p-6">
        <div
          className="
            w-full
            h-[calc(100vh-48px)]
            bg-white
            rounded-3xl
            overflow-hidden
            border
            border-gray-200
            shadow-sm
            flex
            flex-col
          "
        >
          <Header />

          <div className="flex flex-1 overflow-hidden">
            <ChatArea />

            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;