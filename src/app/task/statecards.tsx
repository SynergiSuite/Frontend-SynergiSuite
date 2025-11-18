"use client";
import React from "react";


type StateCard = {
  title: string;
  count: number;
};


const cardsData: StateCard[] = [
  { title: "Total Tasks", count: 28 },
  { title: "In Progress", count: 5 },
  { title: "Completed", count: 15 },
  { title: "Upcoming", count: 8 },
];

export default function StateCards() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="p-4 rounded-lg flex flex-col justify-between bg-white shadow-md"
          >
            <h3 className="text-lg font-medium">{card.title}</h3>
            <span className="text-2xl font-bold mt-2">{card.count}</span>
          </div>
        ))}
      </div>
    </>
  );
}

