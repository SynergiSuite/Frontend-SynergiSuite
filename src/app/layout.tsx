"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { jwtVerify } from "jose";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { hasCookie } from "cookies-next";
import "./globals.css";
import Sidebar from "../components/ui/sidebar";
import Navbar from "../components/ui/navbar";
import LoaderCustom from "../components/ui/loader-custom";
import { CookieManager } from "@/lib/cookieManager";

const access_secret = new TextEncoder().encode("synergi_user");

const protectedRoutes = [
  "/dashboard",
  "/employees",
  "/settings",
  "/projects",
  "/crm",
  "/team",
  "/profile",
];

const publicRoutes = ["/login", "/signup", "/forgot-password"];

const programmaticOnlyRoutes = [
  "/session/verify-code",
  "/session/register-business",
];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const verifyTokenAndProtectRoutes = async () => {
      const token = CookieManager("get", "access-token");

      const isProtectedPath = protectedRoutes.some(
        (route) => pathName === route || pathName.startsWith(route + "/"),
      );
      const isPublicPath = publicRoutes.some(
        (route) => pathName === route || pathName.startsWith(route + "/"),
      );
      const isProgrammaticPath = programmaticOnlyRoutes.some(
        (route) => pathName === route || pathName.startsWith(route + "/"),
      );

      // Programmatic routes
      if (isProgrammaticPath) {
        if (pathName.startsWith("/session/verify-code")) {
          const codeToken = CookieManager("get", "verify-token");
          if (!codeToken) {
            router.replace("/session");
            return;
          }
        }
        if (pathName.startsWith("/session/register-business")) {
          const codeToken = CookieManager("get", "register-token");
          if (!codeToken) {
            router.replace("/session");
            return;
          }
        }
        setIsLoading(false);
        return;
      }

      // Public routes
      if (isPublicPath) {
        if (typeof token === "string") {
          try {
            await jwtVerify(token, access_secret);
            router.replace("/dashboard");
            return;
          } catch {
            // Invalid token, stay on public page
          }
        }
        setIsLoading(false);
        return;
      }

      // Protected routes
      if (isProtectedPath) {
        const userBusiness = hasCookie("business_id");
        const userBusinessName = hasCookie("business_name");

        if (!userBusiness || !userBusinessName) {
          CookieManager("delete", "access-token");
          CookieManager("delete", "user-email");
          CookieManager("delete", "verify-token");
          CookieManager("delete", "register-token");
          CookieManager("delete", "user");
          router.replace("/session");
          return;
        }

        if (typeof token !== "string") {
          router.replace("/session");
          return;
        }
        try {
          const data = await jwtVerify(token, access_secret);
          const user_email = CookieManager("get", "user-email");
          if (data.payload.email != user_email) {
            setShowSidebar(false);
            throw new Error("Invalid token");
          }
          setShowSidebar(true);
          setIsLoading(false);
        } catch {
          document.cookie =
            "access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          setShowSidebar(false);
          router.replace("/session");
        }
      } else {
        setShowSidebar(false);
        setIsLoading(false);
      }
    };

    verifyTokenAndProtectRoutes();
  }, [pathName, router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Navbar (always on top) */}
          {showSidebar && (
            <header className="border-b border-gray-200 bg-white">
              <Navbar />
            </header>
          )}

          <div className="flex flex-1">
            {/* Sidebar (left) */}
            {showSidebar && (
              <aside className="w-64 border-r border-gray-200 bg-white">
                <Sidebar />
              </aside>
            )}

            {/* Main content (right) */}
            <main className="flex-1 bg-gray-50 p-10 overflow-y-auto">
              {isLoading ? <LoaderCustom /> : children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
