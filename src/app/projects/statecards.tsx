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
      case 0: // In Queue
        return "bg-[#5271ff]/10 text-[#5271ff] border border-[#5271ff]/20";
      case 1: // In Progress
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case 2: // Completed
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case 3: // On Hold
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case 4: // At Risk
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-white/[0.04] text-white/60 border border-white/[0.08]";
    }
  };

  const getClientCompany = (company: string | undefined): string => {
    if (!company) return "No Client Company";
    return company;
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
        <p className="mt-10 text-center text-white/40">No projects found matching your criteria.</p>
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
                  className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-[#0a0826]/40 backdrop-blur-md p-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition hover:border-[#5271ff]/30 hover:shadow-[0_0_20px_rgba(82,113,255,0.15)] sm:p-5"
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
                    <h3 className="line-clamp-2 font-semibold text-white group-hover:text-[#5271ff] transition-colors">{project.name}</h3>
                  </div>

                  <p className="mb-4 text-sm text-white/50 break-words font-medium">
                    {getClientCompany(project.client?.company)}
                  </p>

                  <div className="mb-2 text-sm text-white/70 font-medium">Progress</div>
                  <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.06] border border-white/[0.04]">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-[#5271ff] to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/60 font-medium">
                    <span>
                      {project.tasks?.filter((t: any) => String(t?.status ?? "").toLowerCase() === "completed").length || 0}
                      /{project.tasks?.length || 0} Tasks
                    </span>
                    <span className="shrink-0">{progress}%</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatus(project.status)}
                    </div>

                    {project.teams && project.teams.length > 0 && (
                      <div className="text-xs text-white/40 font-medium">
                        {project.teams.length} {project.teams.length === 1 ? "Team" : "Teams"} assigned
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
