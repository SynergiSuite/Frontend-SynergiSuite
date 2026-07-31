"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  SendHorizonal,
  User,
  TrendingUp,
  Users,
  Building2,
  FolderKanban,
  Sparkles,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { getProjectsApi } from "@/app/projects/apis/getProjectsApi";
import { getTeamsApi } from "@/app/teams/apis/getTeamsApi";
import getEmployeeAnalyticsApi from "@/app/analytics/apis/getEmployeeAnalyticsApi";
import { getAnalyticsIndexesApi } from "@/app/analytics/apis/getAnalyticsIndexesApi";

interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (selectedId?: string) => void | Promise<void>;
}

export type SlashCategory = "employee" | "business" | "team" | "client" | "project";

export interface CategoryOption {
  id: SlashCategory;
  label: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export interface EntityItem {
  id: string;
  name: string;
  subtitle?: string;
  category: SlashCategory;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: "employee",
    label: "employee",
    title: "Employee",
    subtitle: "Individual staff productivity & telemetry",
    icon: User,
  },
  {
    id: "business",
    label: "business",
    title: "Business",
    subtitle: "Company financial & growth trajectory",
    icon: TrendingUp,
  },
  {
    id: "team",
    label: "team",
    title: "Team",
    subtitle: "Squad execution velocity & workload",
    icon: Users,
  },
  {
    id: "client",
    label: "client",
    title: "Client",
    subtitle: "Client account portfolio & health",
    icon: Building2,
  },
  {
    id: "project",
    label: "project",
    title: "Project",
    subtitle: "Project deliverables & status SLA",
    icon: FolderKanban,
  },
];

const fetchEntitiesForCategory = async (category: SlashCategory): Promise<EntityItem[]> => {
  try {
    if (category === "project") {
      const projects = await getProjectsApi();
      if (Array.isArray(projects)) {
        return projects.map((p) => ({
          id: String(p.id),
          name: p.name,
          subtitle: p.description ? `${p.description.slice(0, 35)}...` : "Active Project",
          category: "project",
        }));
      }
    } else if (category === "team") {
      const res = await getTeamsApi();
      const teamsList = Array.isArray(res) ? res : res?.teams || [];
      return teamsList.map((t: any) => ({
        id: String(t.id || t.team_id || t.teamId || t.name),
        name: t.name || t.team_name || t.teamName || "Team",
        subtitle: `${t.membersCount || t.members?.length || 0} squad members`,
        category: "team",
      }));
    } else if (category === "employee") {
      const res = await getEmployeeAnalyticsApi();
      const empList = res.employees || [];
      return empList.map((e) => ({
        id: String(e.userId),
        name: e.userName,
        subtitle: e.userEmail || e.role?.name || "Employee Profile",
        category: "employee",
      }));
    } else if (category === "client") {
      const res = await getAnalyticsIndexesApi();
      const clientList = res.data?.clients || [];
      return clientList.map((c) => ({
        id: String(c.clientId || c.clientEmail || c.clientName),
        name: c.clientName,
        subtitle: c.company || c.clientEmail || "Enterprise Client",
        category: "client",
      }));
    } else if (category === "business") {
      return [
        { id: "gen", name: "General Business", subtitle: "Overall performance summary", category: "business" },
        { id: "growth", name: "Growth Telemetry", subtitle: "Quarterly trajectory & metrics", category: "business" },
        { id: "fin", name: "Financial Quarterly", subtitle: "Revenue & contract output", category: "business" },
        { id: "velocity", name: "Performance Velocity", subtitle: "Workspace execution SLA", category: "business" },
      ];
    }
  } catch (err) {
    console.error(`Failed to load entities for ${category}:`, err);
  }
  return [];
};

const MessageInput = ({ input, setInput, sendMessage }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Slash Command Autocomplete States
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownMode, setDropdownMode] = useState<"category" | "entity" | null>(null);
  const [command, setCommand] = useState<string>("");
  const [category, setCategory] = useState<SlashCategory | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(undefined);

  const activeCategoryRef = useRef<string>("");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  // Detect slash commands when typing
  useEffect(() => {
    // 1. Check if input triggers Category selection (e.g. "/report", "/status", "/progress")
    const categoryMatch = input.match(/(?:^|\s)\/(report|status|progress)\b$/i);
    if (categoryMatch) {
      const matchedCmd = categoryMatch[1].toLowerCase();
      setCommand(matchedCmd);
      setDropdownMode("category");
      setIsOpen(true);
      setSelectedIndex(0);
      return;
    }

    // 2. Check if input triggers Entity selection (e.g. "/report_employee", "/status_project alex")
    const entityMatch = input.match(
      /(?:^|\s)\/(report|status|progress)_(employee|business|team|client|project)(?:\s+(.*))?$/i
    );

    if (entityMatch) {
      const matchedCmd = entityMatch[1].toLowerCase();
      const matchedCat = entityMatch[2].toLowerCase() as SlashCategory;
      const query = entityMatch[3] || "";

      setCommand(matchedCmd);
      setCategory(matchedCat);
      setSearchQuery(query);
      setDropdownMode("entity");
      setIsOpen(true);
      setSelectedIndex(0);

      if (activeCategoryRef.current !== matchedCat) {
        activeCategoryRef.current = matchedCat;
        setIsLoadingEntities(true);
        fetchEntitiesForCategory(matchedCat)
          .then((data) => setEntities(data))
          .finally(() => setIsLoadingEntities(false));
      }
      return;
    }

    // Default: Close dropdown
    setIsOpen(false);
    setDropdownMode(null);
    activeCategoryRef.current = "";
  }, [input]);

  // Handle selecting a category from 1st Dropdown
  const handleSelectCategory = (catLabel: SlashCategory) => {
    const regex = new RegExp(`/(report|status|progress)\\b`, "i");
    const updatedInput = input.replace(regex, `/$1_${catLabel} `);
    setInput(updatedInput);

    setCategory(catLabel);
    setDropdownMode("entity");
    setSelectedIndex(0);

    activeCategoryRef.current = catLabel;
    setIsLoadingEntities(true);
    fetchEntitiesForCategory(catLabel)
      .then((data) => setEntities(data))
      .finally(() => setIsLoadingEntities(false));

    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  // Filter entities by search query typed after category
  const filteredEntities = entities.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return e.name.toLowerCase().includes(q) || (e.subtitle && e.subtitle.toLowerCase().includes(q));
  });

  // Handle selecting an entity from 2nd Dropdown
  const handleSelectEntity = (item: EntityItem) => {
    const regex = new RegExp(
      `/(report|status|progress)_(employee|business|team|client|project)(?:\\s+.*)?$`,
      "i"
    );
    const updatedInput = input.replace(regex, `/$1_$2 ${item.name}`);
    setInput(updatedInput);
    setSelectedEntityId(item.id);

    setIsOpen(false);
    setDropdownMode(null);
    activeCategoryRef.current = "";

    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSendMessage = () => {
    sendMessage(selectedEntityId);
    setSelectedEntityId(undefined);
  };

  // Keyboard navigation inside dropdown menu
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isOpen) {
      const itemsCount =
        dropdownMode === "category" ? CATEGORY_OPTIONS.length : filteredEntities.length;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (itemsCount > 0 ? (prev + 1) % itemsCount : 0));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (itemsCount > 0 ? (prev - 1 + itemsCount) % itemsCount : 0));
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        if (itemsCount > 0) {
          event.preventDefault();
          if (dropdownMode === "category") {
            const chosen = CATEGORY_OPTIONS[selectedIndex];
            if (chosen) handleSelectCategory(chosen.id);
          } else if (dropdownMode === "entity") {
            const chosen = filteredEntities[selectedIndex];
            if (chosen) handleSelectEntity(chosen);
          }
          return;
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full border-t border-white/[0.08] bg-transparent px-3 py-3 sm:px-5 sm:py-4">
      {/* Floating Autocomplete Slash Command Popup Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-3 right-3 sm:left-5 sm:right-5 mb-3 max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-[#0c0a2f]/95 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-50 space-y-1 custom-scrollbar">
          {/* Header Banner */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.08] text-[11px] font-bold uppercase tracking-wider text-white/50">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              {dropdownMode === "category"
                ? `Command: /${command} • Select Category`
                : `Select ${category} for /${command}_${category}`}
            </span>
            <span className="text-[10px] text-white/30 font-normal">
              ↑↓ to navigate • ↵ to select
            </span>
          </div>

          {/* 1st Dropdown: Category Options */}
          {dropdownMode === "category" &&
            CATEGORY_OPTIONS.map((opt, idx) => {
              const Icon = opt.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectCategory(opt.id)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#5271ff]/20 text-white border border-[#5271ff]/30 shadow-[0_0_12px_rgba(82,113,255,0.2)]"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-cyan-400 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white tracking-wide">
                        /{command}_{opt.label}
                      </p>
                      <p className="text-[10px] text-white/40 truncate font-medium">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
                </div>
              );
            })}

          {/* 2nd Dropdown: Entity Options */}
          {dropdownMode === "entity" && (
            <>
              {isLoadingEntities ? (
                <div className="flex items-center justify-center py-6 gap-2 text-xs text-cyan-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading {category} options...</span>
                </div>
              ) : filteredEntities.length === 0 ? (
                <div className="py-4 text-center text-xs text-white/40">
                  No {category} records found matching "{searchQuery}"
                </div>
              ) : (
                filteredEntities.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id || item.name}
                      onClick={() => handleSelectEntity(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#5271ff]/20 text-white border border-[#5271ff]/30 shadow-[0_0_12px_rgba(82,113,255,0.2)]"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/15 border border-[#5271ff]/20 text-[#5271ff] font-bold text-xs shrink-0">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-white truncate">
                            {item.name}
                          </p>
                          {item.subtitle && (
                            <p className="text-[10px] text-white/40 truncate font-medium">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/40 shrink-0" />
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      )}

      {/* Main Input Controls Bar */}
      <div
        className="
          w-full
          border
          border-white/[0.08]
          rounded-2xl
          px-3
          py-2.5
          flex
          items-end
          justify-between
          gap-3
          bg-white/[0.02]
          focus-within:border-[#5271ff]/50
          transition-all
          duration-300
          sm:px-4 sm:py-3
        "
      >
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            className="
              w-8
              h-8
              sm:w-9
              sm:h-9
              rounded-full
              bg-white/5
              border
              border-white/10
              hover:bg-[#5271ff]/10
              hover:border-[#5271ff]/30
              flex
              items-center
              justify-center
              transition-all
              duration-300
              shrink-0
              text-white/60
              hover:text-white
            "
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>

          <textarea
            ref={textareaRef}
            placeholder="Type your message or use /report, /status, /progress..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="
              w-full
              resize-none
              outline-none
              bg-transparent
              text-sm
              text-white
              placeholder:text-white/30
              leading-6
              min-h-[24px]
              max-h-[120px]
              overflow-y-auto
            "
          />
        </div>

        <button
          type="button"
          onClick={handleSendMessage}
          className="
            w-9
            h-9
            sm:w-10
            sm:h-10
            rounded-full
            bg-gradient-to-r
            from-[#5271ff]
            to-[#3a4ec4]
            shadow-[0_0_12px_rgba(82,113,255,0.3)]
            hover:shadow-[0_0_18px_rgba(82,113,255,0.5)]
            flex
            items-center
            justify-center
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            shrink-0
          "
        >
          <SendHorizonal className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
