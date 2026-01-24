"use client";
import React, { useState, useEffect } from "react";
import { CookieManager } from "@/lib/cookieManager";

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userBusinessName, setUserBusinessName] = useState<string>("");
  const [userBusinessId, setUserBusinessId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const token = CookieManager("get", "access-token");
    setToken(token as string);
    const user = CookieManager("get", "user");
    setUserName(user as string);
    const userEmail = CookieManager("get", "user-email");
    setUserEmail(userEmail as string);
    const userBusinessName = CookieManager("get", "business-name");
    setUserBusinessName(userBusinessName as string);
    const userBusinessId = CookieManager("get", "business-id");
    setUserBusinessId(userBusinessId as string);
    const userRole = CookieManager("get", "role");
    setUserRole(userRole as string);
  }, []);

  return (
    <>
      <div className="">
        <h1>Dashboard</h1>
        <p>{userName}</p>
        <p>{userEmail}</p>
        <p>{userBusinessName}</p>
        <p>{userBusinessId}</p>
        <p>{userRole}</p>
        <p>{token}</p>
      </div>
    </>
  );
}
