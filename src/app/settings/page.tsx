"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  User,
  Building2,
  Settings,
  Shield,
  Save,
  Sparkles,
  ChevronRight,
  UserCheck,
  Briefcase,
  KeyRound,
  Sliders,
  ShieldPlus,
  Loader2,
  CheckCircle2,
  Palette,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { toast } from "sonner";
import { CookieManager } from "@/lib/cookieManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchPrimaryRoles,
  createCustomRole,
  PrimaryRole,
  CustomRole,
} from "./apis/roleApis";
import { fetchRoles } from "@/app/employees/apis/getRoleApi";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"personal" | "business">("personal");
  const [primaryRole, setPrimaryRole] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [businessId, setBusinessId] = useState<string>("");

  // Personal form states
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  // Business form states
  const [bizNameInput, setBizNameInput] = useState("");

  // Custom Roles & Access Management states
  const [primaryRoles, setPrimaryRoles] = useState<PrimaryRole[]>([]);
  const [createdRoles, setCreatedRoles] = useState<CustomRole[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPrimaryRoleId, setSelectedPrimaryRoleId] = useState<number | "">("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isLoadingPrimaryRoles, setIsLoadingPrimaryRoles] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawPrimaryRole = String(
      CookieManager("get", "primary_role") || CookieManager("get", "role") || ""
    ).toLowerCase();
    const rawRole = String(CookieManager("get", "role") || "");
    const rawUser = String(CookieManager("get", "user") || "User");
    const rawEmail = String(CookieManager("get", "user-email") || "");
    const rawBizName = String(CookieManager("get", "business-name") || "Synergi Business");
    const rawBizId = String(CookieManager("get", "business-id") || "");

    setPrimaryRole(rawPrimaryRole);
    setRole(rawRole);
    setUserName(rawUser);
    setUserEmail(rawEmail);
    setBusinessName(rawBizName);
    setBusinessId(rawBizId);

    setNameInput(rawUser);
    setEmailInput(rawEmail);
    setBizNameInput(rawBizName);
  }, []);

  const canAccessBusiness =
    primaryRole.includes("founder") ||
    primaryRole.includes("manager") ||
    primaryRole.includes("admin");

  // Fetch primary roles and existing roles when accessing Business tab
  useEffect(() => {
    if (activeTab === "business" && canAccessBusiness) {
      setIsLoadingPrimaryRoles(true);
      fetchPrimaryRoles()
        .then((data) => {
          setPrimaryRoles(data);
          if (data.length > 0 && !selectedPrimaryRoleId) {
            setSelectedPrimaryRoleId(data[0].id);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingPrimaryRoles(false));

      setIsLoadingRoles(true);
      fetchRoles()
        .then((roles) => setCreatedRoles(roles as CustomRole[]))
        .catch(() => {})
        .finally(() => setIsLoadingRoles(false));
    }
  }, [activeTab, canAccessBusiness]);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([sidebarRef.current, contentRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    toast.success("Personal profile & preferences updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizNameInput.trim()) {
      toast.error("Business name cannot be empty");
      return;
    }
    toast.success("Business organization settings saved successfully!");
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    if (!selectedPrimaryRoleId) {
      toast.error("Please select a primary access role");
      return;
    }

    try {
      setIsCreatingRole(true);
      await createCustomRole(newRoleName.trim(), Number(selectedPrimaryRoleId));
      toast.success(`Role "${newRoleName}" created successfully!`);
      setNewRoleName("");

      // Refresh list of roles
      const updatedRoles = await fetchRoles();
      setCreatedRoles(updatedRoles as CustomRole[]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to create role";
      toast.error(msg);
    } finally {
      setIsCreatingRole(false);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[calc(100vh-80px)] w-full p-4 sm:p-6 md:p-10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#3a4ec4]/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.04] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl flex flex-col gap-6 lg:gap-8">
        {/* Top Header */}
        <div className="flex flex-col gap-1 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5271ff]/15 border border-[#5271ff]/30 px-3 py-0.5 text-xs font-bold text-[#5271ff]">
              <Sparkles className="h-3.5 w-3.5" /> Workspace Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl flex items-center gap-3">
            <Settings className="h-7 w-7 text-[#5271ff] animate-spin-slow" /> Settings & Configuration
          </h1>
          <p className="text-xs text-white/50 max-w-xl">
            Manage your personal profile, credentials, notifications, and organizational business parameters.
          </p>
        </div>

        {/* Main Grid: Sub-Sidebar on Left, Middle Options Content on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sub-Sidebar */}
          <div
            ref={sidebarRef}
            className="lg:col-span-4 xl:col-span-3 rounded-2xl border border-white/10 bg-[#090724]/70 p-3 sm:p-4 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.5)] space-y-2"
          >
            <div className="px-3 py-2 border-b border-white/10 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-[#5271ff]" /> Preferences Categories
              </span>
            </div>

            {/* Option 1: Personal (Always Available) */}
            <button
              onClick={() => setActiveTab("personal")}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 transition-all text-left group ${
                activeTab === "personal"
                  ? "bg-[#5271ff]/20 text-white border border-[#5271ff]/40 shadow-[0_0_16px_rgba(82,113,255,0.25)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                    activeTab === "personal"
                      ? "bg-[#5271ff] text-white shadow-[0_0_12px_rgba(82,113,255,0.4)]"
                      : "bg-white/10 text-cyan-400"
                  }`}
                >
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs tracking-wide text-white">Personal</p>
                  <p className="text-[10px] text-white/40 truncate font-medium">
                    Profile, security & preferences
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform ${
                  activeTab === "personal" ? "text-white translate-x-0.5" : "text-white/30"
                }`}
              />
            </button>

            {/* Option 2: Business (ONLY if Primary Role is Founder or Manager) */}
            {canAccessBusiness ? (
              <button
                onClick={() => setActiveTab("business")}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 transition-all text-left group ${
                  activeTab === "business"
                    ? "bg-[#5271ff]/20 text-white border border-[#5271ff]/40 shadow-[0_0_16px_rgba(82,113,255,0.25)]"
                    : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                      activeTab === "business"
                        ? "bg-[#5271ff] text-white shadow-[0_0_12px_rgba(82,113,255,0.4)]"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs tracking-wide text-white flex items-center gap-1.5">
                      Business
                      <span className="rounded bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-300 uppercase">
                        Admin
                      </span>
                    </p>
                    <p className="text-[10px] text-white/40 truncate font-medium">
                      Organization & custom roles
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    activeTab === "business" ? "text-white translate-x-0.5" : "text-white/30"
                  }`}
                />
              </button>
            ) : (
              <div className="px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-[11px] text-white/40 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white/50">
                  <Shield className="h-3.5 w-3.5 text-white/30" /> Business Settings Locked
                </div>
                <p className="text-[10px]">
                  Business configuration requires Founder or Manager primary role.
                </p>
              </div>
            )}

            {/* Quick Summary Pill */}
            <div className="mt-4 pt-3 border-t border-white/10 px-3 text-[11px] text-white/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>Account Role:</span>
                <span className="font-bold text-white uppercase text-[10px] bg-white/10 px-2 py-0.5 rounded">
                  {role || "Employee"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Primary Role:</span>
                <span className="font-bold text-cyan-300 uppercase text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                  {primaryRole || "Employee"}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Options Content Area */}
          <div ref={contentRef} className="lg:col-span-8 xl:col-span-9 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "personal" ? (
                <motion.div
                  key="personal-tab"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-white/10 bg-[#090724]/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.5)] space-y-8"
                >
                  <form onSubmit={handleSavePersonal} className="space-y-8">
                    {/* Section 1: Personal Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                        <UserCheck className="h-5 w-5 text-[#5271ff]" />
                        <h2 className="text-base font-bold text-white tracking-wide">
                          Personal Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-[#040317] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#5271ff] focus:ring-1 focus:ring-[#5271ff]/30 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-[#040317] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#5271ff] focus:ring-1 focus:ring-[#5271ff]/30 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Security & Password */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                        <KeyRound className="h-5 w-5 text-amber-400" />
                        <h2 className="text-base font-bold text-white tracking-wide">
                          Security & Password
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1.5">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-white/10 bg-[#040317] px-3.5 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#5271ff] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1.5">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-white/10 bg-[#040317] px-3.5 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#5271ff] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1.5">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-white/10 bg-[#040317] px-3.5 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#5271ff] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Preferences */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                        <Palette className="h-5 w-5 text-cyan-400" />
                        <h2 className="text-base font-bold text-white tracking-wide">
                          App Preferences
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-[#040317]/60">
                          <div>
                            <p className="text-xs font-bold text-white">Email Notifications</p>
                            <p className="text-[10px] text-white/40">Receive daily activity digest</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="h-4 w-4 rounded accent-[#5271ff] cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-[#040317]/60">
                          <div>
                            <p className="text-xs font-bold text-white">Sound Alerts</p>
                            <p className="text-[10px] text-white/40">Play audio chime on new events</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={soundAlerts}
                            onChange={(e) => setSoundAlerts(e.target.checked)}
                            className="h-4 w-4 rounded accent-[#5271ff] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(82,113,255,0.35)] hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <Save className="h-4 w-4" /> Save Personal Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="business-tab"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-white/10 bg-[#090724]/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.5)] space-y-8"
                >
                  {/* Section 1: Business Organization */}
                  <form onSubmit={handleSaveBusiness} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="h-5 w-5 text-amber-400" />
                          <h2 className="text-base font-bold text-white tracking-wide">
                            Business Organization
                          </h2>
                        </div>
                        <span className="rounded font-bold text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2 py-0.5">
                          Primary Role: {primaryRole || "Manager/Founder"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1.5">
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={bizNameInput}
                            onChange={(e) => setBizNameInput(e.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-[#040317] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#5271ff] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1.5">
                            Business ID
                          </label>
                          <input
                            type="text"
                            value={businessId || "BUS-94821"}
                            disabled
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white/50 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" /> Save Business Info
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Section 2: Create New Role & Roles List Aside */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                      <ShieldPlus className="h-5 w-5 text-cyan-400" />
                      <h2 className="text-base font-bold text-white tracking-wide">
                        Create & Manage Roles
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left: Role Creation Form */}
                      <form
                        onSubmit={handleCreateRole}
                        className="lg:col-span-5 rounded-xl border border-white/10 bg-[#040317]/60 p-4 sm:p-5 space-y-4"
                      >
                        <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                          <ShieldPlus className="h-4 w-4" /> Add New Role
                        </span>

                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1.5">
                            Role Name
                          </label>
                          <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="e.g. Senior Developer"
                            required
                            className="w-full rounded-xl border border-white/15 bg-[#080626] px-3.5 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1.5">
                            Decide Access Role
                          </label>
                          {isLoadingPrimaryRoles ? (
                            <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl border border-white/10 bg-[#080626] text-xs text-cyan-400">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Loading primary roles...</span>
                            </div>
                          ) : (
                            <Select
                              value={selectedPrimaryRoleId ? String(selectedPrimaryRoleId) : ""}
                              onValueChange={(value) => setSelectedPrimaryRoleId(Number(value))}
                            >
                              <SelectTrigger className="w-full h-10 rounded-xl border border-white/15 bg-[#080626] px-3.5 text-xs text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all hover:bg-white/[0.05]">
                                <SelectValue placeholder="Select primary access role..." />
                              </SelectTrigger>
                              <SelectContent className="border border-white/15 bg-[#0c0a2f] text-white rounded-xl shadow-2xl backdrop-blur-2xl z-50">
                                {primaryRoles
                                  .filter((pr) => !pr.name.toLowerCase().includes("client"))
                                  .map((pr) => (
                                    <SelectItem
                                      key={pr.id}
                                      value={String(pr.id)}
                                      className="cursor-pointer text-white text-xs hover:bg-[#5271ff]/20 focus:bg-[#5271ff]/20 focus:text-white my-0.5 rounded-lg transition-colors"
                                    >
                                      {pr.name} (Access Level {pr.id})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                          <p className="text-[10px] text-white/40 mt-1.5">
                            Sets boundary permissions & authorization privileges for this custom role.
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isCreatingRole}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(6,182,212,0.3)] hover:scale-[1.02] disabled:opacity-50 transition-all cursor-pointer"
                        >
                          {isCreatingRole ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Creating...</span>
                            </>
                          ) : (
                            <>
                              <ShieldPlus className="h-4 w-4" />
                              <span>Create Custom Role</span>
                            </>
                          )}
                        </button>
                      </form>

                      {/* Right: Roles List Aside */}
                      <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#040317]/60 p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-[#5271ff]" /> Available Business Roles
                          </span>
                          <span className="text-[10px] font-bold text-white/50 bg-white/10 px-2 py-0.5 rounded-md">
                            {createdRoles.length} Roles
                          </span>
                        </div>

                        {isLoadingRoles ? (
                          <div className="flex items-center justify-center py-8 gap-2 text-xs text-cyan-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading roles list...</span>
                          </div>
                        ) : createdRoles.length === 0 ? (
                          <div className="py-8 text-center text-xs text-white/40">
                            No custom roles found for this business.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                            {createdRoles.map((roleItem) => (
                              <div
                                key={roleItem.id || roleItem.name}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:bg-white/[0.06]"
                              >
                                <div className="min-w-0 flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5271ff]/15 border border-[#5271ff]/30 text-[#5271ff] font-bold text-xs shrink-0">
                                    {roleItem.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">
                                      {roleItem.name}
                                    </p>
                                    <p className="text-[10px] text-white/40 truncate">
                                      Access Role:{" "}
                                      <span className="text-cyan-300 font-semibold">
                                        {roleItem.primary_role?.name ||
                                          `Primary Role ID ${roleItem.primary_role_id || "N/A"}`}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                                  <CheckCircle2 className="h-3 w-3" /> Active
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
