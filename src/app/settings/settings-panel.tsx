"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  KeyRound,
  Layers3,
  LoaderCircle,
  Mail,
  Save,
  Settings2,
  Shield,
  ShieldCheck,
  ShieldPlus,
  SlidersHorizontal,
  UserRound,
  Volume2,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

import { fetchRoles } from "@/app/employees/apis/getRoleApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { CookieManager } from "@/lib/cookieManager";
import { cn } from "@/lib/utils";

import {
  createCustomRole,
  fetchPrimaryRoles,
  type CustomRole,
  type PrimaryRole,
} from "./apis/roleApis";

type SettingsView = "personal" | "business";

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow,background-color] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:bg-v2-neutral-200 disabled:text-v2-neutral-400";

function formatRole(role: string) {
  if (!role) {
    return "Employee";
  }

  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-0">
      <CardHeader className="flex flex-row items-start gap-3 border-b border-v2-neutral-200 pb-5 pt-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-v2-neutral-600 text-v2-neutral-100">
          {icon}
        </span>
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}

function PreferenceToggle({
  id,
  checked,
  onChange,
  icon,
  title,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-v2-neutral-200 bg-v2-neutral-200/30 p-4 transition-colors hover:border-v2-neutral-300"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-500 shadow-sm">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-v2-neutral-600">{title}</span>
          <span className="mt-0.5 block text-xs leading-5 text-v2-neutral-400">
            {description}
          </span>
        </span>
      </span>
      <span className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-v2-neutral-300 transition-colors peer-checked:bg-v2-neutral-600 peer-focus-visible:ring-[3px] peer-focus-visible:ring-v2-neutral-400/25" />
        <span className="absolute left-1 top-1 size-4 rounded-full bg-v2-neutral-100 shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default function SettingsPanel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<SettingsView>("personal");
  const [primaryRole, setPrimaryRole] = useState("");
  const [role, setRole] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [businessNameInput, setBusinessNameInput] = useState("");
  const [primaryRoles, setPrimaryRoles] = useState<PrimaryRole[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPrimaryRoleId, setSelectedPrimaryRoleId] = useState<number | "">("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isLoadingPrimaryRoles, setIsLoadingPrimaryRoles] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  useEffect(() => {
    const storedPrimaryRole = String(
      CookieManager("get", "primary_role") || CookieManager("get", "role") || "",
    ).toLowerCase();
    const storedRole = String(CookieManager("get", "role") || "");
    console.log("storedRole: ", storedRole);
    console.log("storedPrimaryRole: ", storedPrimaryRole);
    const storedName = String(CookieManager("get", "user") || "User");
    const storedEmail = String(CookieManager("get", "user-email") || "");
    const storedBusinessName = String(
      CookieManager("get", "business-name") || "Synergi Business",
    );

    setPrimaryRole(storedPrimaryRole);
    setRole(storedRole);
    setBusinessId(String(CookieManager("get", "business-id") || ""));
    setNameInput(storedName);
    setEmailInput(storedEmail);
    setBusinessNameInput(storedBusinessName);
  }, []);

  const canManageBusiness =
    primaryRole.includes("founder") ||
    primaryRole.includes("manager") ||
    primaryRole.includes("admin");

  const loadRoles = useCallback(async () => {
    setRolesError(null);
    setIsLoadingPrimaryRoles(true);
    setIsLoadingRoles(true);

    const [primaryResult, rolesResult] = await Promise.allSettled([
      fetchPrimaryRoles(),
      fetchRoles(),
    ]);

    if (primaryResult.status === "fulfilled") {
      setPrimaryRoles(primaryResult.value);
      setSelectedPrimaryRoleId((current) => current || primaryResult.value[0]?.id || "");
    } else {
      setRolesError("Primary access roles could not be loaded.");
    }

    if (rolesResult.status === "fulfilled") {
      setCustomRoles(rolesResult.value as CustomRole[]);
    } else {
      setRolesError("Business roles could not be loaded. Please try again.");
    }

    setIsLoadingPrimaryRoles(false);
    setIsLoadingRoles(false);
  }, []);

  useEffect(() => {
    if (activeView === "business" && canManageBusiness) {
      void loadRoles();
    }
  }, [activeView, canManageBusiness, loadRoles]);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-settings-header]", { autoAlpha: 0, y: 12, duration: 0.5 })
        .from(
          "[data-settings-nav]",
          { autoAlpha: 0, x: -10, duration: 0.45 },
          "-=0.25",
        )
        .from(
          "[data-settings-content]",
          { autoAlpha: 0, y: 14, duration: 0.5 },
          "-=0.35",
        );
    }, root);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const content = contentRef.current;

    if (!content || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const animation = gsap.fromTo(
      content.children,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.055, ease: "power3.out" },
    );

    return () => {
      animation.revert();
    };
  }, [activeView]);

  const handleSavePersonal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);

    if ((newPassword || confirmPassword) && !currentPassword) {
      setPasswordError("Enter your current password before choosing a new one.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("The new password and confirmation do not match.");
      return;
    }

    toast.success("Personal settings saved.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveBusiness = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!businessNameInput.trim()) {
      toast.error("Business name cannot be empty.");
      return;
    }

    toast.success("Business settings saved.");
  };

  const handleCreateRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newRoleName.trim()) {
      toast.error("Enter a role name.");
      return;
    }

    if (!selectedPrimaryRoleId) {
      toast.error("Select a primary access role.");
      return;
    }

    setIsCreatingRole(true);

    try {
      await createCustomRole(newRoleName.trim(), Number(selectedPrimaryRoleId));
      toast.success(`Role “${newRoleName.trim()}” created.`);
      setNewRoleName("");
      const updatedRoles = await fetchRoles();
      setCustomRoles(updatedRoles as CustomRole[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The role could not be created.");
    } finally {
      setIsCreatingRole(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="min-h-full text-v2-neutral-100"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-10">
        <header
          data-settings-header
          className="flex flex-col gap-5 border-b border-v2-neutral-500 pb-7 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-v2-neutral-500 bg-v2-neutral-500/55 px-3 py-1.5 text-xs font-medium text-v2-neutral-200">
              <Settings2 className="size-3.5" aria-hidden="true" />
              Workspace settings
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-100 sm:text-4xl">
              Settings and preferences
            </h1>
            <p className="mt-3 text-sm leading-6 text-v2-neutral-300">
              Manage your profile, security preferences, and workspace access from one place.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-v2-neutral-500 bg-v2-neutral-500/55 px-3 py-2 text-xs text-v2-neutral-300 sm:self-auto">
            <ShieldCheck className="size-3.5 text-v2-neutral-200" aria-hidden="true" />
            Signed in as
            <span className="font-medium text-v2-neutral-100">{formatRole(primaryRole || role)}</span>
          </div>
        </header>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Card
            data-settings-nav
            size="sm"
            aria-label="Settings sections"
            className="p-2 lg:sticky lg:top-4"
          >
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:space-y-1">
              <button
                type="button"
                aria-current={activeView === "personal" ? "page" : undefined}
                onClick={() => setActiveView("personal")}
                className={cn(
                  "group flex min-w-[220px] items-center gap-3 rounded-xl p-3 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-v2-neutral-400/25 lg:min-w-0 lg:w-full",
                  activeView === "personal"
                    ? "bg-v2-neutral-600 text-v2-neutral-100"
                    : "text-v2-neutral-500 hover:bg-v2-neutral-200/55",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl",
                    activeView === "personal"
                      ? "bg-v2-neutral-500 text-v2-neutral-100"
                      : "bg-v2-neutral-200 text-v2-neutral-500",
                  )}
                >
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">Personal</span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-xs",
                      activeView === "personal" ? "text-v2-neutral-300" : "text-v2-neutral-400",
                    )}
                  >
                    Profile, security, preferences
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden="true" />
              </button>

              {canManageBusiness ? (
                <button
                  type="button"
                  aria-current={activeView === "business" ? "page" : undefined}
                  onClick={() => setActiveView("business")}
                  className={cn(
                    "group flex min-w-[220px] items-center gap-3 rounded-xl p-3 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-v2-neutral-400/25 lg:min-w-0 lg:w-full",
                    activeView === "business"
                      ? "bg-v2-neutral-600 text-v2-neutral-100"
                      : "text-v2-neutral-500 hover:bg-v2-neutral-200/55",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl",
                      activeView === "business"
                        ? "bg-v2-neutral-500 text-v2-neutral-100"
                        : "bg-v2-neutral-200 text-v2-neutral-500",
                    )}
                  >
                    <Building2 className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      Business
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider",
                          activeView === "business"
                            ? "bg-v2-neutral-100/15 text-v2-neutral-200"
                            : "bg-v2-neutral-200 text-v2-neutral-400",
                        )}
                      >
                        Admin
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block truncate text-xs",
                        activeView === "business" ? "text-v2-neutral-300" : "text-v2-neutral-400",
                      )}
                    >
                      Organization and access roles
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                </button>
              ) : (
                <div className="min-w-[220px] rounded-xl border border-v2-neutral-200 bg-v2-neutral-200/25 p-3 lg:min-w-0">
                  <div className="flex items-center gap-2 text-xs font-medium text-v2-neutral-500">
                    <Shield className="size-3.5" aria-hidden="true" />
                    Business settings locked
                  </div>
                  <p className="mt-1.5 text-[11px] leading-4 text-v2-neutral-400">
                    Founder or manager access is required.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-2 hidden px-3 pb-2 pt-2 lg:block">
              <Separator className="mb-4" />
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-v2-neutral-400">
                Current access
              </p>
              <p className="mt-2 truncate text-sm font-medium text-v2-neutral-600">
                {formatRole(role)}
              </p>
              <p className="mt-0.5 truncate text-xs text-v2-neutral-400">
                {formatRole(primaryRole)} permissions
              </p>
            </div>
          </Card>

          <div ref={contentRef} data-settings-content className="min-w-0 space-y-5">
            {activeView === "personal" ? (
              <form onSubmit={handleSavePersonal} className="space-y-5">
                <SettingsSection
                  icon={<UserRound className="size-4" aria-hidden="true" />}
                  title="Personal information"
                  description="Update the identity attached to your SynergiSuite account."
                >
                  <FieldGroup className="gap-5 sm:grid sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="settings-name">Full name</FieldLabel>
                      <input
                        id="settings-name"
                        name="name"
                        value={nameInput}
                        onChange={(event) => setNameInput(event.target.value)}
                        className={inputClassName}
                        autoComplete="name"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="settings-email">Email address</FieldLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                        <input
                          id="settings-email"
                          name="email"
                          type="email"
                          value={emailInput}
                          onChange={(event) => setEmailInput(event.target.value)}
                          className={`${inputClassName} pl-11`}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </Field>
                  </FieldGroup>
                </SettingsSection>

                <SettingsSection
                  icon={<KeyRound className="size-4" aria-hidden="true" />}
                  title="Password and security"
                  description="Leave these fields empty if you do not want to change your password."
                >
                  <FieldGroup className="gap-5 lg:grid lg:grid-cols-3">
                    <Field data-invalid={Boolean(passwordError)}>
                      <FieldLabel htmlFor="current-password">Current password</FieldLabel>
                      <input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(event) => {
                          setCurrentPassword(event.target.value);
                          setPasswordError(null);
                        }}
                        placeholder="Enter current password"
                        className={inputClassName}
                        autoComplete="current-password"
                      />
                    </Field>
                    <Field data-invalid={Boolean(passwordError)}>
                      <FieldLabel htmlFor="new-password">New password</FieldLabel>
                      <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => {
                          setNewPassword(event.target.value);
                          setPasswordError(null);
                        }}
                        placeholder="Enter new password"
                        className={inputClassName}
                        autoComplete="new-password"
                      />
                    </Field>
                    <Field data-invalid={Boolean(passwordError)}>
                      <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                      <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          setPasswordError(null);
                        }}
                        placeholder="Repeat new password"
                        className={inputClassName}
                        autoComplete="new-password"
                      />
                    </Field>
                  </FieldGroup>
                  {passwordError && <FieldError className="mt-3">{passwordError}</FieldError>}
                </SettingsSection>

                <SettingsSection
                  icon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
                  title="App preferences"
                  description="Choose how SynergiSuite keeps you informed during the workday."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <PreferenceToggle
                      id="email-notifications"
                      checked={emailNotifications}
                      onChange={setEmailNotifications}
                      icon={<BellRing className="size-4" aria-hidden="true" />}
                      title="Email notifications"
                      description="Receive a daily activity digest."
                    />
                    <PreferenceToggle
                      id="sound-alerts"
                      checked={soundAlerts}
                      onChange={setSoundAlerts}
                      icon={<Volume2 className="size-4" aria-hidden="true" />}
                      title="Sound alerts"
                      description="Play a chime for new events."
                    />
                  </div>
                </SettingsSection>

                <div className="flex justify-end pt-1">
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    <Save aria-hidden="true" />
                    Save personal settings
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <SettingsSection
                  icon={<BriefcaseBusiness className="size-4" aria-hidden="true" />}
                  title="Business organization"
                  description="Manage the workspace details shared across your organization."
                >
                  <form onSubmit={handleSaveBusiness}>
                    <FieldGroup className="gap-5 sm:grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="business-name">Business name</FieldLabel>
                        <input
                          id="business-name"
                          value={businessNameInput}
                          onChange={(event) => setBusinessNameInput(event.target.value)}
                          className={inputClassName}
                          autoComplete="organization"
                          required
                        />
                      </Field>
                    </FieldGroup>
                    <div className="mt-6 flex justify-end">
                      <Button type="submit" size="lg" className="w-full sm:w-auto">
                        <Save aria-hidden="true" />
                        Save business details
                      </Button>
                    </div>
                  </form>
                </SettingsSection>

                <SettingsSection
                  icon={<ShieldPlus className="size-4" aria-hidden="true" />}
                  title="Roles and access"
                  description="Create workspace roles and map each one to a primary permission level."
                >
                  <div className="grid items-start gap-5 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
                    <form
                      onSubmit={handleCreateRole}
                      className="rounded-2xl border border-v2-neutral-200 bg-v2-neutral-200/25 p-4 sm:p-5"
                    >
                      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-v2-neutral-600">
                        <ShieldPlus className="size-4" aria-hidden="true" />
                        Add a custom role
                      </div>

                      <FieldGroup className="gap-5">
                        <Field>
                          <FieldLabel htmlFor="role-name">Role name</FieldLabel>
                          <input
                            id="role-name"
                            value={newRoleName}
                            onChange={(event) => setNewRoleName(event.target.value)}
                            placeholder="e.g. Senior developer"
                            className={inputClassName}
                            required
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="primary-access-role">Primary access role</FieldLabel>
                          <Select
                            value={selectedPrimaryRoleId ? String(selectedPrimaryRoleId) : ""}
                            onValueChange={(value) => setSelectedPrimaryRoleId(Number(value))}
                            disabled={isLoadingPrimaryRoles}
                          >
                            <SelectTrigger
                              id="primary-access-role"
                              className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20"
                            >
                              {isLoadingPrimaryRoles && (
                                <LoaderCircle className="size-4 animate-spin text-v2-neutral-400" aria-hidden="true" />
                              )}
                              <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                              {primaryRoles
                                .filter((item) => !item.name.toLowerCase().includes("client"))
                                .map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                    className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600"
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FieldDescription>
                            Defines the permission boundary for this role.
                          </FieldDescription>
                        </Field>
                      </FieldGroup>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isCreatingRole || isLoadingPrimaryRoles}
                        className="mt-6 w-full"
                      >
                        {isCreatingRole ? (
                          <LoaderCircle className="animate-spin" aria-hidden="true" />
                        ) : (
                          <ShieldPlus aria-hidden="true" />
                        )}
                        {isCreatingRole ? "Creating role..." : "Create role"}
                      </Button>
                    </form>

                    <div className="min-w-0 rounded-2xl border border-v2-neutral-200 bg-v2-neutral-200/25 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-4 border-b border-v2-neutral-200 pb-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-v2-neutral-600">
                          <Layers3 className="size-4" aria-hidden="true" />
                          Available roles
                        </div>
                        <span className="rounded-lg bg-v2-neutral-200 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-v2-neutral-500">
                          {customRoles.length} total
                        </span>
                      </div>

                      {rolesError && (
                        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                          {rolesError}{" "}
                          <button
                            type="button"
                            className="font-medium underline underline-offset-4"
                            onClick={() => void loadRoles()}
                          >
                            Try again
                          </button>
                        </div>
                      )}

                      {isLoadingRoles ? (
                        <div className="flex min-h-44 items-center justify-center gap-2 text-sm text-v2-neutral-400">
                          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                          Loading roles...
                        </div>
                      ) : customRoles.length === 0 ? (
                        <div className="flex min-h-44 flex-col items-center justify-center text-center">
                          <span className="grid size-10 place-items-center rounded-xl bg-v2-neutral-200 text-v2-neutral-400">
                            <Shield className="size-4" aria-hidden="true" />
                          </span>
                          <p className="mt-3 text-sm font-medium text-v2-neutral-500">No custom roles yet</p>
                          <p className="mt-1 text-xs text-v2-neutral-400">Create one using the form beside this list.</p>
                        </div>
                      ) : (
                        <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1" data-sidebar-scroll>
                          {customRoles.map((item) => (
                            <div
                              key={item.id || item.name}
                              className="flex items-center gap-3 rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 p-3"
                            >
                              <Avatar className="size-9 rounded-xl">
                                <AvatarFallback className="rounded-xl bg-v2-neutral-600 text-xs font-semibold text-v2-neutral-100">
                                  {item.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-v2-neutral-600">
                                  {item.name}
                                </span>
                                <span className="mt-0.5 block truncate text-xs text-v2-neutral-400">
                                  {item.primary_role?.name ||
                                    (item.primary_role_id
                                      ? `Primary role ${item.primary_role_id}`
                                      : "Workspace role")}
                                </span>
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-v2-neutral-200/70 px-2 py-1 text-[10px] font-medium text-v2-neutral-500">
                                <Check className="size-3" aria-hidden="true" />
                                Active
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
