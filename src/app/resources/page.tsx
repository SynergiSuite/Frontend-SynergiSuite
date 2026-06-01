"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { gsap } from "gsap";

import SubHeader from "./subHeadingSearchbar";
import StatsCards, { ResourceType } from "./statesCards";
import ResourcesTable from "./resourcesTable";
import Pagination from "./footer";
import AddResourceModal from "./addResourceModal";
import EditResourceModal from "./editResourceModal";
import DeleteResourceModal from "./deleteResourceModal";
import ResourceDetailModal from "./resourceDetailModal";

const DEFAULT_RESOURCES: ResourceType[] = [
  {
    id: "1",
    name: "AWS Production Cluster",
    type: "Cloud Infrastructure",
    status: "Available",
    quantity: 3,
    cost: "$2,400/mo",
  },
  {
    id: "2",
    name: "NVIDIA H100 Workstation",
    type: "Hardware",
    status: "Allocated",
    quantity: 8,
    cost: "$8,500/unit",
  },
  {
    id: "3",
    name: "GitHub Enterprise Seats",
    type: "Software License",
    status: "Allocated",
    quantity: 150,
    cost: "$3,150/mo",
  },
  {
    id: "4",
    name: "Executive Boardroom A",
    type: "Office Space",
    status: "Under Maintenance",
    quantity: 1,
    cost: "$150/hr",
  },
  {
    id: "5",
    name: "Figma Professional Plan",
    type: "Software License",
    status: "Available",
    quantity: 50,
    cost: "$750/mo",
  },
];

export default function ResourcesPage() {
  // states
  const [resources, setResources] = useState<ResourceType[]>(DEFAULT_RESOURCES);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [detailResource, setDetailResource] = useState<ResourceType | null>(null);
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 4;

  // filtering
  const filteredResources = useMemo(() => {
    return resources.filter((res) =>
      [res.name, res.type, res.status, res.cost]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [resources, search]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  // GSAP stagger mount animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([".res-header-area", ".res-stats-area", ".res-table-area"], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // CRUD handlers
  const handleAddResource = async (payload: Omit<ResourceType, "id">) => {
    try {
      const newResource: ResourceType = {
        ...payload,
        id: String(Date.now()),
      };
      setResources((prev) => [newResource, ...prev]);
      toast.success("Resource successfully registered");
    } catch {
      toast.error("Failed to add resource");
    }
  };

  const handleEditResource = async (id: string, payload: Omit<ResourceType, "id">) => {
    try {
      setResources((prev) =>
        prev.map((res) => (res.id === id ? { ...res, ...payload } : res))
      );
      toast.success("Resource updated successfully");
    } catch {
      toast.error("Failed to update resource");
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      setResources((prev) => prev.filter((res) => res.id !== id));
      toast.success("Resource successfully expunged");
    } catch {
      toast.error("Failed to delete resource");
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-0 w-full overflow-hidden p-6 md:p-10">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.04] blur-[100px]" />

      <div className="relative z-10 flex min-h-[calc(100vh-140px)] flex-col gap-6 lg:gap-8">
        {/* Sub-Header Area */}
        <div className="res-header-area">
          <SubHeader
            search={search}
            setSearch={setSearch}
            onAddClick={() => setIsAddOpen(true)}
          />
        </div>

        {/* Stats Cards Area */}
        <div className="res-stats-area">
          <StatsCards resources={resources} />
        </div>

        {/* Table Area */}
        <div className="res-table-area flex flex-1 flex-col min-h-0">
          <div className="min-h-0 flex-1">
            <ResourcesTable
              resources={currentResources}
              onSelect={setDetailResource}
              onEdit={setSelectedResource}
              onDelete={setDeleteResourceId}
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* Modals & Dialogs Portal */}
      <AnimatePresence>
        {isAddOpen ? (
          <AddResourceModal
            onClose={() => setIsAddOpen(false)}
            onSave={handleAddResource}
          />
        ) : null}

        {selectedResource ? (
          <EditResourceModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
            onSave={handleEditResource}
          />
        ) : null}

        {detailResource ? (
          <ResourceDetailModal
            resource={detailResource}
            open={detailResource !== null}
            onClose={() => setDetailResource(null)}
          />
        ) : null}

        {deleteResourceId ? (
          <DeleteResourceModal
            open={deleteResourceId !== null}
            resourceId={deleteResourceId}
            onOpenChange={(open) => {
              if (!open) setDeleteResourceId(null);
            }}
            onConfirm={async (id) => {
              await handleDeleteResource(id);
              setDeleteResourceId(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
