"use client";
import React, { useState } from "react";
import { Trash } from "lucide-react";

export default function TaskCard({
  id,
  title,
  desc,
  due,
  priority,
  status,
  assigned_to,
  onClick,
  onDeleteClick,
  draggable,
  onDragStart,
  onDragEnd,
}: {
  id: string;
  title: string;
  desc: string;
  due: string;
  priority: string;
  status: string;
  assigned_to: string[];
  onClick?: () => void;
  onDeleteClick?: (taskId: string) => void;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}) {
  const normalizedStatus = status?.trim().toLowerCase();
  const statusStyles =
    normalizedStatus === "completed"
      ? "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200"
      : normalizedStatus === "blocked"
        ? "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200"
        : normalizedStatus === "in_progress"
          ? "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200"
          : "text-gray-700 border";
  const normalizedPriority = priority?.trim().toLowerCase();
  const priorityStyles =
    normalizedPriority === "low"
      ? "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200"
      : normalizedPriority === "medium"
        ? "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200"
      : normalizedPriority === "high"
          ? "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200"
          : "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200";
  const isClickable = typeof onClick === "function";
  const [isTrashActive, setIsTrashActive] = useState(false);

  return (
    <>
      <div
        className={`bg-white border rounded-lg p-4 h-full flex flex-col ${
          isClickable ? "cursor-pointer" : ""
        }`}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-ellipsis overflow-hidden max-w-[180px] text-gray-600 mt-1">{desc}</p>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles}`}
            >
              {status}
            </span>
            <button
              type="button"
              aria-pressed={isTrashActive}
              aria-label={isTrashActive ? "Trash marked" : "Mark as trash"}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                isTrashActive
                  ? "border-red-500 text-red-600"
                  : "border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600"
              }`}
              onClick={(event) => {
                event.stopPropagation();
                setIsTrashActive((prev) => !prev);
                onDeleteClick?.(id);
              }}
            >
              <Trash className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          <div>
            Due Date{" "}
            <span className="text-gray-900 font-medium ml-2">{due}</span>
          </div>

          <div className="mt-1">
            Priority{" "}
            <span
              className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${priorityStyles}`}
            >
              {priority}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">
            Assigned to: {assigned_to?.length ? assigned_to?.join(", ") : "Unassigned"}
          </div>
        </div>
      </div>
    </>
  );
}
