"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { CookieManager } from "@/lib/cookieManager";

export default function Home() {
  useEffect(() => {
    const manage = () => {
      const access_token = CookieManager("get", "access-token");
      if (access_token) {
        redirect("/dashboard");
      } else {
        redirect("/main");
      }
    };
    manage();
  }, []);
}
