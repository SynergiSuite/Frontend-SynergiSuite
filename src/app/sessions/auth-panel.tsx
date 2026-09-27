"use client";

import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import type { ZodIssue } from "zod";
import { gsap } from "gsap";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { CookieManager } from "@/lib/cookieManager";
import { loginSchema } from "@/app/session/schema/loginSchema";
import { signupScheme } from "@/app/session/schema/signupSchema";

export type SessionMode = "signin" | "signup";

type FieldName = "name" | "email" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

type AuthResponse = {
  access_token: string;
  user_id: string | number;
  name: string;
  email: string;
  verified?: boolean;
  role?: string | {
    name?: string;
    primary_role?: string | { name?: string };
  };
  role_name?: string;
  primary_role?: string | { name?: string };
  primary_role_name?: string;
  business?: string | {
    name?: string;
    business_id?: string | number;
    id?: string | number;
    _id?: string | number;
  } | null;
  business_name?: string;
  business_id?: string | number;
  message?: string;
};

type AuthPanelProps = {
  initialMode: SessionMode;
};

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow,background-color] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-600 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:opacity-50";

function getErrorMessage(payload: unknown, fallback: string) {
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

function issuesToFieldErrors(issues: ZodIssue[]) {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = issue.path[0];

    if (
      (field === "name" || field === "email" || field === "password") &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
}

function saveIdentity(response: AuthResponse) {
  CookieManager("set", "user-id", response.user_id);
  CookieManager("set", "access-token", response.access_token);
  CookieManager("set", "user-email", response.email);
  CookieManager("set", "user", response.name);

  const roleName =
    (typeof response.role === "object" ? response.role?.name : response.role) ??
    response.role_name;
  const rolePrimary =
    typeof response.role === "object" ? response.role?.primary_role : undefined;
  const primaryRoleName =
    (typeof rolePrimary === "object" ? rolePrimary?.name : rolePrimary) ??
    (typeof response.primary_role === "object"
      ? response.primary_role?.name
      : response.primary_role) ??
    response.primary_role_name;

  if (roleName) {
    CookieManager("set", "role", roleName);
  }

  if (primaryRoleName) {
    CookieManager("set", "primary_role", primaryRoleName);
  }
}

export default function AuthPanel({ initialMode }: AuthPanelProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const modeContentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SessionMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { duration: 0.75, ease: "power3.out" },
      });

      timeline
        .from("[data-auth-aside]", { autoAlpha: 0, xPercent: -2 })
        .from(
          "[data-auth-aside-item]",
          { autoAlpha: 0, x: -18, stagger: 0.08, duration: 0.55 },
          "-=0.4",
        )
        .from(
          "[data-auth-form-shell]",
          { autoAlpha: 0, x: 22 },
          "-=0.65",
        );

      gsap.to("[data-auth-glow]", {
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
    const content = modeContentRef.current;

    if (!content || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const animation = gsap.fromTo(
      content,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" },
    );

    return () => {
      animation.revert();
    };
  }, [mode]);

  useLayoutEffect(() => {
    const error = errorRef.current;

    if (
      !formError ||
      !error ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const animation = gsap.fromTo(
      error,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );

    return () => {
      animation.revert();
    };
  }, [formError]);

  const clearFieldError = (field: FieldName) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const changeMode = (nextMode: SessionMode) => {
    if (nextMode === mode || isSubmitting) {
      return;
    }

    setMode(nextMode);
    setFieldErrors({});
    setFormError(null);
    window.history.replaceState(null, "", `/sessions?form=${nextMode}`);
  };

  const requestEmailVerification = async (accessToken: string) => {
    const response = await fetch("/api/auth/request-verification", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("We could not send your verification email. Please try again.");
    }
  };

  const handleSignin = async () => {
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      setFieldErrors(issuesToFieldErrors(validation.error.issues));
      return;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });
    const payload = (await response.json()) as AuthResponse;

    if (!response.ok) {
      throw new Error(getErrorMessage(payload, "We could not sign you in. Please try again."));
    }

    saveIdentity(payload);

    if (payload.verified === false) {
      await requestEmailVerification(payload.access_token);
      CookieManager("set", "verify-token", payload.access_token);
      toast.success("Signed in. Please verify your email.");
      router.push("/sessions/verify");
      return;
    }

    const business =
      typeof payload.business === "object" && payload.business !== null
        ? payload.business
        : null;
    const businessName = payload.business_name ?? business?.name;
    const businessId =
      payload.business_id ?? business?.business_id ?? business?.id ?? business?._id;

    if (!businessName || !businessId) {
      CookieManager("set", "register-token", payload.access_token);
      toast.success("Signed in. Complete your business setup to continue.");
      router.push("/sessions/register");
      return;
    }

    CookieManager("set", "business-name", businessName);
    CookieManager("set", "business-id", businessId);
    toast.success("Welcome back.");
    router.push("/dashboard");
  };

  const handleSignup = async () => {
    const validation = signupScheme.safeParse({
      name: name.trim(),
      email,
      password,
    });

    if (!name.trim()) {
      setFieldErrors({ name: "Please enter your full name." });
      return;
    }

    if (!validation.success) {
      setFieldErrors(issuesToFieldErrors(validation.error.issues));
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    const payload = (await response.json()) as AuthResponse;

    if (!response.ok) {
      throw new Error(
        getErrorMessage(payload, "We could not create your account. Please try again."),
      );
    }

    await requestEmailVerification(payload.access_token);
    saveIdentity(payload);
    CookieManager("set", "verify-token", payload.access_token);
    toast.success("Account created. Check your email for the verification code.");
    router.push("/sessions/verify");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    setIsSubmitting(true);

    try {
      if (isSignup) {
        await handleSignup();
      } else {
        await handleSignin();
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={rootRef} className="min-h-full bg-v2-neutral-100 text-v2-neutral-600">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(560px,1.1fr)]">
        <aside data-auth-aside className="relative hidden overflow-hidden bg-v2-neutral-600 px-10 py-12 text-v2-neutral-100 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
          <div data-auth-glow className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,var(--color-v2-neutral-500),transparent_38%)] opacity-50" />
          <Link data-auth-aside-item href="/" className="relative inline-flex w-fit items-center gap-3" aria-label="SynergiSuite home">
            <span className="grid size-10 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600">
              <Zap className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em]">SynergiSuite</span>
          </Link>

          <div data-auth-aside-item className="relative max-w-xl py-16">
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.05em] xl:text-5xl">
              One calm workspace for your entire business.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-v2-neutral-300">
              Bring your people, projects, clients, and insights together—then move forward with shared context.
            </p>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {[
                { icon: UsersRound, label: "People aligned" },
                { icon: BarChart3, label: "Insights ready" },
                { icon: ShieldCheck, label: "Work protected" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-v2-neutral-500 bg-v2-neutral-500/15 p-4">
                  <Icon className="size-4 text-v2-neutral-200" aria-hidden="true" />
                  <p className="mt-6 text-xs font-medium text-v2-neutral-200">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p data-auth-aside-item className="relative text-xs text-v2-neutral-400">
            Built for teams that value clarity over complexity.
          </p>
        </aside>

        <section
          aria-labelledby="auth-title"
          data-auth-form-shell
          className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20"
        >
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5" aria-label="SynergiSuite home">
                <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-600 text-v2-neutral-100">
                  <Zap className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-[-0.02em]">SynergiSuite</span>
              </Link>
              <Link href="/" className="text-xs font-medium text-v2-neutral-400 transition hover:text-v2-neutral-600">
                Back to home
              </Link>
            </div>

            <div ref={modeContentRef}>
              <div className="mb-8">
                <p className="text-sm font-medium text-v2-neutral-400">
                  {isSignup ? "Create your workspace" : "Welcome back"}
                </p>
                <h2 id="auth-title" className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600 sm:text-4xl">
                  {isSignup ? "Start with SynergiSuite" : "Sign in to your account"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-v2-neutral-400">
                  {isSignup
                    ? "Set up your account and bring your business into one connected place."
                    : "Enter your details to continue to your workspace."}
                </p>
              </div>

              <div className="mb-7 grid grid-cols-2 rounded-xl bg-v2-neutral-200/70 p-1" aria-label="Choose authentication mode">
                <Button
                  type="button"
                  variant="ghost"
                  aria-pressed={!isSignup}
                  onClick={() => changeMode("signin")}
                  className={`h-10 rounded-lg ${!isSignup ? "bg-v2-neutral-100 text-v2-neutral-600 shadow-sm hover:bg-v2-neutral-100" : "text-v2-neutral-400 hover:bg-transparent"}`}
                >
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  aria-pressed={isSignup}
                  onClick={() => changeMode("signup")}
                  className={`h-10 rounded-lg ${isSignup ? "bg-v2-neutral-100 text-v2-neutral-600 shadow-sm hover:bg-v2-neutral-100" : "text-v2-neutral-400 hover:bg-transparent"}`}
                >
                  Create account
                </Button>
              </div>

              {formError && (
                <div ref={errorRef} role="alert" className="mb-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm leading-5 text-destructive">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                {isSignup && (
                  <Field data-invalid={Boolean(fieldErrors.name)}>
                    <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={name}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? "signup-name-error" : undefined}
                      data-slot="input"
                      className={inputClassName}
                      onChange={(event) => {
                        setName(event.target.value);
                        clearFieldError("name");
                      }}
                    />
                    <FieldError id="signup-name-error">{fieldErrors.name}</FieldError>
                  </Field>
                )}

                <Field data-invalid={Boolean(fieldErrors.email)}>
                  <FieldLabel htmlFor="auth-email">Work email</FieldLabel>
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email
                        ? "auth-email-error"
                        : isSignup
                          ? "auth-email-description"
                          : undefined
                    }
                    data-slot="input"
                    className={inputClassName}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearFieldError("email");
                    }}
                  />
                  {isSignup && !fieldErrors.email && (
                    <FieldDescription id="auth-email-description">
                      We&apos;ll use this for account verification.
                    </FieldDescription>
                  )}
                  <FieldError id="auth-email-error">{fieldErrors.email}</FieldError>
                </Field>

                <Field data-invalid={Boolean(fieldErrors.password)}>
                  <div className="flex items-center justify-between gap-4">
                    <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                    {!isSignup && (
                      <Button
                        type="button"
                        variant="link"
                        className="text-xs font-medium text-v2-neutral-400 hover:text-v2-neutral-600"
                        onClick={() => toast.info("Password recovery will be available soon.")}
                      >
                        Forgot password?
                      </Button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="auth-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      placeholder="At least 8 characters"
                      value={password}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={
                        fieldErrors.password
                          ? "auth-password-error"
                          : isSignup
                            ? "auth-password-description"
                            : undefined
                      }
                      data-slot="input"
                      className={`${inputClassName} pr-12`}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearFieldError("password");
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isSubmitting}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-v2-neutral-400 hover:bg-v2-neutral-200/70 hover:text-v2-neutral-600 active:scale-100"
                    >
                      {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </Button>
                  </div>
                  {isSignup && !fieldErrors.password && (
                    <FieldDescription id="auth-password-description">
                      Use 8 or more characters.
                    </FieldDescription>
                  )}
                  <FieldError id="auth-password-error">{fieldErrors.password}</FieldError>
                </Field>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="mt-1 w-full text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="animate-spin" aria-hidden="true" />
                      {isSignup ? "Creating account..." : "Signing in..."}
                    </>
                  ) : (
                    <>
                      {isSignup ? "Create account" : "Sign in"}
                      <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </Button>
              </FieldGroup>
              </form>

              <div className="mt-7 flex items-center justify-center gap-2 text-sm text-v2-neutral-400">
                <Check className="size-3.5" aria-hidden="true" />
                <span>{isSignup ? "No credit card required" : "Secure access to your workspace"}</span>
              </div>

              <p className="mt-10 text-center text-xs leading-5 text-v2-neutral-400">
                By continuing, you agree to SynergiSuite&apos;s terms and privacy policy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
