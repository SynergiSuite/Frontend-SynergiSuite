import type { Metadata } from "next";

import TeamsPanel from "./teams-panel";

export const metadata: Metadata = {
  title: "Teams | SynergiSuite",
  description:
    "Manage squads, team leads, members, and task execution progress in SynergiSuite.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeamsPage() {
  return <TeamsPanel />;
}
