"use client";

import React, { useLayoutEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Clock, MessageSquareQuote } from "lucide-react";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import type { TicketItem } from "./types/ticket";

type Props = {
  tickets: TicketItem[];
  totalFromMeta?: number;
};

type StatItemProps = {
  title: string;
  value: number;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
  badgeClass?: string;
  isDecimal?: boolean;
  rawDisplay?: string;
};

function StatCardItem({
  title,
  value,
  change,
  icon: Icon,
  index,
  badgeClass,
  isDecimal = false,
  rawDisplay,
}: StatItemProps) {
  const valueRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const element = valueRef.current;
    if (
      !element ||
      Number.isNaN(value) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      if (element && rawDisplay) element.textContent = rawDisplay;
      return;
    }

    if (rawDisplay && isDecimal) {
      const counter = { val: 0 };
      const animation = gsap.to(counter, {
        val: value,
        duration: 0.85,
        delay: index * 0.05,
        ease: "power2.out",
        onUpdate: () => {
          element.textContent = `${counter.val.toFixed(1)} / 5`;
        },
      });
      return () => {
        animation.revert();
      };
    }

    const counter = { val: 0 };
    const animation = gsap.to(counter, {
      val: value,
      duration: 0.85,
      delay: index * 0.05,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = Math.round(counter.val).toLocaleString();
      },
    });

    return () => {
      animation.revert();
    };
  }, [index, isDecimal, rawDisplay, value]);

  return (
    <Card size="sm" className="min-w-0">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-v2-neutral-400">
            {title}
          </p>
          <p
            ref={valueRef}
            className="mt-2 text-2xl sm:text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600"
          >
            {rawDisplay ?? value.toLocaleString()}
          </p>
          <p className="mt-1.5 truncate text-xs text-v2-neutral-400">{change}</p>
        </div>
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${
            badgeClass ?? "bg-v2-neutral-200 text-v2-neutral-500"
          }`}
        >
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

export default function TicketStatsCards({ tickets, totalFromMeta }: Props) {
  const total = totalFromMeta ?? tickets.length;
  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "in_progress" || t.status === "in_review"
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCardItem
        title="Total Tickets"
        value={total}
        change={`${openCount} awaiting resolution`}
        icon={MessageSquareQuote}
        index={0}
        badgeClass="bg-v2-neutral-200 text-v2-neutral-600"
      />
      <StatCardItem
        title="Open Submissions"
        value={openCount}
        change="Initial triage required"
        icon={AlertCircle}
        index={1}
        badgeClass="bg-blue-500/15 text-blue-500"
      />
      <StatCardItem
        title="In Work & Review"
        value={inProgressCount}
        change="Active squad engagement"
        icon={Clock}
        index={2}
        badgeClass="bg-amber-500/15 text-amber-500"
      />
      <StatCardItem
        title="Resolved Deliveries"
        value={resolvedCount}
        change={
          total > 0
            ? `${Math.round((resolvedCount / total) * 100)}% resolution rate`
            : "No tickets recorded"
        }
        icon={CheckCircle2}
        index={3}
        badgeClass="bg-emerald-500/15 text-emerald-500"
      />
    </div>
  );
}
