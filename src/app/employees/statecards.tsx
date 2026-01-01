import React from "react";
import { StatsCardProps } from "./schemas/stateCard";

function StatsCard({ title, value, change }: StatsCardProps) {
  return (
    <>
      <div className="bg-white border rounded-lg p-4 shadow-sm flex-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>

        {/* 👇 Only show value if it's passed */}
        {value !== undefined && (
          <p className="text-2xl font-bold mt-1">{value}</p>
        )}

        {/* 👇 Only show change if it's passed */}
        {change && <p className="text-xs text-gray-400 mt-1">{change}</p>}
      </div>
    </>
  );
}

export default function StatsCards({ stats }: { stats: StatsCardProps[] }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>
    </>
  );
}
