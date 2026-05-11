"use client";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  FileText,
  Settings,
  LifeBuoy,
  Component,
  UserRoundCog,
  BrainCircuit,
  Orbit,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";

type SidebarItem = {
  label: string;
  route: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type SidebarProps = {
  className?: string;
  navClassName?: string;
  onNavigate?: () => void;
} & Omit<ComponentProps<"aside">, "className">;

export default function Sidebar({
  className = "",
  navClassName = "",
  onNavigate,
  ...props
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
    { label: "Employees", route: "/employees", icon: Users },
    { label: "Teams", route: "/teams", icon: UserRoundCog },
    { label: "Projects", route: "/projects", icon: FolderKanban },
    { label: "Clients", route: "/clients", icon: Component },
    { label: "AI Assistant", route: "/chatbot", icon: BrainCircuit },
    { label: "Collab Station", route: "/collab-station", icon: Orbit },
    { label: "Analytics", route: "/analytics", icon: BarChart3 },
    { label: "Reports", route: "/reports", icon: FileText },
    { label: "Settings", route: "/settings", icon: Settings },
    { label: "Support", route: "/support", icon: LifeBuoy },
  ];

  const isActiveRoute = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  return (
    <aside
      className={`w-64 border-r border-gray-200 bg-white p-4 ${className}`}
      {...props}
    >
      <nav className={`space-y-3 ${navClassName}`}>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.route);

          return (
            <button
              key={item.route}
              onClick={() => {
                router.push(item.route);
                onNavigate?.();
              }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition ${
                isActive
                  ? "bg-gray-100 font-semibold text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} /> <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
