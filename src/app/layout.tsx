"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { jwtVerify } from "jose";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import "./globals.css";

const access_secret = new TextEncoder().encode("synergi_user");

const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/projects",
  "/crm",
  "/team",
  "/profile",
];

const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
];

const programmaticOnlyRoutes = [
  "/session/verify-code",
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

  useEffect(() => {
    const verifyTokenAndProtectRoutes = async () => {
      const token = getCookie("access_token");
      const isProtectedPath = protectedRoutes.some(
        (route) => pathName === route || pathName.startsWith(route + "/")
      );
      const isPublicPath = publicRoutes.some(
        (route) => pathName === route || pathName.startsWith(route + "/")
      );
      const isProgrammaticPath = programmaticOnlyRoutes.some(
        (route) => pathName === route || pathName.startsWith(route + "/")
      );

      // Programmatic routes
      if (isProgrammaticPath) {
        if (pathName.startsWith("/session/verify-code")) {
          const codeToken = getCookie("token");
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
        if (typeof token !== "string") {
          router.replace("/session");
          return;
        }
        try {
          await jwtVerify(token, access_secret);
          setIsLoading(false);
        } catch {
          document.cookie =
            "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          router.replace("/session");
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyTokenAndProtectRoutes();
  }, [pathName, router]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="px-6">
          {isLoading ? <div>Loading...</div> : children}
        </div>
      </body>
    </html>
  );
}
