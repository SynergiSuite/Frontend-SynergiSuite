import type { Metadata } from "next";

import AuthPanel, { type SessionMode } from "./auth-panel";

export const metadata: Metadata = {
  title: "Sign in or create an account | SynergiSuite",
  description:
    "Access your SynergiSuite workspace or create an account to manage your people, projects, clients, and business insights.",
  robots: {
    index: false,
    follow: false,
  },
};

type SessionsPageProps = {
  searchParams: Promise<{ form?: string }>;
};

export default async function SessionsPage({ searchParams }: SessionsPageProps) {
  const { form } = await searchParams;
  const initialMode: SessionMode =
    form === "signin" || form === "login" ? "signin" : "signup";

  return <AuthPanel initialMode={initialMode} />;
}
