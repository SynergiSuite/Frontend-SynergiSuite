"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  KeyRound,
  LoaderCircle,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { verificationSchema } from "@/app/session/schema/verificationSchema";
import { CookieManager } from "@/lib/cookieManager";

const CODE_LENGTH = 6;
const RESEND_DELAY_SECONDS = 59;

type VerificationResponse = {
  message?: string;
  role?: {
    name?: string;
    primary_role?: string | { name?: string };
  };
  role_name?: string;
  primary_role?: string | { name?: string };
  primary_role_name?: string;
};

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function getResponseMessage(payload: unknown, fallback: string) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}

export default function VerifyPanel() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [code, setCode] = useState<string[]>(
    Array.from({ length: CODE_LENGTH }, () => ""),
  );
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RESEND_DELAY_SECONDS);

  useEffect(() => {
    const storedEmail = CookieManager("get", "user-email");
    setEmail(typeof storedEmail === "string" ? storedEmail : "");
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-verify-aside]", {
          autoAlpha: 0,
          xPercent: -2,
          duration: 0.75,
        })
        .from(
          "[data-verify-aside-item]",
          { autoAlpha: 0, x: -18, duration: 0.55, stagger: 0.08 },
          "-=0.4",
        )
        .from(
          "[data-verify-card]",
          { autoAlpha: 0, y: 20, duration: 0.7 },
          "-=0.55",
        )
        .from(
          "[data-otp-input]",
          { autoAlpha: 0, y: 10, duration: 0.35, stagger: 0.045 },
          "-=0.35",
        );

      gsap.to("[data-verify-glow]", {
        xPercent: 4,
        yPercent: -3,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const element = errorRef.current;

    if (
      !error ||
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const animation = gsap.fromTo(
      element,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );

    return () => {
      animation.revert();
    };
  }, [error]);

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    setError(null);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pastedCode) {
      return;
    }

    const nextCode = Array.from(
      { length: CODE_LENGTH },
      (_, index) => pastedCode[index] ?? "",
    );
    setCode(nextCode);
    setError(null);
    inputRefs.current[Math.min(pastedCode.length, CODE_LENGTH) - 1]?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validation = verificationSchema.safeParse({ otp: code.join("") });

    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ??
          "Enter the complete six-digit verification code.",
      );
      inputRefs.current[code.findIndex((digit) => !digit)]?.focus();
      return;
    }

    const accessToken = CookieManager("get", "access-token");

    if (typeof accessToken !== "string") {
      setError("Your verification session has expired. Please create your account again.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });
      const payload = (await response.json()) as VerificationResponse;

      if (!response.ok) {
        throw new Error(
          getResponseMessage(
            payload,
            "Verification failed. Check the code and try again.",
          ),
        );
      }

      CookieManager("delete", "verify-token");
      CookieManager("set", "register-token", accessToken);

      const roleName = payload.role?.name ?? payload.role_name;
      const rolePrimary = payload.role?.primary_role;
      const primaryRoleName =
        (typeof rolePrimary === "object" ? rolePrimary?.name : rolePrimary) ??
        (typeof payload.primary_role === "object"
          ? payload.primary_role?.name
          : payload.primary_role) ??
        payload.primary_role_name;

      if (roleName) {
        CookieManager("set", "role", roleName);
      }

      if (primaryRoleName) {
        CookieManager("set", "primary_role", primaryRoleName);
      }

      toast.success("Email verified successfully.");
      router.push("/sessions/register");
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Verification failed. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) {
      return;
    }

    const accessToken = CookieManager("get", "access-token");

    if (typeof accessToken !== "string") {
      setError("Your verification session has expired. Please create your account again.");
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const payload = (await response.json()) as VerificationResponse;
        throw new Error(
          getResponseMessage(payload, "We could not send a new code. Please try again."),
        );
      }

      setTimeLeft(RESEND_DELAY_SECONDS);
      toast.success("A new verification code has been sent.");
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "We could not send a new code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div ref={rootRef} className="min-h-full bg-v2-neutral-100 text-v2-neutral-600">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(560px,1.1fr)]">
        <aside data-verify-aside className="relative hidden overflow-hidden bg-v2-neutral-600 px-10 py-12 text-v2-neutral-100 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
          <div data-verify-glow className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,var(--color-v2-neutral-500),transparent_38%)] opacity-50" />

          <Link data-verify-aside-item href="/" className="relative inline-flex w-fit items-center gap-3" aria-label="SynergiSuite home">
            <span className="grid size-10 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600">
              <Zap className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em]">SynergiSuite</span>
          </Link>

          <div data-verify-aside-item className="relative max-w-xl py-16">
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.05em] xl:text-5xl">
              Secure access starts with verification.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-v2-neutral-300">
              Confirm your email to protect your account and make sure important workspace updates reach you.
            </p>

            <div className="mt-12 space-y-3">
              {[
                "A single-use six-digit code",
                "Encrypted account access",
                "Your details stay protected",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-v2-neutral-200">
                  <span className="grid size-7 place-items-center rounded-full border border-v2-neutral-500 bg-v2-neutral-500/20">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p data-verify-aside-item className="relative text-xs text-v2-neutral-400">
            A safer workspace begins with a verified identity.
          </p>
        </aside>

        <section aria-labelledby="verify-title" className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div data-verify-card className="w-full max-w-md">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5" aria-label="SynergiSuite home">
                <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-600 text-v2-neutral-100">
                  <Zap className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-[-0.02em]">SynergiSuite</span>
              </Link>
              <Link href="/sessions?form=signup" className="inline-flex items-center gap-1.5 text-xs font-medium text-v2-neutral-400 transition hover:text-v2-neutral-600">
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Back
              </Link>
            </div>

            <div className="grid size-12 place-items-center rounded-2xl bg-v2-neutral-600 text-v2-neutral-100 shadow-sm">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium text-v2-neutral-400">Verify your email</p>
              <h2 id="verify-title" className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600 sm:text-4xl">
                Enter your security code
              </h2>
              <p className="mt-3 text-sm leading-6 text-v2-neutral-400">
                We sent a six-digit code to{" "}
                <span className="font-medium text-v2-neutral-500">
                  {email || "your email address"}
                </span>
                .
              </p>
            </div>

            {error && (
              <div ref={errorRef} role="alert" className="mt-6 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm leading-5 text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8">
              <Field data-invalid={Boolean(error)}>
                <FieldLabel htmlFor="verification-code-0">Verification code</FieldLabel>
                <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      id={`verification-code-${index}`}
                      data-otp-input
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isVerifying}
                      aria-label={`Verification code digit ${index + 1}`}
                      aria-invalid={Boolean(error)}
                      className="aspect-square min-w-0 rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 text-center text-xl font-semibold text-v2-neutral-600 outline-none transition-[border-color,box-shadow,background-color] hover:border-v2-neutral-400 focus:border-v2-neutral-600 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive/60 disabled:cursor-not-allowed disabled:opacity-50 sm:text-2xl"
                      onChange={(event) => updateDigit(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                    />
                  ))}
                </div>
                <FieldDescription>
                  Paste the complete code or enter one digit in each box.
                </FieldDescription>
              </Field>

              <Button type="submit" size="lg" disabled={isVerifying} aria-busy={isVerifying} className="mt-7 w-full text-sm">
                {isVerifying ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify and continue
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-7 flex flex-col items-center justify-between gap-3 rounded-xl bg-v2-neutral-200/55 px-4 py-3 sm:flex-row">
              <div className="flex items-center gap-2 text-sm text-v2-neutral-400">
                <Mail className="size-4" aria-hidden="true" />
                Didn&apos;t receive the code?
              </div>
              <Button
                type="button"
                variant="link"
                disabled={timeLeft > 0 || isResending}
                onClick={handleResend}
                className="gap-1.5 text-xs text-v2-neutral-600 disabled:no-underline"
              >
                {isResending ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : (
                  <RotateCcw aria-hidden="true" />
                )}
                {timeLeft > 0 ? `Resend in ${formatCountdown(timeLeft)}` : "Resend code"}
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-v2-neutral-400">
              <KeyRound className="size-3.5" aria-hidden="true" />
              The code expires shortly for your security.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
