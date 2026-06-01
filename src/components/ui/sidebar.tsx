"use client";

import React, { useEffect, useRef } from "react";
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
  Boxes,
  Cloud,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { gsap } from "gsap";

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
  const navRef = useRef<HTMLDivElement | null>(null);

  const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
    { label: "Employees", route: "/employees", icon: Users },
    { label: "Teams", route: "/teams", icon: UserRoundCog },
    { label: "Projects", route: "/projects", icon: FolderKanban },
    { label: "Clients", route: "/clients", icon: Component },
    { label: "Resources", route: "/resources", icon: Boxes },
    { label: "Cloud", route: "/cloud", icon: Cloud },
    { label: "AI Assistant", route: "/chatbot", icon: BrainCircuit },
    { label: "Collab Station", route: "/collab-station", icon: Orbit },
    { label: "Analytics", route: "/analytics", icon: BarChart3 },
    { label: "Reports", route: "/reports", icon: FileText },
    { label: "Settings", route: "/settings", icon: Settings },
    { label: "Support", route: "/support", icon: LifeBuoy },
  ];

  const isActiveRoute = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  // Staggered entry animation on mount
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current.children,
        { x: -16, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    }
  }, []);

  // springy hover micro-animations on icons using GSAP
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const icon = e.currentTarget.querySelector(".sidebar-icon");
    if (icon) {
      gsap.to(icon, {
        scale: 1.25,
        rotate: 8,
        duration: 0.3,
        ease: "back.out(2.5)",
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const icon = e.currentTarget.querySelector(".sidebar-icon");
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotate: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  return (
    <aside
      className={`w-full bg-[#030114]/95 p-4 flex flex-col justify-between ${className}`}
      {...props}
    >
      <nav 
        className={`space-y-2.5 ${navClassName}`} 
        ref={navRef}
      >
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left transition-all duration-300 group cursor-pointer font-sans text-sm font-medium ${
                isActive
                  ? "text-white bg-gradient-to-r from-[#5271ff]/20 to-[#3a4ec4]/5 border-l-[3px] border-[#5271ff] shadow-[inset_4px_0_12px_rgba(82,113,255,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/5 border border-transparent"
              }`}
            >
              <Icon 
                size={18} 
                className={`sidebar-icon shrink-0 ${
                  isActive 
                    ? "text-[#5271ff] drop-shadow-[0_0_8px_#5271ff]" 
                    : "text-gray-400 group-hover:text-white transition-colors"
                }`} 
              /> 
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
