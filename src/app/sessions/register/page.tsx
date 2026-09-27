import type { Metadata } from "next";

import RegisterPanel from "./register-panel";

export const metadata: Metadata = {
  title: "Set up your workspace | SynergiSuite",
  description:
    "Create a SynergiSuite workspace or join an existing business to finish setting up your account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterPanel />;
}
