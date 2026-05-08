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

const MiddleSection = ({
  projectId,
  availableTasks = [],
  canManageMilestones = false,
  refreshKey = 0,
  onLoadingChange,
}: MiddleSectionProps) => {
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

  const fetchMilestones = async () => {
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
  };

  useEffect(() => {
    fetchMilestones();
  }, [projectId, refreshKey]);

  return (
    <>
      <div className="w-full px-6 lg:w-2/4">
        <Milestones
          milestones={milestones}
          availableTasks={availableTasks}
          canManageMilestones={canManageMilestones}
          onRefresh={fetchMilestones}
        />
      </div>
    </>
  );
};

export default MiddleSection;
