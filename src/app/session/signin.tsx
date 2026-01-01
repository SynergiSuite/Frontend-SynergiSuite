import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginSchema } from "./schema/loginSchema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import EmailLogo from "@/assets/email-icon.svg";
import PasswordLogo from "@/assets/password-icon.svg";
import { Button } from "@/global/buttons";
import { useState } from "react";
import { ZodError } from "zod";
import { CookieManager } from "@/lib/cookieManager";
import { toast } from "sonner";

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  // Upon submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const data = {
      email,
      password: password,
    };

    try {
      const validation = loginSchema.safeParse(data);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || "Invalid Input");
        return;
      }
      const userData = validation.data;

      const res = await fetch(`${requestBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Failed to login. Try Again later.",
        );
      }

      CookieManager("set", "access-token", responseData.access_token);
      CookieManager("set", "user-email", responseData.email);
      CookieManager("set", "user", responseData.name);

      // If user is created and not verified
      if (responseData.verified === false) {
        // Request email verification
        const req = await fetch(
          `${requestBaseUrl}/user/request-verify-email`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${responseData.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          },
        );
        if (!req.ok) {
          throw new Error(
            "Failed to request email verification. Try Again later.",
          );
        }
        CookieManager("set", "verify-token", responseData.access_token);
        router.push(`/session/verify-code`);
        toast.success("Logged in successfully, verification required.");

        // If user is verified, but does not have a business
      } else if (!responseData.business) {
        CookieManager("set", "register-token", responseData.access_token);
        router.push("/session/register-business");
        toast.success("Logged in successfully, registration required.");
      } else {
        CookieManager("set", "business-name", responseData.business_name);
        CookieManager("set", "business-id", responseData.business_id);
        CookieManager("set", "role", responseData.role.name);
        router.push("/dashboard");
        toast.success("Logged in successfully");
      }
      setError(null);
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
            <Alert variant="destructive" className="border-red-400">
              <Terminal />
              <AlertTitle>OOPs!</AlertTitle>
              <AlertDescription>
                <p className="text-red-600 text-sm">{error}</p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

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
              id="emailLogin"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full focus:outline-none text-gray-600"
              placeholder="example@gmail.com"
              required
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
              id="passwordLogin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="w-full focus:outline-none text-gray-600"
              placeholder="•••••••••••"
              required
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
          className="button_primary_full mt-5"
        >
          Login
        </Button>
      </form>
    </>
  );
}
