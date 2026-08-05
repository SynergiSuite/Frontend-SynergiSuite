"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Terminal,
  Building2,
  Users,
  Layers,
  Link2,
  Sparkles,
  Loader2,
  LogOut,
  Check,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "./header";
import { motion, AnimatePresence } from "framer-motion";
import { registerBusinessScheme } from "../schema/registerBusinessSchema";
import { ZodError } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CookieManager } from "@/lib/cookieManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gsap } from "gsap";
import { toast } from "sonner";

interface Category {
  id: string | number;
  name: string;
}

export default function RegisterBusiness() {
  const [selectedOption, setSelectedOption] = useState<string>("Register a new Business");
  const [data, setData] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [name, setName] = useState<string>("");
  const [number_of_employees, setNumberOfEmployees] = useState<number>(10);
  const [category_id, setCategoryID] = useState<number>(0);
  const [token, setToken] = useState("");
  const router = useRouter();
  const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Fetch Category Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsCategoryLoading(true);
        setCategoryError(null);
        const accessToken = CookieManager("get", "access-token");
        const response = await fetch(`${requestBaseUrl}/category/get-all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch categories (${response.status})`);
        }

        const result = await response.json();
        const categoryList = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.categories)
          ? result.categories
          : [];

        setData(categoryList);
        if (categoryList.length > 0 && category_id === 0) {
          setCategoryID(Number(categoryList[0].id));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoryError(err instanceof Error ? err.message : "Failed to load categories");
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchData();
  }, [requestBaseUrl]);

  const options = [
    "Register a new Business",
    "Join an existing Business",
    "Join as an Invited Client",
  ];

  const formatErrorMessage = (msg: any): string => {
    if (Array.isArray(msg)) {
      return msg.join(". ");
    }
    return typeof msg === "string" ? msg : "An unexpected error occurred.";
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (selectedOption === "Register a new Business") {
      registerBusiness();
    } else if (selectedOption === "Join an existing Business") {
      joinBusiness();
    } else if (selectedOption === "Join as an Invited Client") {
      joinAsClient();
    }
  };

  const logout = () => {
    CookieManager("delete", "access-token");
    CookieManager("delete", "register-token");
    CookieManager("delete", "user-email");
    CookieManager("delete", "user");
    router.replace("/session");
  };

  const joinBusiness = async () => {
    const accessToken = CookieManager("get", "access-token");
    if (!token.trim()) {
      setError("Please enter your invitation link or token.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${requestBaseUrl}/business/join-business`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token: token.trim() }),
        }
      );

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(formatErrorMessage(responseData.message) || "Failed to join business.");
      } else {
        CookieManager("delete", "register-token");
        if (responseData.business_name) {
          CookieManager("set", "business-name", responseData.business_name);
        }
        if (responseData.business_id) {
          CookieManager("set", "business-id", responseData.business_id);
        }
        const roleName = responseData.role?.name ?? responseData.role_name;
        const primaryRoleName =
          responseData.role?.primary_role?.name ??
          responseData.primary_role?.name ??
          responseData.primary_role_name ??
          (typeof responseData.primary_role === "string"
            ? responseData.primary_role
            : typeof responseData.role?.primary_role === "string"
            ? responseData.role.primary_role
            : undefined);
        if (roleName) {
          CookieManager("set", "role", roleName);
        }
        if (primaryRoleName) {
          CookieManager("set", "primary_role", String(primaryRoleName));
        }
        toast.success("Joined business successfully!");
        router.push("/dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const joinAsClient = async () => {
    const accessToken = await CookieManager("get", "access-token");
    if (!token.trim()) {
      setError("Please enter your client invitation token.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${requestBaseUrl}/business/join-business`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token: token.trim() }),
        }
      );

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(formatErrorMessage(responseData.message) || "Failed to join as client.");
      } else {
        CookieManager("delete", "register-token");
        if (responseData.business_name) {
          CookieManager("set", "business-name", responseData.business_name);
        }
        if (responseData.business_id) {
          CookieManager("set", "business-id", responseData.business_id);
        }
        const roleName = responseData.role?.name ?? responseData.role_name ?? "client";
        const primaryRoleName =
          responseData.role?.primary_role?.name ??
          responseData.primary_role?.name ??
          responseData.primary_role_name ??
          (typeof responseData.primary_role === "string"
            ? responseData.primary_role
            : typeof responseData.role?.primary_role === "string"
            ? responseData.role.primary_role
            : undefined);
        CookieManager("set", "role", roleName);
        if (primaryRoleName) {
          CookieManager("set", "primary_role", String(primaryRoleName));
        }
        toast.success("Joined workspace as client!");
        router.push("/dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const registerBusiness = async () => {
    setIsLoading(true);
    const accessToken = CookieManager("get", "access-token");
    const dataPayload = {
      name,
      number_of_employees,
      category_id,
    };

    try {
      const validation = registerBusinessScheme.safeParse(dataPayload);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || "Invalid Input");
        setIsLoading(false);
        return;
      }
      const userData = JSON.stringify(validation.data);

      const res = await fetch(`${requestBaseUrl}/business/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: userData,
      });

      const responseData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          formatErrorMessage(responseData.message) || "Failed to register business. Try again later."
        );
      }

      CookieManager("delete", "register-token");
      CookieManager("set", "business-name", responseData.business_name);
      CookieManager("set", "business-id", responseData.business_id);
      const roleName = responseData.role?.name ?? responseData.role_name;
      const primaryRoleName =
        responseData.role?.primary_role?.name ??
        responseData.primary_role?.name ??
        responseData.primary_role_name ??
        (typeof responseData.primary_role === "string"
          ? responseData.primary_role
          : typeof responseData.role?.primary_role === "string"
          ? responseData.role.primary_role
          : undefined);
      if (roleName) {
        CookieManager("set", "role", roleName);
      }
      if (primaryRoleName) {
        CookieManager("set", "primary_role", String(primaryRoleName));
      }
      toast.success("Business registered successfully!");
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0]?.message || "Invalid input");
      } else if (err instanceof Error) {
        setError(err.message || "Something went wrong. Try again later.");
      } else {
        setError("Unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
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
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-3xl border border-white/10 bg-[#090724]/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <div ref={cardRef} className="space-y-6">
            <Header />

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
                    <p className="font-bold text-red-400">Onboarding Action Required</p>
                    <p className="text-red-200/80 text-[11px] mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Option Selector Dropdown */}
              <div className="space-y-1.5 relative">
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Onboarding Action
                </label>
                <div
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 flex justify-between items-center cursor-pointer text-sm font-semibold text-white hover:bg-white/[0.07] hover:border-[#5271ff]/50 focus:border-[#5271ff] transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Building2 className="h-4 w-4 text-[#5271ff]" />
                    {selectedOption || "Select onboarding mode..."}
                  </span>
                  {isDropdownOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#5271ff]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-white/50" />
                  )}
                </div>

                {/* Dropdown Options Popover */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-30 w-full mt-1.5 bg-[#0b082e] border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl p-1.5 space-y-1"
                    >
                      {options.map((option) => {
                        const isSelected = selectedOption === option;
                        return (
                          <button
                            type="button"
                            key={option}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#5271ff]/25 text-white border border-[#5271ff]/40 shadow-[0_0_12px_rgba(82,113,255,0.2)]"
                                : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent"
                            }`}
                            onClick={() => handleOptionSelect(option)}
                          >
                            <span>{option}</span>
                            {isSelected && <Check className="h-4 w-4 text-cyan-400" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated Form Sections */}
              <AnimatePresence mode="wait">
                {selectedOption === "Register a new Business" && (
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                        Business Name
                      </label>
                      <div className="bg-white/[0.04] border border-white/15 rounded-xl flex items-center px-3.5 h-11 focus-within:border-[#5271ff] focus-within:bg-white/[0.06] transition-all">
                        <Building2 className="h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-white placeholder-white/25 text-xs h-full pl-2.5 font-medium"
                          placeholder="e.g. Synergi Tech Corp"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="numberOfEmployees" className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                        Number of Employees
                      </label>
                      <div className="bg-white/[0.04] border border-white/15 rounded-xl flex items-center px-3.5 h-11 focus-within:border-[#5271ff] focus-within:bg-white/[0.06] transition-all">
                        <Users className="h-4 w-4 text-white/40" />
                        <input
                          type="number"
                          id="numberOfEmployees"
                          value={number_of_employees || ""}
                          onChange={(e) => setNumberOfEmployees(Number(e.target.value))}
                          className="w-full bg-transparent focus:outline-none text-white placeholder-white/25 text-xs h-full pl-2.5 font-medium"
                          placeholder="Total employee count"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="businessCategory" className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                        Business Category
                      </label>
                      {isCategoryLoading ? (
                        <div className="h-11 w-full rounded-xl border border-white/15 bg-[#080626] px-3.5 flex items-center gap-2 text-xs text-cyan-400">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Loading categories...</span>
                        </div>
                      ) : (
                        <Select
                          value={category_id ? String(category_id) : ""}
                          onValueChange={(value) => setCategoryID(Number(value))}
                        >
                          <SelectTrigger className="w-full h-11 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-xs text-white outline-none focus:border-[#5271ff] focus:ring-1 focus:ring-[#5271ff]/30 transition-all hover:bg-white/[0.07]">
                            <div className="flex items-center gap-2 min-w-0">
                              <Layers className="h-4 w-4 text-white/40 shrink-0" />
                              <SelectValue placeholder="Select business category..." />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="border border-white/15 bg-[#0b082e] text-white rounded-xl shadow-2xl backdrop-blur-2xl z-50">
                            {data?.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={String(cat.id)}
                                className="cursor-pointer text-white text-xs hover:bg-[#5271ff]/20 focus:bg-[#5271ff]/20 focus:text-white my-0.5 rounded-lg transition-colors"
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] py-3.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(82,113,255,0.35)] hover:shadow-[0_0_30px_rgba(82,113,255,0.55)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Registering Business...</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="h-4 w-4" />
                          <span>Register Business</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {selectedOption === "Join an existing Business" && (
                  <motion.div
                    key="join-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-1.5">
                      <label htmlFor="invitationLink" className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                        Invitation Token / Link
                      </label>
                      <div className="bg-white/[0.04] border border-white/15 rounded-xl flex items-center px-3.5 h-11 focus-within:border-[#5271ff] transition-all">
                        <Link2 className="h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          id="invitationLink"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-white placeholder-white/25 text-xs h-full pl-2.5 font-medium"
                          placeholder="Paste your business invitation token here"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] py-3.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(82,113,255,0.35)] hover:shadow-[0_0_30px_rgba(82,113,255,0.55)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Joining Workspace...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4" />
                          <span>Join Business Now</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {selectedOption === "Join as an Invited Client" && (
                  <motion.div
                    key="client-join-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-1.5">
                      <label htmlFor="clientInvitationToken" className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
                        Client Invitation Token
                      </label>
                      <div className="bg-white/[0.04] border border-white/15 rounded-xl flex items-center px-3.5 h-11 focus-within:border-[#5271ff] transition-all">
                        <ShieldCheck className="h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          id="clientInvitationToken"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-white placeholder-white/25 text-xs h-full pl-2.5 font-medium"
                          placeholder="Paste client invitation token here"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Joining as Client...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          <span>Join as Client</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Back to Login Footer */}
            <div className="pt-3 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-[#5271ff]" />
                <span>Return to Session Login</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
