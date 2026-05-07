
"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarWidget() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  return (
    <div className="border rounded-md p-3 w-full">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        className="w-full"
      />
    </div>
  );
}
