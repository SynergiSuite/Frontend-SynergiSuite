"use client";

import { useLayoutEffect, useRef } from "react";
import { CheckSquare, Clock, FolderKanban, Users } from "lucide-react";
import { gsap } from "gsap";

import { Card, CardContent } from "@/components/ui/card";

export type StateCardProps = {
  title: string;
  value?: number | string;
  change?: string;
};

const ICONS = [Users, FolderKanban, Clock, CheckSquare];

function StateCardItem({
  title,
  value,
  change,
  index,
}: StateCardProps & { index: number }) {
  const valueRef = useRef<HTMLParagraphElement>(null);
  const Icon = ICONS[index % ICONS.length];
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value ?? "0"), 10);

  useLayoutEffect(() => {
    const element = valueRef.current;

    if (
      !element ||
      Number.isNaN(numericValue) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const counter = { value: 0 };
    const animation = gsap.to(counter, {
      value: numericValue,
      duration: 0.9,
      delay: index * 0.055,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = Math.round(counter.value).toLocaleString();
      },
    });

    return () => {
      animation.revert();
    };
  }, [index, numericValue]);

  return (
    <Card size="sm" className="min-w-0">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-v2-neutral-400">{title}</p>
          <p
            ref={valueRef}
            className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600"
          >
            {Number.isNaN(numericValue) ? value ?? "—" : numericValue.toLocaleString()}
          </p>
          {change && (
            <p className="mt-1.5 truncate text-xs text-v2-neutral-400">{change}</p>
          )}
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-500">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

export default function StateCards({ states }: { states: StateCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {states.map((state, index) => (
        <StateCardItem
          key={state.title}
          title={state.title}
          value={state.value}
          change={state.change}
          index={index}
        />
      ))}
    </div>
  );
}
