"use client";
import React from "react";

type StateCardProps = {
  title: string;
  value?: number | string; 
  change?: string;
};

function StateCard({ title, value, change }: StateCardProps) {
  return (
    <>
      <div className="bg-white border rounded-lg p-4 shadow-sm flex-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>

        
        {value !== undefined && (
          <p className="text-2xl font-bold mt-1">{value}</p>
        )}

        
        {change && <p className="text-xs text-gray-400 mt-1">{change}</p>}
      </div>
    </>
  );
}

export default function StateCards({ states }: { states: StateCardProps[] }) {
  return (
    <>
      <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {states.map((state) => (
          <StateCard
            key={state.title}
            title={state.title}
            value={state.value}
            change={state.change}
          />
        ))}
      </div>
    </>
  );
}
