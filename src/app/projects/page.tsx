"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
import Header from "./header";
import ProjectCards from "./statecards";
import { Projects } from "./schemas/project";
import LoaderCustom from "@/components/ui/loader-custom";
import { getProjectsApi } from "./apis/getProjectsApi";
import { getTeamsApi } from "./apis/getAllTeamsApi";
import { Team } from "./schemas/team"
import { getClientsApi } from "./apis/getAllClients";
import { Client } from "./schemas/client";
import { toast } from "sonner";

export default function Page() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Projects[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProjectsApi();
      setProjects(res);
    } catch (error) {
      toast.error("Failed to fetch projects" + error);
    } finally {
      setIsLoading(false)
    }
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  useEffect(() => {
    const getTeams = async () => {
      setIsLoading(true);
      try {
        const res = await getTeamsApi();
        setTeams(res);
      } catch (error) {
        toast.error("Failed to fetch teams" + error);
      } finally {
        setIsLoading(false)
      }
    }
    getTeams();
  }, []);

  useEffect(() => {
    const getClients = async () => {
      setIsLoading(true);
      try {
        const res = await getClientsApi();
        setClients(res);
      } catch (error) {
        toast.error("Failed to fetch clients" + error);
      } finally {
        setIsLoading(false)
      }
    }
    getClients();
  }, []);

  // GSAP Page Entrance Animation
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const animElements = containerRef.current.querySelectorAll(".project-animate-item");
      if (animElements.length > 0) {
        gsap.killTweensOf(animElements);
        gsap.fromTo(
          animElements,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          }
        );
      }
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? <LoaderCustom /> : (
        <div ref={containerRef} className="relative min-h-screen text-white bg-[#030114] px-4 py-6 sm:px-6 lg:px-8 overflow-hidden">
          {/* Accent radial glow overlay */}
          <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-[radial-gradient(circle_at_top_left,rgba(82,113,255,0.06),transparent_55%)] pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-[400px] w-[400px] bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.04),transparent_50%)] pointer-events-none" />

          <div className="relative z-10">
            <Header
              filter={filter}
              setFilter={setFilter}
              setSearchQuery={setSearchQuery}
              teams={teams}
              clients={clients}
              onProjectCreated={getProjects}
            />
            <ProjectCards filter={filter} searchQuery={searchQuery} projects={projects} />
          </div>
        </div>
      )}
    </>
  );
}
