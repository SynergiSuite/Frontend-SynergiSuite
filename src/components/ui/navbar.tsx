"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { CookieManager } from "@/lib/cookieManager";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import Logo from "@/assets/Logo.png";
import { gsap } from "gsap";

type NavItem = {
  name: string;
  param: string;
  route: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [role, setRole] = useState("");
  const { projectName } = useParams() as { projectName: string };

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  const logout = async () => {
    const token = CookieManager("get", "access-token");
    const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    try {
      const res = await fetch(`${requestBaseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(
          responseData.message || "Failed to logout. Try Again later.",
        );
      }
      CookieManager("delete", "access-token");
      CookieManager("delete", "user-email");
      CookieManager("delete", "user");
      CookieManager("delete", "business-name");
      CookieManager("delete", "business-id");
      router.replace("/session");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout. Try Again later.");
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const name = CookieManager("get", "user");
      setName(name as string);
      const email = CookieManager("get", "user-email");
      setEmail(email as string);
      const business = CookieManager("get", "business-name");
      setBusiness(business as string);
      const role = CookieManager("get", "role");
      setRole(role as string);
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (isProfileOpen) {
      const timer = setTimeout(() => {
        if (avatarRef.current && infoRef.current && buttonsRef.current) {
          gsap.killTweensOf([avatarRef.current, infoRef.current.children, buttonsRef.current.children]);
          
          gsap.fromTo(avatarRef.current, 
            { scale: 0.7, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }
          );
          
          gsap.fromTo(infoRef.current.children, 
            { y: 15, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: "power2.out", delay: 0.1 }
          );

          gsap.fromTo(buttonsRef.current.children, 
            { y: 12, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: "power2.out", delay: 0.25 }
          );
        }
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isProfileOpen]);

  // Define nav items per route
  const routeNavs: Record<string, NavItem[]> = {
    "/dashboard": [],
    "/employees": [
      { name: "Employees", param: "employees", route: "/employees" },
      { name: "Teams", param: "teams", route: "/teams" },
      { name: "Projects", param: "projects", route: "/projects" },
    ],
    "/teams": [
      { name: "Employees", param: "employees", route: "/employees" },
      { name: "Teams", param: "teams", route: "/teams" },
      { name: "Projects", param: "projects", route: "/projects" },
    ],
    "/projects": [
      { name: "Employees", param: "employees", route: "/employees" },
      { name: "Teams", param: "teams", route: "/teams" },
      { name: "Projects", param: "projects", route: "/projects" },
    ],
    "/settings": [
      { name: "Profile", param: "profile", route: "/settings/profile" },
      { name: "Security", param: "security", route: "/settings/security" },
      { name: "Billing", param: "billing", route: "/settings/billing" },
    ],
    "/details": [
      { name: `${projectName}'s Overview`, param: "overview", route: `/projects/${projectName}/overview` },
      { name: "Tasks", param: "task", route: `/projects/${projectName}/task` },
    ],
  };

  const getRouteNavs = (path: string) => {
    if (path.startsWith("/projects/")) {
      return routeNavs["/details"] || [];
    }
    return routeNavs[path] || [];
  };

  // pick navs based on current route (fallback: empty)
  const links = getRouteNavs(pathname);

  // which tab is active (via ?tab=)
  const activeTab =
    [...links]
    .sort((a, b) => b.route.length - a.route.length)
    .find((link) => pathname.startsWith(link.route))?.param ??
    links[0]?.param;

  const handleClick = (route: string) => {
    router.push(route);
  };

  return (
    <>
      <div className="w-full relative bg-[#030114]/90 backdrop-blur-md">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex max-w-full rounded-full border border-[#5271ff]/30 bg-[#5271ff]/5 px-1 py-1 hover:border-[#5271ff]/70 hover:shadow-[0_0_15px_rgba(82,113,255,0.25)] transition-all duration-300 group">
                <button
                  type="button"
                  className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-3"
                  onClick={() => router.push("/dashboard")}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#5271ff] to-[#3a4ec4] shadow-[0_0_10px_rgba(82,113,255,0.4)] transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={Logo}
                      alt="SynergiSuite"
                      width={36}
                      height={36}
                      className="h-7 w-7 object-contain"
                      priority
                    />
                  </div>
                  <span className="truncate pr-2 text-base font-extrabold sm:pr-1 sm:text-lg text-white group-hover:text-[#5271ff] transition-colors duration-300 tracking-wide font-sans">
                    SynergiSuite
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              className="h-9 w-9 shrink-0 cursor-pointer rounded-full border-2 border-[#5271ff]/30 hover:border-[#5271ff] hover:shadow-[0_0_12px_rgba(82,113,255,0.5)] transition-all duration-300 overflow-hidden"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Open profile drawer"
            >
              <Avatar className="h-full w-full">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>

        {links.length > 0 && (
          <div className="border-t border-[#5271ff]/15 bg-[#030114]/50 px-4 py-2.5 sm:px-6">
            <nav className="-mx-1 flex gap-3 overflow-x-auto px-1 text-sm whitespace-nowrap scrollbar-none">
              {links.map((item) => (
                <button
                  key={item.param}
                  onClick={() => handleClick(item.route)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === item.param
                      ? "text-white bg-[#5271ff]/20 border border-[#5271ff]/40 shadow-[0_0_10px_rgba(82,113,255,0.2)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        )}

      </div>
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            className="fixed inset-0 z-[55] flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="Close profile drawer"
              onClick={() => setIsProfileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-[#5271ff]/20 bg-[#0a0826]/95 backdrop-blur-xl shadow-[0_-10px_45px_rgba(82,113,255,0.2)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="mx-auto w-full max-w-xl px-6 py-8">
                <div ref={avatarRef} className="flex justify-center">
                  <Avatar className="h-24 w-24 border-2 border-[#5271ff]/40 shadow-[0_0_15px_rgba(82,113,255,0.3)]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-[#030114] text-white">CN</AvatarFallback>
                  </Avatar>
                </div>
                <div ref={infoRef} className="mt-5 text-center">
                  <h3 className="text-xl font-bold tracking-wide text-white">{name}</h3>
                  <p className="mt-1 text-sm text-[#5271ff] font-semibold">{email}</p>
                  <p className="mt-2 text-xs text-gray-400 font-medium bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">{role} @ {business}</p>
                </div>
                <div ref={buttonsRef} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white hover:border-white/20 sm:w-28 cursor-pointer"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Close
                  </button>

                  <button
                    onClick={() => logout()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500/80 to-pink-600/85 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.25)] transition hover:from-red-500 hover:to-pink-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.45)] sm:w-32 cursor-pointer"
                  >
                    <LogOut size={16} /> <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
