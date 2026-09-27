"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Cloud,
  Component,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquareQuote,
  Orbit,
  UserRoundCog,
  Users,
  Video,
} from "lucide-react";
import { gsap } from "gsap";

import { CookieManager } from "@/lib/cookieManager";
import { cn } from "@/lib/utils";

type SidebarSection = "Overview" | "Work" | "Intelligence";

type SidebarItem = {
  label: string;
  route: string;
  section: SidebarSection;
  icon: ComponentType<{ className?: string }>;
};

type SidebarProps = {
  className?: string;
  navClassName?: string;
  onNavigate?: () => void;
} & Omit<ComponentProps<"aside">, "className">;

const SECTION_ORDER: SidebarSection[] = ["Overview", "Work", "Intelligence"];

const BASE_ITEMS: SidebarItem[] = [
  { label: "Dashboard", route: "/dashboard", section: "Overview", icon: LayoutDashboard },
  { label: "Employees", route: "/employees", section: "Overview", icon: Users },
  { label: "Teams", route: "/teams", section: "Overview", icon: UserRoundCog },
  { label: "Projects", route: "/projects", section: "Work", icon: FolderKanban },
  { label: "Clients", route: "/clients", section: "Work", icon: Component },
  { label: "Feedback", route: "/feedback", section: "Work", icon: MessageSquareQuote },
  { label: "Resources", route: "/resources", section: "Work", icon: Boxes },
  { label: "Cloud", route: "/cloud", section: "Work", icon: Cloud },
  { label: "AI Assistant", route: "/chatbot", section: "Intelligence", icon: BrainCircuit },
  { label: "Collab Station", route: "/collab-station", section: "Intelligence", icon: Orbit },
  { label: "Meetings", route: "/meetings", section: "Intelligence", icon: Video },
  { label: "Analytics", route: "/analytics", section: "Intelligence", icon: BarChart3 },
  { label: "Reports", route: "/reports", section: "Intelligence", icon: FileText },
];

const CLIENT_ROUTES = new Set(["/projects", "/feedback", "/cloud"]);

const MEMBER_ROUTES = new Set([
  "/dashboard",
  "/employees",
  "/teams",
  "/projects",
  "/cloud",
  "/chatbot",
  "/collab-station",
  "/meetings",
]);

function formatRole(role: string) {
  if (!role) {
    return "Workspace member";
  }

  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function Sidebar({
  className,
  navClassName,
  onNavigate,
  ...props
}: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const [role, setRole] = useState("");
  const [businessName, setBusinessName] = useState("Your workspace");

  useEffect(() => {
    const primaryRole = CookieManager("get", "primary_role");
    const assignedRole = CookieManager("get", "role");
    const storedBusinessName = CookieManager("get", "business-name");

    setRole(String(primaryRole || assignedRole || "").toLowerCase());

    if (typeof storedBusinessName === "string" && storedBusinessName.trim()) {
      setBusinessName(storedBusinessName);
    }
  }, []);

  const isClient = role === "client";
  const isFounder = role.includes("founder");
  const isManager = role.includes("manager") || role.includes("admin");
  const hasManagementAccess = isFounder || isManager;

  const visibleItems = BASE_ITEMS.filter((item) => {
    if (isClient) {
      return CLIENT_ROUTES.has(item.route);
    }

    if (hasManagementAccess) {
      return true;
    }

    return MEMBER_ROUTES.has(item.route);
  }).map((item) =>
    item.route === "/feedback" && hasManagementAccess
      ? { ...item, label: "Client tickets" }
      : item,
  );

  const sections = SECTION_ORDER.map((section) => ({
    label: section,
    items: visibleItems.filter((item) => item.section === section),
  })).filter((section) => section.items.length > 0);

  const isActiveRoute = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  useLayoutEffect(() => {
    const sidebar = sidebarRef.current;

    if (
      !sidebar ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-sidebar-workspace]", {
          autoAlpha: 0,
          y: -8,
          duration: 0.4,
        })
        .from(
          "[data-sidebar-section]",
          {
            autoAlpha: 0,
            x: -8,
            duration: 0.35,
            stagger: 0.055,
          },
          "-=0.18",
        );
    }, sidebar);

    return () => context.revert();
  }, []);

  return (
    <aside
      ref={sidebarRef}
      aria-label="Primary navigation"
      className={cn(
        "flex min-h-0 w-full flex-col bg-v2-neutral-600 text-v2-neutral-100",
        className,
      )}
      {...props}
    >
      <div className="border-b border-v2-neutral-500 px-3 pb-4 pt-1">
        <div
          data-sidebar-workspace
          className="flex items-center gap-3 rounded-2xl border border-v2-neutral-500 bg-v2-neutral-500/35 p-3"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600 shadow-sm">
            <Building2 className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-[-0.015em] text-v2-neutral-100">
              {businessName}
            </span>
            <span className="mt-0.5 block truncate text-xs text-v2-neutral-300">
              {formatRole(role)}
            </span>
          </span>
        </div>
      </div>

      <nav
        data-sidebar-scroll
        aria-label="Workspace"
        className={cn(
          "flex-1 overflow-y-auto overscroll-contain px-3 py-4",
          navClassName,
        )}
      >
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.label}
              data-sidebar-section
              aria-labelledby={`sidebar-${section.label.toLowerCase()}`}
            >
              <h2
                id={`sidebar-${section.label.toLowerCase()}`}
                className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-v2-neutral-400"
              >
                {section.label}
              </h2>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.route);

                  return (
                    <Link
                      key={item.route}
                      href={item.route}
                      aria-current={isActive ? "page" : undefined}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none transition-[background-color,color,box-shadow] duration-200",
                        "focus-visible:ring-[3px] focus-visible:ring-v2-neutral-300/25",
                        isActive
                          ? "bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                          : "text-v2-neutral-300 hover:bg-v2-neutral-500/60 hover:text-v2-neutral-100",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg transition-colors duration-200",
                          isActive
                            ? "bg-v2-neutral-200 text-v2-neutral-600"
                            : "text-v2-neutral-300 group-hover:bg-v2-neutral-500 group-hover:text-v2-neutral-100",
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 truncate">{item.label}</span>
                      {isActive && (
                        <span
                          className="ml-auto size-1.5 shrink-0 rounded-full bg-v2-neutral-600"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>

      <div className="border-t border-v2-neutral-500 px-4 py-4">
        <div className="flex items-center gap-2 text-xs leading-5 text-v2-neutral-400">
          <BriefcaseBusiness className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">SynergiSuite workspace</span>
          <span
            className="ml-auto size-1.5 shrink-0 rounded-full bg-v2-neutral-300"
            aria-label="Workspace active"
          />
        </div>
      </div>
    </aside>
  );
}
