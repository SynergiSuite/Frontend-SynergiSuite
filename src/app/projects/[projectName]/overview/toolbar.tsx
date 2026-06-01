import React from "react";
import { Button } from "@/global/buttons";

const Toolbar = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p></p>
        </div>
        <Button className="rounded-xl px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_15px_rgba(82,113,255,0.25)] hover:shadow-[0_0_22px_rgba(82,113,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
          Add Task
        </Button>
      </div>
    </>
  );
};

export default Toolbar;

