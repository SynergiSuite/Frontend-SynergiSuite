import React from "react";
import { Button } from "@/global/buttons";

const Toolbar = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p></p>
        </div>
        <Button className="button_primary_xl">
          Add Task
        </Button>
      </div>
    </>
  );
};

export default Toolbar;
