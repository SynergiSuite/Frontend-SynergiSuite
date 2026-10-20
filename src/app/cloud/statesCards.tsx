"use client";

import React, { useLayoutEffect, useRef } from "react";
import {
  FileText,
  HardDrive,
  FolderKanban,
  Image as ImageIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";

export type FileType = {
  id: string;
  name: string;
  category: "Document" | "Image" | "Media" | "Archive" | "Other";
  size: string;
  uploadedAt: string;
  sizeBytes: number;
  userLabel?: string;
  labelType?: number;
  teamId?: string;
  projectId?: string;
  isClient?: boolean;
  forClient?: boolean;
  referenceType?: string;
  referenceId?: string;
};

type Props = {
  files: FileType[];
};

type StatItemProps = {
  title: string;
  value: number;
  displayValue?: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
  badgeClass?: string;
};

function StatCardItem({
  title,
  value,
  displayValue,
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
      displayValue ||
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
  }, [displayValue, index, value]);

  return (
    <Card size="sm" className="min-w-0">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-v2-neutral-400">
            {title}
          </p>
          <p
            ref={valueRef}
            className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600 truncate"
          >
            {displayValue ?? value.toLocaleString()}
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

export default function StatsCards({ files }: Props) {
  const totalFiles = files.length;
  const totalBytes = files.reduce((sum, f) => sum + (f.sizeBytes || 0), 0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formattedUsed = formatBytes(totalBytes);
  const docsCount = files.filter((f) => f.category === "Document").length;
  const mediaCount = files.filter(
    (f) => f.category === "Image" || f.category === "Media"
  ).length;

  const stats: Omit<StatItemProps, "index">[] = [
    {
      title: "Total Assets",
      value: totalFiles,
      change: "Indexed in cloud registry",
      icon: FolderKanban,
      badgeClass: "bg-v2-neutral-200 text-v2-neutral-600",
    },
    {
      title: "Storage Consumed",
      value: totalBytes,
      displayValue: formattedUsed,
      change: "Standard 10 GB limit",
      icon: HardDrive,
      badgeClass: "bg-sky-100 text-sky-700",
    },
    {
      title: "Documents",
      value: docsCount,
      change: "PDFs, spreadsheets, docs",
      icon: FileText,
      badgeClass: "bg-amber-100 text-amber-700",
    },
    {
      title: "Visuals & Media",
      value: mediaCount,
      change: "Images, videos & audio",
      icon: ImageIcon,
      badgeClass: "bg-emerald-100 text-emerald-700",
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
