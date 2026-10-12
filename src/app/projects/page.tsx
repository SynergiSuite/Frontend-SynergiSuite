import type { Metadata } from "next";

import ProjectsPanel from "./projects-panel";

export const metadata: Metadata = {
  title: "Projects | SynergiSuite",
  description:
    "Track project lifecycles, manage milestones, assign squads, and monitor execution progress in SynergiSuite.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProjectsPage() {
  return <ProjectsPanel />;
}
