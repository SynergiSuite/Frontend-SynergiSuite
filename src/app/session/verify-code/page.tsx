"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { verificationSchema } from "../schema/verificationSchema";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ChevronLeft,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Loader2,
  Mail,
  LockKeyhole,
} from "lucide-react";
import { CookieManager } from "@/lib/cookieManager";
import { gsap } from "gsap";
import { toast } from "sonner";

export default function VerifyCode() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Get email from cookie
  useEffect(() => {
    const storedEmail = CookieManager("get", "user-email");
    setEmail((storedEmail as string) || "");
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pulse floating animation for top icon badge
      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          y: -6,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.easeInOut",
        });
      }

      // Stagger entrance for card elements
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Handle back button click
  const handleBack = () => {
    router.back();
  };

  // Handle input change for 6-digit OTP
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

  // Handle backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const verificationCode = code.join("");

    const validation = verificationSchema.safeParse({
      otp: verificationCode,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid 6-digit verification code");
      setIsLoading(false);
      return;
    }

    const otp = validation.data;

    try {
      const accessToken = CookieManager("get", "access-token");
      const response = await fetch(`${requestBaseUrl}/auth/verify-email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(otp),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed. Please check your code.");
      }

      CookieManager("delete", "verify-token");
      CookieManager("set", "register-token", accessToken as string);

      const roleName = data.role?.name ?? data.role_name;
      const primaryRoleName =
        data.role?.primary_role?.name ??
        data.primary_role?.name ??
        data.primary_role_name ??
        (typeof data.primary_role === "string"
          ? data.primary_role
          : typeof data.role?.primary_role === "string"
          ? data.role.primary_role
          : undefined);

      if (roleName) {
        CookieManager("set", "role", roleName);
      }
      if (primaryRoleName) {
        CookieManager("set", "primary_role", String(primaryRoleName));
      }

      toast.success("Email verified successfully!");
      router.push("/sessions/register");
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0]?.message || "Invalid input");
      } else if (error instanceof Error) {
        setError(error.message || "Something went wrong. Try again later.");
      } else {
        setError("Unknown error occurred during verification.");
      }
      setIsLoading(false);
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

  // Format time to 00:59 format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle resend code
  const handleResend = async () => {
    if (timeLeft > 0) return;
    try {
      setTimeLeft(59);
      const accessToken = CookieManager("get", "access-token");
      const res = await fetch(`${requestBaseUrl}/auth/request-email-verification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("A new 6-digit verification code has been sent to your email!");
      } else {
        toast.error("Failed to resend verification code.");
      }
    } catch {
      toast.error("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030114] p-4 sm:p-6 overflow-hidden text-white font-sans">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.08] blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[450px] w-[450px] rounded-full bg-[#3a4ec4]/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-[#22d3ee]/[0.05] blur-[110px]" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-3xl border border-white/10 bg-[#090724]/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <div ref={cardRef} className="space-y-6">
            {/* Icon Badge Header */}
            <div className="flex items-center justify-start">
              <div
                ref={badgeRef}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5271ff] to-[#3a4ec4] shadow-[0_0_20px_rgba(82,113,255,0.4)] border border-white/20"
              >
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Header Content */}
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#5271ff]/15 border border-[#5271ff]/30 px-3 py-0.5 text-xs font-bold text-[#5271ff]">
                <Sparkles className="h-3.5 w-3.5" /> 2-Factor Authentication
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Enter Verification Code
              </h1>
              <p className="text-xs text-white/60 leading-relaxed">
                We've transmitted a 6-digit security code to your email address:
              </p>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                <Mail className="h-3.5 w-3.5 text-[#5271ff]" />
                <span className="truncate max-w-[260px]">{email || "your registered email"}</span>
              </div>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex items-start gap-3"
                >
                  <Terminal className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-400">Verification Failed</p>
                    <p className="text-red-200/80 text-[11px] mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 6-Digit OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.input
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
                    onPaste={index === 0 ? handlePaste : undefined}
                    whileHover={{ scale: 1.05 }}
                    whileFocus={{ scale: 1.05 }}
                    className={`h-13 sm:h-14 w-full text-center text-xl sm:text-2xl font-black rounded-xl outline-none transition-all duration-300 ${
                      code[index]
                        ? "bg-[#5271ff]/20 border-[#5271ff] text-white shadow-[0_0_18px_rgba(82,113,255,0.35)]"
                        : "bg-white/[0.04] border-white/15 text-white/90 hover:bg-white/[0.08] focus:border-[#5271ff] focus:bg-[#5271ff]/10 focus:shadow-[0_0_20px_rgba(82,113,255,0.4)]"
                    }`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Submit / Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(82,113,255,0.35)] hover:shadow-[0_0_30px_rgba(82,113,255,0.55)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <LockKeyhole className="h-4 w-4" />
                    <span>Verify Code & Continue</span>
                  </>
                )}
              </button>
            </form>

            {/* Resend Code Section */}
            <div className="pt-2 border-t border-white/10 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                <span>Didn't receive the code?</span>
                {timeLeft > 0 ? (
                  <span className="font-bold text-[#5271ff] bg-[#5271ff]/15 px-2.5 py-0.5 rounded-full border border-[#5271ff]/30">
                    Resend in {formatTime(timeLeft)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Resend Code Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
