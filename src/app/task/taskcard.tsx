"use client";
import React from "react";

export default function TaskCard({
  title,
  desc,
  due,
  priority,
  progress,
  status,
}: {
  title: string;
  desc: string;
  due: string;
  priority: string;
  progress: number;
  status: string;
}) {
  const progressWidth = `${Math.max(0, Math.min(100, progress))}%`;

  return (
    <>
      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{desc}</p>
          </div>
          <div>
            <span className="text-xs border px-2 py-1 rounded-full text-gray-700">
              {status}
            </span>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          <div>
            Due Date{" "}
            <span className="text-gray-900 font-medium ml-2">{due}</span>
          </div>

          <div className="mt-1">
            Priority{" "}
            <span className="ml-2 px-2 rounded-full text-xs text-white bg-red-500">
              {priority}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              style={{ width: progressWidth }}
              className="h-full bg-black"
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">{progress}%</div>
        </div>
      </div>
    </>
  );
}
