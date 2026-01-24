"use client";
import React from "react";

const FooterActions = () => {
  return (
    <>
      <div className="flex justify-end gap-4 mt-10 pb-10">
        <button className="px-4 py-2 border rounded">Cancel</button>
        <button className="px-4 py-2 border rounded">Reset to Default</button>
        <button className="px-4 py-2 bg-black text-white rounded">
          Save Changes
        </button>
      </div>
    </>
  );
};

export default FooterActions;