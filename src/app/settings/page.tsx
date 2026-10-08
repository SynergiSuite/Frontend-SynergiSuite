import type { Metadata } from "next";

import SettingsPanel from "./settings-panel";

export const metadata: Metadata = {
  title: "Settings | SynergiSuite",
  description:
    "Manage your SynergiSuite profile, preferences, workspace details, and access roles.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return <SettingsPanel />;
}
