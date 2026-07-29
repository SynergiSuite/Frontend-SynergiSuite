"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareQuote,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  Sparkles,
  Filter,
  PlusCircle,
  HelpCircle,
  Paperclip,
  ChevronDown,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";
import { CookieManager } from "@/lib/cookieManager";
import { getProjectsApi } from "@/app/projects/apis/getProjectsApi";
import { Projects } from "@/app/projects/schemas/project";

interface FeedbackItem {
  id: string;
  title: string;
  category: "Project Feedback" | "Feature Request" | "Bug Report" | "General Support";
  projectName: string;
  message: string;
  status: "In Review" | "In Progress" | "Resolved" | "Closed";
  rating?: number;
  createdAt: string;
}

const mockFeedbackList: FeedbackItem[] = [
  {
    id: "FB-8041",
    title: "Sprint 4 Milestone Review & UI Adjustments",
    category: "Project Feedback",
    projectName: "Enterprise Portal Revamp",
    message: "The new dashboard layout looks incredible! Just requesting a slight adjustment to the contrast on line items.",
    status: "In Progress",
    rating: 5,
    createdAt: "2026-07-28T14:30:00Z",
  },
  {
    id: "FB-7912",
    title: "Cloud Artifact Export Format Request",
    category: "Feature Request",
    projectName: "Cloud Storage Integration",
    message: "Would love the ability to export cloud build artifacts as zip files directly from the timeline view.",
    status: "In Review",
    createdAt: "2026-07-25T09:15:00Z",
  },
  {
    id: "FB-7650",
    title: "Resolved API Webhook Payload Verification",
    category: "General Support",
    projectName: "Webhook Integration",
    message: "Verified webhook listener configuration. Everything is delivering smoothly now.",
    status: "Resolved",
    rating: 5,
    createdAt: "2026-07-20T11:00:00Z",
  },
];

export default function ClientFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(mockFeedbackList);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "In Progress" | "In Review" | "Resolved">("All");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<FeedbackItem["category"]>("Project Feedback");
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState<Projects[]>([]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const userName = (typeof window !== "undefined" ? CookieManager("get", "user") as string : "") || "Client";

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjectsApi();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects for feedback:", err);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".animate-item"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newFeedback: FeedbackItem = {
        id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        category,
        projectName: projectName || "General Project",
        message,
        status: "In Review",
        rating,
        createdAt: new Date().toISOString(),
      };

      setFeedbackList((prev) => [newFeedback, ...prev]);
      toast.success("Feedback submitted successfully!");
      setTitle("");
      setMessage("");
      setProjectName("");
      setIsSubmitModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = feedbackList.filter(
    (item) => activeTab === "All" || item.status === activeTab
  );

  const getStatusBadge = (status: FeedbackItem["status"]) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Clock className="h-3.5 w-3.5" />
            In Progress
          </span>
        );
      case "In Review":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <AlertCircle className="h-3.5 w-3.5" />
            In Review
          </span>
        );
      case "Resolved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
            Closed
          </span>
        );
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-full w-full space-y-6 overflow-hidden">
      {/* Background glowing accents */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5271ff]/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#22d3ee]/[0.05] blur-[120px]" />

      {/* Page Header */}
      <div className="animate-item flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5271ff]">
            <Sparkles className="h-4 w-4" />
            <span>Client Feedback & Collaboration Hub</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Project Feedback & Support
          </h1>
          <p className="mt-1 text-xs text-white/50">
            Share feedback, track request resolution, and collaborate with your project management team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(82,113,255,0.3)] transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_25px_rgba(82,113,255,0.45)] active:scale-95 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Submit New Feedback</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="animate-item flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-xl border border-white/[0.08] bg-[#0c0a2f]/60 p-1.5 backdrop-blur-md">
          {(["All", "In Progress", "In Review", "Resolved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#5271ff] text-white shadow-[0_0_12px_rgba(82,113,255,0.4)]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-xs text-white/40">
          Showing <span className="font-semibold text-white">{filteredItems.length}</span> feedback records
        </div>
      </div>

      {/* Feedback List Grid */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-item relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a2f]/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    {item.id}
                  </span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#5271ff]">
                    {item.category}
                  </span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/60">
                    {item.projectName}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{item.message}</p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                {getStatusBadge(item.status)}

                {item.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < (item.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-white/30">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Feedback Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={() => setIsSubmitModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              className="relative w-full max-w-xl rounded-[28px] border border-white/[0.08] bg-[#0c0a2f] bg-gradient-to-br from-[#5271ff]/10 via-[#0c0a2f] to-[#0a0826] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <div className="mb-6 border-b border-white/[0.08] pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquareQuote className="h-5 w-5 text-[#5271ff]" />
                  Submit Feedback & Requests
                </h2>
                <p className="text-xs text-white/40 mt-1">
                  Share your thoughts, report issues, or suggest enhancements for your project.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Title / Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief description of your feedback"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 px-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50 focus:ring-1 focus:ring-[#5271ff]/30"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as FeedbackItem["category"])}
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50"
                    >
                      <option value="Project Feedback">Project Feedback</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                      Select Related Project
                    </label>
                    <div className="relative">
                      <select
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0c0a2f] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#5271ff]/50"
                      >
                        <option value="" className="bg-[#0c0a2f] text-white">-- Select Project --</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.name} className="bg-[#0c0a2f] text-white">
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Detailed Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your request or feedback..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a0826]/40 p-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#5271ff]/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Overall Satisfaction Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/20"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Submitting..." : "Send Feedback"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
