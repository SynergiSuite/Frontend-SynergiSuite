"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: string;
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseYMD(str?: string): Date | null {
  if (!str) return null;
  const parts = str.split("-").map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function getRelativeDateLabel(date: Date): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < -1) return `${Math.abs(diffDays)}d ago`;
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) {
    const weeks = Math.round(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? "s" : ""}`;
  }
  const months = Math.round(diffDays / 30);
  return `In ${months} month${months > 1 ? "s" : ""}`;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select target date",
  disabled = false,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev" | "none">("none");

  const selectedDate = parseYMD(value);

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const daysGridRef = useRef<HTMLDivElement>(null);

  // Sync currentMonth when value changes externally
  useEffect(() => {
    const parsed = parseYMD(value);
    if (parsed) {
      setCurrentMonth(new Date(parsed));
    }
  }, [value]);

  // GSAP Entrance Animation when panel opens
  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: -6, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );

      if (daysGridRef.current) {
        gsap.fromTo(
          daysGridRef.current.children,
          { autoAlpha: 0, scale: 0.82 },
          {
            autoAlpha: 1,
            scale: 1,
            stagger: 0.006,
            duration: 0.2,
            ease: "back.out(1.5)",
            delay: 0.05,
          }
        );
      }
    }, panelRef);

    return () => ctx.revert();
  }, [isOpen]);

  // GSAP Slide animation when switching months
  useLayoutEffect(() => {
    if (!isOpen || slideDirection === "none" || !daysGridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xOffset = slideDirection === "next" ? 14 : -14;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        daysGridRef.current,
        { autoAlpha: 0.3, x: xOffset },
        { autoAlpha: 1, x: 0, duration: 0.22, ease: "power2.out" }
      );
    }, daysGridRef);

    return () => ctx.revert();
  }, [currentMonth, slideDirection, isOpen]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideDirection("prev");
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideDirection("next");
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(year, month, day);
    onChange(formatToYMD(newDate));
    setIsOpen(false);
  };

  const handleQuickPreset = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    setSlideDirection("none");
    onChange(formatToYMD(target));
    setCurrentMonth(new Date(target));
    setIsOpen(false);
  };

  const handleEndOfQuarter = () => {
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const endQuarterMonth = (currentQuarter + 1) * 3;
    const lastDay = new Date(now.getFullYear(), endQuarterMonth, 0);
    setSlideDirection("none");
    onChange(formatToYMD(lastDay));
    setCurrentMonth(new Date(lastDay));
    setIsOpen(false);
  };

  // Compute Calendar Grid
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Prev month filler
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: true,
    });
  }

  // Next month filler to complete rows (multiples of 7)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: false,
      isNext: true,
    });
  }

  const todayStr = formatToYMD(new Date());
  const relativeLabel = selectedDate ? getRelativeDateLabel(selectedDate) : null;

  return (
    <div ref={containerRef} className={`space-y-2.5 w-full ${className}`}>
      {/* Date Trigger Bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`flex h-11 flex-1 items-center justify-between rounded-xl border bg-v2-neutral-100 px-3.5 text-xs text-v2-neutral-600 outline-none transition-all duration-200 cursor-pointer ${
            isOpen
              ? "border-v2-neutral-500 ring-[3px] ring-v2-neutral-400/20"
              : "border-v2-neutral-300 hover:border-v2-neutral-400"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CalendarIcon className="size-4 text-v2-neutral-400 shrink-0" />
            {selectedDate ? (
              <span className="font-semibold text-v2-neutral-600 truncate">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ) : (
              <span className="text-v2-neutral-400">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {relativeLabel && (
              <span className="inline-flex items-center gap-1 rounded-md border border-v2-neutral-300 bg-v2-neutral-200/80 px-2.5 py-0.5 text-[10px] font-semibold text-v2-neutral-600">
                <Clock className="size-3 text-v2-neutral-500" />
                {relativeLabel}
              </span>
            )}
            <ChevronDown
              className={`size-4 text-v2-neutral-400 transition-transform duration-300 ease-out ${
                isOpen ? "rotate-180 text-v2-neutral-600" : ""
              }`}
            />
          </div>
        </button>

        {value && (
          <button
            type="button"
            title="Clear date"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-400 hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Expandable Calendar Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="rounded-2xl border border-v2-neutral-300 bg-v2-neutral-100 p-4 shadow-sm select-none"
        >
          {/* Quick Shortcuts Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-v2-neutral-200">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-v2-neutral-400 mr-1">
              <Sparkles className="size-3 text-v2-neutral-500" />
              Quick:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPreset(7)}
              className="rounded-lg border border-v2-neutral-300 bg-v2-neutral-200/50 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              +1 Wk
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(14)}
              className="rounded-lg border border-v2-neutral-300 bg-v2-neutral-200/50 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              +2 Wks
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(30)}
              className="rounded-lg border border-v2-neutral-300 bg-v2-neutral-200/50 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              +1 Mo
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(90)}
              className="rounded-lg border border-v2-neutral-300 bg-v2-neutral-200/50 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              +3 Mos
            </button>
            <button
              type="button"
              onClick={handleEndOfQuarter}
              className="rounded-lg border border-v2-neutral-300 bg-v2-neutral-200/50 px-2.5 py-1 text-[11px] font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              End Qtr
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between pt-3 pb-2">
            <h4 className="text-xs font-bold text-v2-neutral-600">
              {MONTH_NAMES[month]} {year}
            </h4>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="grid size-7 place-items-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="grid size-7 place-items-center rounded-lg border border-v2-neutral-300 bg-v2-neutral-100 text-v2-neutral-500 hover:bg-v2-neutral-200 hover:text-v2-neutral-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center py-1">
            {WEEKDAYS.map((wd) => (
              <span
                key={wd}
                className="text-[10px] font-semibold uppercase text-v2-neutral-400"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Day Grid with GSAP ref */}
          <div ref={daysGridRef} className="grid grid-cols-7 gap-1 pt-1">
            {calendarDays.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`filler-${index}`}
                    className="grid size-9 place-items-center rounded-lg text-xs font-normal text-v2-neutral-300 select-none opacity-40"
                  >
                    {item.day}
                  </div>
                );
              }

              const thisDateStr = formatToYMD(new Date(year, month, item.day));
              const isSelected = value === thisDateStr;
              const isToday = thisDateStr === todayStr;

              return (
                <button
                  key={`day-${item.day}`}
                  type="button"
                  onClick={() => handleSelectDay(item.day)}
                  className={`grid size-9 place-items-center rounded-lg text-xs transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "bg-v2-neutral-600 text-v2-neutral-100 font-bold shadow-sm"
                      : isToday
                      ? "border border-v2-neutral-400 bg-v2-neutral-200/60 font-semibold text-v2-neutral-600 hover:bg-v2-neutral-300"
                      : "text-v2-neutral-600 hover:bg-v2-neutral-200 font-medium"
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-v2-neutral-200 text-xs">
            <button
              type="button"
              onClick={() => handleQuickPreset(0)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-v2-neutral-500 hover:text-v2-neutral-600 transition-colors hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="size-3" />
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-v2-neutral-300 bg-v2-neutral-200/60 px-3 py-1 text-[11px] font-semibold text-v2-neutral-600 hover:bg-v2-neutral-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
