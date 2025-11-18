
"use client";
import React, { useState } from "react";

export default function Calendar() {
  const [month] = useState("August 2025");

  
  const rows = [
    ["27", "28", "29", "30", "31", "1", "2"],
    ["3", "4", "5", "6", "7", "8", "9"],
    ["10", "11", "12", "13", "14", "15", "16"],
    ["17", "18", "19", "20", "21", "22", "23"],
    ["24", "25", "26", "27", "28", "29", "30"],
    ["31", "1", "2", "3", "4", "5", "6"],
  ];

  return (
    <>
      <div className="border rounded-md p-3 w-full">
        <div className="flex justify-between items-center mb-2">
          <button>{"<"}</button>
          <span className="font-medium">{month}</span>
          <button>{">"}</button>
        </div>

        <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {rows.flat().map((day, idx) => (
            <div key={idx} className="py-1">
              {day}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
