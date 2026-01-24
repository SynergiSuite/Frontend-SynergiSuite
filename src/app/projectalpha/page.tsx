"use client";
import React from "react";
import Header from "./header";
import LeftSidebar from "./leftsidebar";
import MiddleSection from "./middlesection";
import RightSidebar from "./rightsidebar";

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex p-6 gap-6">
          <LeftSidebar />
          <MiddleSection />
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Page;