"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Design", Completed: 40, Ongoing: 10 },
  { name: "Development", Completed: 70, Ongoing: 15 },
  { name: "Marketing", Completed: 25, Ongoing: 8 },
  { name: "Sales", Completed: 50, Ongoing: 18 },
];

export default function TeamActivitiesChart() {
  return (
    <>
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Team Activities</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Completed" fill="#f87171" />
            <Bar dataKey="Ongoing" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
