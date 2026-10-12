"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  LoaderCircle,
  MessageSquareQuote,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getMyFeedbackApi, ClientFeedbackResponse } from "@/app/feedback/apis/getMyFeedbackApi";
import { CookieManager } from "@/lib/cookieManager";

interface ActivityFeedProps {
  projectId?: string;
  projectName?: string;
}

export default function ActivityFeed({ projectId, projectName }: ActivityFeedProps) {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<ClientFeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const userRole =
      CookieManager("get", "primary_role") || CookieManager("get", "role");
    setRole(String(userRole || "").toLowerCase());
  }, []);

  const allowedRoles = ["founder", "manager", "client", "admin"];
  const canNavigateToFeedback = allowedRoles.includes(role);

  useEffect(() => {
    let cancelled = false;
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const res = await getMyFeedbackApi();
        const data = res.data || [];
        const filtered = data.filter((item) => {
          if (!projectId && !projectName) return true;
          const pId =
            item.typeId ||
            item.projectId ||
            item.project_id ||
            item.project?.id;
          const pName = item.projectName || item.project?.name;
          if (projectId && String(pId) === String(projectId)) return true;
          if (
            projectName &&
            pName &&
            pName.toLowerCase() === projectName.toLowerCase()
          )
            return true;
          return false;
        });
        if (!cancelled) {
          setFeedbacks(filtered.length > 0 ? filtered : data);
        }
      } catch (err) {
        console.error("Failed to load project feedbacks:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchFeedbacks();
    return () => {
      cancelled = true;
    };
  }, [projectId, projectName]);

  const handleRedirect = () => {
    if (!canNavigateToFeedback) return;
    router.push("/feedback");
  };

  const getStatusBadge = (rawStatus?: string) => {
    const norm = (rawStatus || "").trim().toLowerCase();
    if (norm === "in_progress" || norm === "in progress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold text-sky-700">
          <Clock className="size-3" />
          In Progress
        </span>
      );
    }
    if (norm === "resolved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          <CheckCircle2 className="size-3" />
          Resolved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
        <AlertCircle className="size-3" />
        In Review
      </span>
    );
  };

  return (
    <Card className="overflow-hidden border border-v2-neutral-300 bg-v2-neutral-100 shadow-sm">
      <CardHeader className="pb-3 border-b border-v2-neutral-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-600">
              <MessageSquareQuote className="size-3.5" />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-v2-neutral-400">
              Client Feedback
            </h3>
          </div>

          {canNavigateToFeedback && (
            <button
              type="button"
              onClick={handleRedirect}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-v2-neutral-600 hover:text-v2-neutral-400 transition-colors cursor-pointer"
            >
              <span>View all</span>
              <ArrowUpRight className="size-3" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 text-xs">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-xs text-v2-neutral-400">
            <LoaderCircle className="size-4 animate-spin text-v2-neutral-500 mr-2" />
            Loading feedback...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-v2-neutral-300 p-4 text-center text-v2-neutral-400">
            <p>No feedback tickets logged for this project.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {feedbacks.slice(0, 3).map((item, idx) => {
              const title =
                item.titleOfFeedback ||
                item.feedbackTitle ||
                item.title ||
                "Feedback Item";
              const category = item.feedbackType || item.category || "General";
              const message = item.feedback || item.message || "";

              return (
                <div
                  key={item.id || idx}
                  onClick={handleRedirect}
                  className="rounded-xl border border-v2-neutral-200 bg-v2-neutral-200/40 p-3 transition-colors hover:border-v2-neutral-300 hover:bg-v2-neutral-200/70 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2.5 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-v2-neutral-500">
                      {category}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <h4 className="text-xs font-semibold text-v2-neutral-600 line-clamp-1">
                    {title}
                  </h4>
                  {message && (
                    <p className="text-[11px] text-v2-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
