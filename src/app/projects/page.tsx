"use client";
import React, { useState, useEffect, useCallback } from "react";
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

  return (
    <>
      {isLoading? <LoaderCustom/> :(
        <div className="min-h-full">
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
      )}
    </>
  );
}
