"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  CircleUserRound,
  KeyRound,
  Layers3,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

import { registerBusinessScheme } from "@/app/session/schema/registerBusinessSchema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CookieManager } from "@/lib/cookieManager";

type OnboardingMode = "create" | "join" | "client";

type Category = {
  id: string | number;
  name: string;
};

type BusinessResponse = {
  message?: string | string[];
  business_name?: string;
  business_id?: string | number;
  business?: {
    name?: string;
    id?: string | number;
    _id?: string | number;
    business_id?: string | number;
  };
  role?: string | {
    name?: string;
    primary_role?: string | { name?: string };
  };
  role_name?: string;
  primary_role?: string | { name?: string };
  primary_role_name?: string;
};

type ModeOption = {
  value: OnboardingMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
};

const MODES: ModeOption[] = [
  {
    value: "create",
    label: "Create a new business",
    shortLabel: "Create a workspace",
    description: "Start a workspace and invite your team when you are ready.",
    icon: Building2,
  },
  {
    value: "join",
    label: "Join an existing business",
    shortLabel: "Join a workspace",
    description: "Use an invitation token shared by your workspace admin.",
    icon: UserRoundPlus,
  },
  {
    value: "client",
    label: "Join as an invited client",
    shortLabel: "Join as a client",
    description: "Access projects and collaboration using a client invitation.",
    icon: CircleUserRound,
  },
];

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow,background-color] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-600 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:opacity-50";

function getMessage(payload: BusinessResponse, fallback: string) {
  if (Array.isArray(payload.message)) {
    return payload.message.join(". ");
  }

  return typeof payload.message === "string" ? payload.message : fallback;
}

function parseCategories(payload: unknown): Category[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  if ("data" in payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  if ("categories" in payload && Array.isArray(payload.categories)) {
    return payload.categories;
  }

  return [];
}

function saveWorkspace(response: BusinessResponse, clientFallback = false) {
  const business = response.business;
  const businessName = response.business_name ?? business?.name;
  const businessId =
    response.business_id ?? business?.business_id ?? business?.id ?? business?._id;

  if (!businessName || !businessId) {
    throw new Error("The workspace was connected, but its details were not returned. Please try again.");
  }

  CookieManager("set", "business-name", businessName);
  CookieManager("set", "business-id", businessId);

  const roleName =
    (typeof response.role === "object" ? response.role?.name : response.role) ??
    response.role_name ??
    (clientFallback ? "client" : undefined);
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

  CookieManager("delete", "register-token");
}

export default function RegisterPanel() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<OnboardingMode>("create");
  const [name, setName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("10");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [invitationToken, setInvitationToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMode = MODES.find((item) => item.value === mode) ?? MODES[0];
  const ActiveModeIcon = activeMode.icon;

  const getAccessToken = useCallback(() => {
    const accessToken = CookieManager("get", "access-token");

    if (typeof accessToken !== "string") {
      throw new Error("Your setup session has expired. Please sign in again.");
    }

    return accessToken;
  }, []);

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setCategoryError(null);

    try {
      const response = await fetch("/api/business/categories", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessage(
            (payload ?? {}) as BusinessResponse,
            "We could not load business categories.",
          ),
        );
      }

      const categoryList = parseCategories(payload);
      setCategories(categoryList);
      setCategoryId((current) => current || String(categoryList[0]?.id ?? ""));

      if (categoryList.length === 0) {
        setCategoryError("No business categories are available right now.");
      }
    } catch (error) {
      setCategoryError(
        error instanceof Error ? error.message : "We could not load business categories.",
      );
    } finally {
      setIsLoadingCategories(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-register-aside]", {
          autoAlpha: 0,
          xPercent: -2,
          duration: 0.75,
        })
        .from(
          "[data-register-aside-item]",
          { autoAlpha: 0, x: -18, duration: 0.55, stagger: 0.08 },
          "-=0.4",
        )
        .from(
          "[data-register-card]",
          { autoAlpha: 0, y: 20, duration: 0.7 },
          "-=0.55",
        );

      gsap.to("[data-register-glow]", {
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
    const content = formContentRef.current;

    if (!content || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const animation = gsap.fromTo(
      content,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" },
    );

    return () => {
      animation.revert();
    };
  }, [mode]);

  useLayoutEffect(() => {
    if (
      !formError ||
      !errorRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const animation = gsap.fromTo(
      errorRef.current,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );

    return () => {
      animation.revert();
    };
  }, [formError]);

  const changeMode = (nextMode: string) => {
    if (nextMode === mode || isSubmitting) {
      return;
    }

    setMode(nextMode as OnboardingMode);
    setFormError(null);
    setInvitationToken("");
  };

  const submitCreate = async (accessToken: string) => {
    const validation = registerBusinessScheme.safeParse({
      name: name.trim(),
      number_of_employees: Number(employeeCount),
      category_id: Number(categoryId),
    });

    if (!validation.success) {
      throw new Error(validation.error.issues[0]?.message ?? "Check your business details.");
    }

    const response = await fetch("/api/business/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });
    const payload = (await response.json().catch(() => ({}))) as BusinessResponse;

    if (!response.ok) {
      throw new Error(getMessage(payload, "We could not create your workspace."));
    }

    saveWorkspace(payload);
    toast.success("Your workspace is ready.");
  };

  const submitJoin = async (accessToken: string) => {
    const token = invitationToken.trim();

    if (!token) {
      throw new Error(
        mode === "client"
          ? "Enter your client invitation token."
          : "Enter your business invitation token.",
      );
    }

    const response = await fetch("/api/business/join", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const payload = (await response.json().catch(() => ({}))) as BusinessResponse;

    if (!response.ok) {
      throw new Error(getMessage(payload, "We could not join this workspace."));
    }

    saveWorkspace(payload, mode === "client");
    toast.success(mode === "client" ? "Client access confirmed." : "Workspace joined successfully.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const accessToken = getAccessToken();

      if (mode === "create") {
        await submitCreate(accessToken);
      } else {
        await submitJoin(accessToken);
      }

      router.replace("/dashboard");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    ["access-token", "register-token", "verify-token", "user-email", "user", "user-id"].forEach(
      (cookie) => CookieManager("delete", cookie),
    );
    router.replace("/sessions?form=signin");
  };

  return (
    <div ref={rootRef} className="min-h-full bg-v2-neutral-100 text-v2-neutral-600">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(560px,1.1fr)]">
        <aside
          data-register-aside
          className="relative hidden overflow-hidden bg-v2-neutral-600 px-10 py-12 text-v2-neutral-100 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14"
        >
          <div
            data-register-glow
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,var(--color-v2-neutral-500),transparent_38%)] opacity-50"
          />

          <Link
            data-register-aside-item
            href="/"
            className="relative inline-flex w-fit items-center gap-3"
            aria-label="SynergiSuite home"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600">
              <Zap className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em]">SynergiSuite</span>
          </Link>

          <div data-register-aside-item className="relative max-w-xl py-16">
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.05em] xl:text-5xl">
              Turn your account into a working hub.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-v2-neutral-300">
              Create a workspace for your business or use an invitation to join the people and projects already waiting for you.
            </p>

            <div className="mt-12 grid gap-3">
              {["People and team management", "Projects, clients, and analytics", "One secure, connected workspace"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-v2-neutral-200">
                    <span className="grid size-7 place-items-center rounded-full border border-v2-neutral-500 bg-v2-neutral-500/20">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <p data-register-aside-item className="relative text-xs text-v2-neutral-400">
            Your setup can be updated later from workspace settings.
          </p>
        </aside>

        <section
          aria-labelledby="register-title"
          className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20"
        >
          <div data-register-card className="w-full max-w-lg py-4">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5" aria-label="SynergiSuite home">
                <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-600 text-v2-neutral-100">
                  <Zap className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-[-0.02em]">SynergiSuite</span>
              </Link>
              <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut aria-hidden="true" />
                Sign out
              </Button>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-v2-neutral-400">Workspace setup</p>
                <h2
                  id="register-title"
                  className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600 sm:text-4xl"
                >
                  Choose how to get started
                </h2>
                <p className="mt-3 text-sm leading-6 text-v2-neutral-400">
                  Tell us where you belong. This only takes a minute.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden lg:inline-flex"
              >
                <LogOut aria-hidden="true" />
                Sign out
              </Button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-8">
              <Field>
                <FieldLabel>Setup path</FieldLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="h-auto min-h-14 w-full justify-between px-4 py-3 text-left"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-600">
                          <ActiveModeIcon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{activeMode.label}</span>
                          <span className="mt-0.5 block truncate text-xs font-normal text-v2-neutral-400">
                            {activeMode.description}
                          </span>
                        </span>
                      </span>
                      <ChevronDown className="ml-3 size-4 shrink-0 text-v2-neutral-400" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    <DropdownMenuRadioGroup value={mode} onValueChange={changeMode}>
                      {MODES.map((option) => {
                        const Icon = option.icon;

                        return (
                          <DropdownMenuRadioItem key={option.value} value={option.value} className="py-2.5">
                            <Icon className="size-4" aria-hidden="true" />
                            <span className="min-w-0">
                              <span className="block font-medium">{option.shortLabel}</span>
                              <span className="mt-0.5 block text-xs leading-4 text-v2-neutral-400">
                                {option.description}
                              </span>
                            </span>
                          </DropdownMenuRadioItem>
                        );
                      })}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>

              {formError && (
                <div
                  ref={errorRef}
                  role="alert"
                  className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm leading-5 text-destructive"
                >
                  {formError}
                </div>
              )}

              <div ref={formContentRef} key={mode} className="mt-6">
                {mode === "create" ? (
                  <FieldGroup className="gap-5">
                    <Field>
                      <FieldLabel htmlFor="business-name">Business name</FieldLabel>
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                        <input
                          id="business-name"
                          name="businessName"
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value);
                            setFormError(null);
                          }}
                          className={`${inputClassName} pl-11`}
                          placeholder="Acme Studio"
                          autoComplete="organization"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="employee-count">Team size</FieldLabel>
                        <div className="relative">
                          <UsersRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                          <input
                            id="employee-count"
                            name="employeeCount"
                            type="number"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            value={employeeCount}
                            onChange={(event) => {
                              setEmployeeCount(event.target.value);
                              setFormError(null);
                            }}
                            className={`${inputClassName} pl-11`}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                      </Field>

                      <Field data-invalid={Boolean(categoryError)}>
                        <FieldLabel htmlFor="business-category">Category</FieldLabel>
                        <Select
                          value={categoryId}
                          onValueChange={(value) => {
                            setCategoryId(value);
                            setFormError(null);
                          }}
                          disabled={isLoadingCategories || isSubmitting || categories.length === 0}
                        >
                          <SelectTrigger
                            id="business-category"
                            className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-600 focus-visible:ring-v2-neutral-400/20"
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              {isLoadingCategories ? (
                                <LoaderCircle className="size-4 animate-spin text-v2-neutral-400" aria-hidden="true" />
                              ) : (
                                <Layers3 className="size-4 text-v2-neutral-400" aria-hidden="true" />
                              )}
                              <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
                            </span>
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                                className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600"
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {categoryError && (
                          <FieldError>
                            {categoryError}{" "}
                            <button type="button" className="underline underline-offset-4" onClick={() => void loadCategories()}>
                              Try again
                            </button>
                          </FieldError>
                        )}
                      </Field>
                    </div>
                  </FieldGroup>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="invitation-token">
                      {mode === "client" ? "Client invitation token" : "Business invitation token"}
                    </FieldLabel>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                      <input
                        id="invitation-token"
                        name="invitationToken"
                        value={invitationToken}
                        onChange={(event) => {
                          setInvitationToken(event.target.value);
                          setFormError(null);
                        }}
                        className={`${inputClassName} pl-11`}
                        placeholder="Paste your invitation token"
                        autoComplete="off"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <FieldDescription>
                      Invitation tokens are provided by a business admin and may expire.
                    </FieldDescription>
                  </Field>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || (mode === "create" && (isLoadingCategories || categories.length === 0))}
                aria-busy={isSubmitting}
                className="mt-7 w-full text-sm"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    {mode === "create" ? "Creating workspace..." : "Checking invitation..."}
                  </>
                ) : (
                  <>
                    {mode === "create" ? "Create workspace" : "Join workspace"}
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-v2-neutral-400">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Your account and workspace data stay securely connected.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
