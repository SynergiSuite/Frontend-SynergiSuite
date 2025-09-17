"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { jwtVerify } from "jose";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { deleteCookie, getCookie, getCookies, hasCookie } from "cookies-next";
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
          const codeToken = getCookie("verify-token");
          if (!codeToken) {
            router.replace("/session");
            return;
          }
        }
        if (pathName.startsWith("/session/register-business")) {
          const codeToken = getCookie("register-token");
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
          deleteCookie("access_token");
          deleteCookie("user_email");
          deleteCookie("user");
          deleteCookie("verify-token");
          deleteCookie("register-token");
          router.replace("/session");
          return;
        }

        if (typeof token !== "string") {
          router.replace("/session");
          return;
        }
        try {
          const data = await jwtVerify(token, access_secret);
          const user_email = getCookie("user_email");
          if (data.payload.email != user_email) {
            throw new Error("Invalid token");
          }
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
