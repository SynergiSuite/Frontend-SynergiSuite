"use client";
import React, { useEffect, useState } from "react";
import Milestones from "./milestones";
import { getMilestone } from "../apis/getMilestones";
import { Milestone } from "../schemas/milestone";

type MiddleSectionProps = {
  projectId?: string;
  refreshKey?: number;
  onLoadingChange?: (loading: boolean) => void;
};

const MiddleSection = ({
  projectId,
  refreshKey = 0,
  onLoadingChange,
}: MiddleSectionProps) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const fetchMilestones = async () => {
    if (!projectId) {
      return;
    }
    try {
      onLoadingChange?.(true);
      const response = await getMilestone(projectId);
      setMilestones(response);
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
        <Milestones milestones={milestones} onRefresh={fetchMilestones} />
      </div>
    </>
  );
};

export default MiddleSection;
