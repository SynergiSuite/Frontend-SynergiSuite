"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { Button } from "@/global/buttons";
import { verificationSchema } from "../schema/verificationSchema";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ChevronLeft } from "lucide-react";
import { CookieManager } from "@/lib/cookieManager";

export default function VerifyCode() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  // Get email from URL query parameters
  useEffect(() => {
    const email = CookieManager("get", "user-email");
    setEmail(email as string);
  }, []);

  // Handle back button click
  const handleBack = () => {
    router.back();
  };

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const verificationCode = code.join("");

    const validation = verificationSchema.safeParse({
      otp: verificationCode,
    });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid Input");
      return;
    }

    const otp = validation.data;

    try {
      const accessToken = CookieManager("get", "access-token");
      const response = await fetch("http://localhost:3002/auth/verify-email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(otp),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }
      CookieManager("delete", "verify-token");
      CookieManager("set", "register-token", accessToken as string);
      router.push("/session/register-business");
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0]?.message || "Invalid input");
      } else if (error instanceof Error) {
        setError(error.message || "Something went wrong. Try again later.");
      } else {
        setError("Unknown error occurred.");
      }
      setIsLoading(false);
      console.error("Verification error:", error);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time to show 00:59 format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle resend code
  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(59);
      // Add resend logic here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-gray-600 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Enter verification code
        </h1>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="my-4"
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

        <p className="text-sm text-gray-600 mb-2">
          We've sent a 6-digit code to:
        </p>
        <p className="text-sm font-medium text-gray-900 mb-8">
          {email || "your email address"}
        </p>

        {/* Verification Code Inputs */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex justify-between space-x-2 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="button_primary_full"
          >
            Verify
          </Button>
        </form>

        {/* Resend Code */}
        <div className="text-center text-sm">
          <p className="text-gray-600 mb-2">
            {timeLeft > 0 ? (
              <span>Resend code in {formatTime(timeLeft)}</span>
            ) : (
              <button
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Resend code
              </button>
            )}
          </p>
          <button
            className={`text-blue-600 hover:text-blue-800 font-medium ${
              timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={timeLeft > 0}
            onClick={timeLeft === 0 ? handleResend : undefined}
          >
            Didn't receive code?
          </button>
        </div>
      </div>
    </div>
  );
}
