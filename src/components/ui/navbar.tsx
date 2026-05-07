"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { CookieManager } from "@/lib/cookieManager";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

type NavItem = {
  name: string;
  param: string;
  route: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [business, setBusiness] = useState("")
  const [role, setRole] = useState("")
  const { projectName } = useParams() as { projectName: string };

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
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout. Try Again later.");
    }
  };

  useEffect(() => {
    
    const getUserData = async() => {
      const name = CookieManager("get", "user");
      setName(name as string)
      const email = CookieManager("get", "user-email");
      setEmail(email as string)
      const business = CookieManager("get", "business-name");
      setBusiness(business as string)
      const role = CookieManager("get", "role");
      setRole(role as string)
    }
    getUserData()
  }, [])
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
    <header className="w-full border-b border-gray-300">
      <div className="flex justify-between items-center py-3 px-6">
        {/* Brand */}
        <div className="flex items-center space-x-10">
          <h2
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            SynergiSuite
          </h2>

          {/* Show route-specific navs */}
          {links.length > 0 && (
            <nav className="flex space-x-6 text-sm">
              {links.map((item) => (
                <button
                  key={item.param}
                  onClick={() => handleClick(item.route)}
                  className={`${
                    activeTab === item.param
                      ? "text-black font-semibold underline"
                      : "text-gray-700"
                  } cursor-pointer`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Profile avatar */}
        <button
          type="button"
          className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
          aria-label="Open profile drawer"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </button>
      </div>
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close profile drawer"
              onClick={() => setIsProfileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="mx-auto w-full max-w-xl px-6 py-8">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{email}</p>
                  <p className="mt-1 text-sm text-gray-600">{role} @ {business}</p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-28"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Close
                  </button>

                  <button
                    onClick={() => logout()}
                    className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-32"
                  >
                    <LogOut size={16} /> <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
