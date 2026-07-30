"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquareQuote,
  ArrowUpRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { getMyFeedbackApi, ClientFeedbackResponse } from "@/app/feedback/apis/getMyFeedbackApi";
import { CookieManager } from "@/lib/cookieManager";

interface ActivityFeedProps {
  projectId?: string;
  projectName?: string;
  activities?: any;
}

const ActivityFeed = ({ projectId, projectName }: ActivityFeedProps) => {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<ClientFeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const userRole = CookieManager("get", "role");
    setRole(String(userRole || "").toLowerCase());
  }, []);

  const allowedRoles = ["founder", "manager", "client", "admin"];
  const canNavigateToFeedback = allowedRoles.includes(role);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const data = await getMyFeedbackApi();
        const filtered = data.filter((item) => {
          if (!projectId && !projectName) return true;
          const pId = item.typeId || item.projectId || item.project_id || item.project?.id;
          const pName = item.projectName || item.project?.name;
          if (projectId && String(pId) === String(projectId)) return true;
          if (projectName && pName && pName.toLowerCase() === projectName.toLowerCase()) return true;
          return false;
        });
        setFeedbacks(filtered.length > 0 ? filtered : data);
      } catch (err) {
        console.error("Failed to load project feedbacks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [projectId, projectName]);

  const handleRedirect = () => {
    if (!canNavigateToFeedback) return;
    router.push("/feedback");
  };

  const getStatusBadge = (rawStatus?: string) => {
    const norm = (rawStatus || "").trim().toLowerCase();
    if (norm === "in_progress" || norm === "in progress") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
          <Clock className="h-3 w-3" />
          In Progress
        </span>
      );
    }
    if (norm === "resolved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
        <AlertCircle className="h-3 w-3" />
        In Review
      </span>
    );
  };

  return (
    <div
      onClick={handleRedirect}
      className={`bg-[#0a0826]/40 border border-white/[0.08] backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 ${
        canNavigateToFeedback
          ? "hover:border-[#5271ff]/40 hover:shadow-[0_8px_32px_rgba(82,113,255,0.15)] cursor-pointer group"
          : "cursor-default"
      }`}
    >
      {/* Left Glowing Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#5271ff] to-[#3a4ec4]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-[#5271ff] group-hover:scale-110 transition-transform" />
          <h3 className="text-white text-xs font-bold uppercase tracking-wider">
            Client Feedbacks
          </h3>
        </div>

        {canNavigateToFeedback && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRedirect();
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5271ff] hover:text-white transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Body List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-white/40 text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-[#5271ff] mr-2" />
          Loading feedbacks...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="py-6 text-center text-xs text-white/40 space-y-2">
          <p>No client feedback recorded yet for this project.</p>
          <span className="inline-block text-[11px] font-semibold text-[#5271ff] group-hover:underline">
            Click to manage feedback →
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.slice(0, 3).map((item, idx) => {
            const title = item.titleOfFeedback || item.feedbackTitle || item.title || "Feedback Submission";
            const category = item.feedbackType || item.category || "General";
            const message = item.feedback || item.message || "";

            return (
              <div
                key={item.id || idx}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200 group-hover:bg-white/[0.04] group-hover:border-white/10"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5271ff]">
                    {category}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#5271ff] transition-colors">
                  {title}
                </h4>
                {message && (
                  <p className="text-[11px] text-white/50 line-clamp-2 mt-1 leading-relaxed">
                    {message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
