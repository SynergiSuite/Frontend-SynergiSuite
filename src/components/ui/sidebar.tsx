"use client";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CookieManager } from "@/lib/cookieManager";
import { toast } from "sonner";

export default function Sidebar() {
  const router = useRouter();

  const handleClick = (label: string) => {
    router.push(`/${label}`);
  };

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

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <nav className="space-y-3">
          <button
            onClick={() => handleClick("dashboard")}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleClick("employees")}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <Users size={18} /> <span>Employees</span>
          </button>

          <button
            onClick={() => handleClick("Analytics")}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <BarChart3 size={18} /> <span>Analytics</span>
          </button>

          <button
            onClick={() => handleClick("Reports")}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <FileText size={18} /> <span>Reports</span>
          </button>

          <button
            onClick={() => handleClick("Settings")}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <Settings size={18} /> <span>Settings</span>
          </button>

          <button
            onClick={() => handleClick("Support")}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <LifeBuoy size={18} /> <span>Support</span>
          </button>

          <button
            onClick={() => logout()}
            className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
