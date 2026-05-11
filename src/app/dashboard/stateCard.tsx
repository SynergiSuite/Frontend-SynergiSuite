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
      <div className="flex min-h-[150px] flex-col justify-between rounded-lg bg-white p-4 shadow-md transition-shadow duration-200 hover:shadow-lg">
        {/* Large number */}
        <span className="text-2xl font-bold sm:text-3xl">{value}</span>

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
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

