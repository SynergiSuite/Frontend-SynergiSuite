"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Projects } from "./schemas/project";
import { PriorityLevel } from "./schemas/priority.enum";
import { CookieManager } from "@/lib/cookieManager";
interface ProjectCardsProps {
  filter: string;
  searchQuery: string;
  projects: Projects[];
}

// Helper function to get priority level text
const getPriorityText = (priority: number): string => {
  if (priority === 1) return "High";
  if (priority === 2) return "Medium";
  return "Low";
};

// Helper function to calculate completion percentage
const calculateProgress = (tasks: any[]): number => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(
    (task) => String(task?.status ?? "").toLowerCase() === "completed"
  ).length;
  return Math.round((completed / tasks.length) * 100);
};

// ✅ Use a hoisted function declaration so it can be called above/below safely
function getStatus(priority: PriorityLevel): string {
  switch (priority) {
    case PriorityLevel.InQueue:
      return "In Queue";
    case PriorityLevel.InProgress:
      return "In Progress";
    case PriorityLevel.Completed:
      return "Completed";
    case PriorityLevel.OnHold:
      return "On Hold";
    case PriorityLevel.AtRisk:
      return "At Risk";
    default:
      return "In Queue";
  }
}

const handleProjectDetail = (projectName: string) => {
  
};

export default function ProjectCards({ filter, searchQuery, projects }: ProjectCardsProps) {
  const router = useRouter();
  const filteredProjects = projects.filter((project) => {
    // compute once and compare with normalized values
    const statusText = getStatus(project.status);
    const selected = filter || "All";

    const matchesFilter =
      selected === "All" || statusText === selected;

    const q = (searchQuery || "").toLowerCase();
    const projectName = (project.name || "").toLowerCase();
    const clientName = (project.client?.name || "").toLowerCase();
    const clientCompany = (project.client?.company || "").toLowerCase();

    const matchesSearch =
      projectName.includes(q) || clientName.includes(q) || clientCompany.includes(q);

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-600";
      case 2:
        return "bg-green-100 text-green-600";
      case 3:
        return "bg-blue-100 text-blue-600";
      case 4:
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getClientCompany = (company: string | undefined): string => {
    if (!company) return "No Client Company";
    return company || "No Client Company";
  };

  const handleProjectDetail = (projectName: string, clientName: string, projectID: string) => {
    const safeName = encodeURIComponent(projectName || "");
    CookieManager("set", "client-name", clientName);
    CookieManager("set", "project-id", projectID);
    router.push(`/projects/${safeName}/overview`);
  };

  const gridKey = `${filter || "all"}-${searchQuery || ""}`;

  return (
    <div className="mx-auto w-full px-0 py-4 sm:px-1 sm:py-6">
      {filteredProjects.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">No projects found matching your criteria.</p>
      ) : (
        <AnimatePresence mode="sync">
          <motion.div
            key={gridKey}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.05 },
              },
            }}
          >
            {filteredProjects.map((project) => {
              const progress = calculateProgress(project.tasks);

              return (
                <motion.div
                  key={project.id}
                  onClick={() => handleProjectDetail(project.name, project.client?.name || "No Client", project.id)}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.25, ease: "easeOut" },
                    },
                  }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 font-semibold text-gray-800">{project.name}</h3>
                  </div>

                  <p className="mb-4 text-sm text-gray-500 break-words">
                    {getClientCompany(project.client?.company)}
                  </p>

                  <div className="mb-2 text-sm text-gray-700">Progress</div>
                  <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-2 rounded-full bg-slate-800"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {project.tasks?.filter((t: any) => String(t?.status ?? "").toLowerCase() === "completed").length || 0}
                      /{project.tasks?.length || 0} Tasks
                    </span>
                    <span className="shrink-0">{progress}%</span>
                  </div>

                  <div
                    className={`mt-3 inline-block text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatus(project.status)}
                  </div>

                  {project.teams && project.teams.length > 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                      {project.teams.length} Team assigned
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
