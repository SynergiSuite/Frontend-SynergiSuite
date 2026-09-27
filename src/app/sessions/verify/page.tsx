import type { Metadata } from "next";

import VerifyPanel from "./verify-panel";

export const metadata: Metadata = {
  title: "Verify your email | SynergiSuite",
  description:
    "Verify your email address to secure your SynergiSuite account and continue setting up your workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyPage() {
  return <VerifyPanel />;
}
