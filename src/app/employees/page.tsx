import type { Metadata } from "next";

import EmployeesPanel from "./employees-panel";

export const metadata: Metadata = {
  title: "Employees | SynergiSuite",
  description:
    "Manage employees, roles, activity, and workspace access in SynergiSuite.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmployeesPage() {
  return <EmployeesPanel />;
}
