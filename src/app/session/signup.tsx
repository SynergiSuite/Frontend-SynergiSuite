import React from "react";
import { signupScheme } from "./schema/signupSchema";
import { ZodError } from "zod";
import EmailLogo from "@/assets/email-icon.svg";
import PasswordLogo from "@/assets/password-icon.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/global/buttons";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CookieManager } from "@/lib/cookieManager";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const data = {
      name,
      email,
      password: password,
    };

    try {
      const validation = signupScheme.safeParse(data);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || "Invalid Input");
        return;
      }
      const userData = validation.data;

      const res = await fetch("http://localhost:3002/auth/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(
          responseData.message ||
            "Failed to create an account. Try Again later.",
        );
      }
      setError(null);
      CookieManager("set", "verify-token", responseData.access_token);

      // Request email verification
      const req = await fetch(
        "http://localhost:3002/user/request-verify-email",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${responseData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      if (req.ok) {
        CookieManager("set", "access-token", responseData.access_token);
        CookieManager("set", "user", responseData.name);
        CookieManager("set", "user-email", responseData.email);
        router.push(`/session/verify-code`);
      } else {
        throw new Error(
          "Failed to request email verification. Try Again later.",
        );
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0]?.message || "Invalid input");
      } else if (error instanceof Error) {
        setError(error.message || "Something went wrong. Try again later.");
      } else {
        setError("Unknown error occurred.");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        action=""
        method="post"
        className="py-4 mt-12 w-[90%] m-auto space-y-4"
      >
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive">
              <Terminal />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                <p className="text-red-600 text-sm">{error}</p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* User Input */}
        <div className="text-[#09090B]">
          <label htmlFor="name" className="text-sm mb-3">
            Full name
          </label>
          <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
            <Image src={EmailLogo} alt="Email" width={20} />
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              id="fullName"
              className="w-full focus:outline-none text-gray-600"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="text-[#09090B]">
          <label htmlFor="email" className="text-sm mb-3">
            Email
          </label>
          <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
            <Image src={EmailLogo} alt="Email" width={20} />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              id="emailSignup"
              className="w-full focus:outline-none text-gray-600"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        <div className="text-[#09090B]">
          <label htmlFor="password" className="text-sm mb-3">
            Password
          </label>
          <div className="border_primary flex flex-row items-center h-10 px-4 space-x-2">
            <Image src={PasswordLogo} alt="Password" width={20} />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              id="passwordSignup"
              className="w-full focus:outline-none text-gray-600"
              placeholder="•••••••••••"
            />
          </div>
        </div>

        <div className="text-end">
          <a href="">
            <p className="underline text-[#09090B] font-medium text-sm">
              Forgot Password?
            </p>
          </a>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className={`button_primary_full ${isLoading ? "bg-gray-600" : ""} mt-5`}
        >
          Create Account
        </Button>
      </form>
    </>
  );
}
