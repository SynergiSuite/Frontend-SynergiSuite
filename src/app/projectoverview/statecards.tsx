"use client";
import React from "react";

interface ProjectCardsProps {
  filter: string;
  searchQuery: string;
}

export default function ProjectCards({ filter, searchQuery }: ProjectCardsProps) {
  const projects = [
    {
      title: "Website Redesign 2024",
      company: "TechCorp Solutions",
      intensity: "High",
      progress: 75,
      tasks: "15/20",
      status: "",
    },
    {
      title: "Mobile App Development",
      company: "Innovation Labs",
      intensity: "Medium",
      progress: 45,
      tasks: "23/50",
      status: "",
    },
    {
      title: "E-commerce Platform",
      company: "Global Retail Co",
      intensity: "High",
      progress: 90,
      tasks: "28/30",
      status: "Completed",
    },
    {
      title: "CRM Integration",
      company: "Business Solutions Inc",
      intensity: "Low",
      progress: 30,
      tasks: "6/20",
      status: "On Hold",
    },
    {
      title: "Data Analytics Dashboard",
      company: "Data Insights Corp",
      intensity: "Medium",
      progress: 60,
      tasks: "12/20",
      status: "",
    },
    {
      title: "Cloud Migration Project",
      company: "Tech Solutions Ltd",
      intensity: "High",
      progress: 15,
      tasks: "3/20",
      status: "At Risk",
    },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      filter === "All" || p.status === filter || (filter === "Active" && !p.status);
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIntensityColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "On Hold":
        return "bg-gray-100 text-gray-600";
      case "At Risk":
        return "bg-red-100 text-red-600";
      default:
        return "";
    }
  };

  return (
    <>
      {filteredProjects.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{p.title}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getIntensityColor(
                    p.intensity
                  )}`}
                >
                  {p.intensity} Intensity
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">{p.company}</p>

              <div className="mb-2 text-sm text-gray-700">Progress</div>
              <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${p.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{p.tasks} Tasks</span>
                <span>{p.progress}%</span>
              </div>

              {p.status && (
                <div
                  className={`mt-3 inline-block text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                    p.status
                  )}`}
                >
                  {p.status}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
