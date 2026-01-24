"use client";
import React, { useEffect, useState } from "react";

import TeamMembers from "./teamMembers";
import CalendarWidget from "./calendar";
import QuickActions from "./quickaction";
import { useSearchParams } from "next/navigation";
import { CookieManager } from "@/lib/cookieManager";


export default function RightSidebar() {

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const setProject = () => {
      const project = searchParams.get('name');
      const client = CookieManager("get", "client-name");
      setProjectName(project || '');
      setClientName(client as string);
    };
    setProject();
  }, [searchParams]);
  return (
    <>
      <aside className="bg-white p-6 flex flex-col gap-6">
        <TeamMembers projectName={projectName} clientName={clientName} />
        <CalendarWidget />
        <QuickActions />
      </aside>
    </>
  );
}

