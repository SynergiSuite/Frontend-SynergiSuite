"use client";
import React, { useEffect, useState } from "react";
import Milestones from "./milestones";
import { getMilestone } from "../apis/getMilestones";
import { Milestone } from "../schemas/milestone";
import { Task } from "../task/schemas/task";

type MiddleSectionProps = {
  projectId?: string;
  availableTasks?: Task[];
  canManageMilestones?: boolean;
  refreshKey?: number;
  onLoadingChange?: (loading: boolean) => void;
};

export default function MiddleSection({
  projectId,
  availableTasks = [],
  canManageMilestones = false,
  refreshKey = 0,
  onLoadingChange,
}: MiddleSectionProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const normalizeMilestones = (response: unknown): Milestone[] => {
    if (Array.isArray(response)) {
      return response as Milestone[];
    }

    if (
      response &&
      typeof response === "object" &&
      "milestones" in response &&
      Array.isArray((response as { milestones: unknown }).milestones)
    ) {
      return (response as { milestones: Milestone[] }).milestones;
    }

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray((response as { data: unknown }).data)
    ) {
      return (response as { data: Milestone[] }).data;
    }

    return [];
  };

  const fetchMilestones = React.useCallback(async () => {
    if (!projectId) {
      setMilestones([]);
      return;
    }
    try {
      onLoadingChange?.(true);
      const response = await getMilestone(projectId);
      setMilestones(normalizeMilestones(response));
    } finally {
      onLoadingChange?.(false);
    }
  }, [projectId, onLoadingChange]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones, refreshKey]);

  return (
    <div className="w-full min-w-0">
      <Milestones
        projectId={projectId}
        milestones={milestones}
        availableTasks={availableTasks}
        canManageMilestones={canManageMilestones}
        onRefresh={fetchMilestones}
      />
    </div>
  );
}
