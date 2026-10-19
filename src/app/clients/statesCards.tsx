"use client";

import React, { useLayoutEffect, useRef } from "react";
import { Building2, Clock, Users, Zap } from "lucide-react";
import { gsap } from "gsap";

import { Card, CardContent } from "@/components/ui/card";
import { ClientPriority } from "../enums/clientPriority.enum";
import type { ClientType } from "./page";

type Props = {
  clients: ClientType[];
};

type StatItemProps = {
  title: string;
  value: number;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
  badgeClass?: string;
};

function StatCardItem({
  title,
  value,
  change,
  icon: Icon,
  index,
  badgeClass,
}: StatItemProps) {
  const valueRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const element = valueRef.current;
    if (
      !element ||
      Number.isNaN(value) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
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
  }, [index, value]);

  return (
    <Card size="sm" className="min-w-0">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-v2-neutral-400">
            {title}
          </p>
          <p
            ref={valueRef}
            className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600"
          >
            {value.toLocaleString()}
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

export default function StatsCards({ clients }: Props) {
  const highPriority = clients.filter(
    (c) => Number(c.priority) === ClientPriority.HIGH
  ).length;

  const mediumPriority = clients.filter(
    (c) => Number(c.priority) === ClientPriority.MEDIUM
  ).length;

  const lowPriority = clients.filter(
    (c) => Number(c.priority) === ClientPriority.LOW
  ).length;

  const stats: Omit<StatItemProps, "index">[] = [
    {
      title: "Total Clients",
      value: clients.length,
      change: "Active platform accounts",
      icon: Building2,
      badgeClass: "bg-v2-neutral-200 text-v2-neutral-600",
    },
    {
      title: "High Priority",
      value: highPriority,
      change: "Strategic partner accounts",
      icon: Zap,
      badgeClass: "bg-rose-100 text-rose-700",
    },
    {
      title: "Medium Priority",
      value: mediumPriority,
      change: "Standard priority accounts",
      icon: Clock,
      badgeClass: "bg-amber-100 text-amber-700",
    },
    {
      title: "Low Priority",
      value: lowPriority,
      change: "Maintenance tier accounts",
      icon: Users,
      badgeClass: "bg-sky-100 text-sky-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <StatCardItem key={item.title} {...item} index={index} />
      ))}
    </div>
  );
}
