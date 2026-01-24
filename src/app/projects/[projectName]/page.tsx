"use client";
import { Button } from "@/global/buttons";
import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDetail() {
  const router = useRouter();
  const { projectName } = useParams() as { projectName: string };
  
  function handleRedirection() {
    router.replace(`/task?name=${encodeURIComponent(projectName)}`);
  }
  
  return (
    <div>
      <h1>Project Detail Page</h1>
      <Button className="mt-4" onClick={handleRedirection}>View Tasks</Button>
    </div>
  );
}
