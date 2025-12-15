"use client";
import React from "react";

// ✅ Export Card type
export type Card = {
  title: string;
  value: number | string;
  change: string;
  progress?: number; // optional progress bar
};

// Individual card fragment
function StateCard({ title, value, change, progress }: Card) {
  const isPositive = change.startsWith("↑");

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
        {/* Large number */}
        <span className="text-3xl font-bold">{value}</span>

        {/* Title */}
        <span className="text-gray-500 text-sm mt-1">{title}</span>

        {/* Change indicator */}
        <span className={`text-sm mt-2 ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {change}
        </span>

        {/* Optional progress bar */}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}

// Wrapper component with grid layout
export default function StateCards({ cards }: { cards: Card[] }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <StateCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            progress={card.progress}
          />
        ))}
      </div>
    </>
  );
}


