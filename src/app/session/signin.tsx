import React from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "./schema/loginSchema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LockKeyhole, Mail, Terminal } from "lucide-react";
import { motion } from "framer-motion";
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

      CookieManager("set", "user-id", responseData.user_id);
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
        className="mx-auto w-[95%] sm:w-[90%] space-y-4 py-2"
      >
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl px-4 py-3 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <Terminal className="text-red-400 mt-0.5" size={18} />
              <div>
                <AlertTitle className="text-red-400 font-semibold text-sm">OOPs!</AlertTitle>
                <AlertDescription className="text-red-200/80 text-xs mt-1">
                  {error}
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Email Input */}
        <div className="space-y-3 text-white">
          <label htmlFor="emailLogin" className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
            Email Address
          </label>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center px-4 h-12 focus-within:border-[#5271ff]/60 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_15px_rgba(82,113,255,0.15)] transition-all duration-300 group">
            <Mail size={18} className="text-white/40 group-focus-within:text-[#5271ff] transition-colors duration-300" aria-hidden="true" />
            <input
              type="email"
              name="email"
              value={email}
              id="emailLogin"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="session-auth-input w-full bg-transparent focus:outline-none text-white placeholder-white/20 text-sm h-full pl-3"
              placeholder="example@gmail.com"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-3 text-white">
          <label htmlFor="passwordLogin" className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
            Password
          </label>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center px-4 h-12 focus-within:border-[#5271ff]/60 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_15px_rgba(82,113,255,0.15)] transition-all duration-300 group">
            <LockKeyhole size={18} className="text-white/40 group-focus-within:text-[#5271ff] transition-colors duration-300" aria-hidden="true" />
            <input
              type="password"
              name="password"
              id="passwordLogin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="session-auth-input w-full bg-transparent focus:outline-none text-white placeholder-white/20 text-sm h-full pl-3"
              placeholder="••••••••••••"
              required
            />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="pt-1 text-end">
          <a href="#" onClick={(e) => e.preventDefault()} className="group">
            <p className="text-white/40 group-hover:text-[#5271ff] transition-colors duration-200 text-sm font-medium inline-block relative">
              Forgot Password?
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#5271ff] transition-all duration-300 group-hover:w-full" />
            </p>
          </a>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 h-12 bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] hover:from-[#6380ff] hover:to-[#4b60df] text-white font-semibold rounded-xl shadow-[0_4px_20px_rgba(82,113,255,0.15)] hover:shadow-[0_4px_25px_rgba(82,113,255,0.35)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-sm"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </>
  );
}
