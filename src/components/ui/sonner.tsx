"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0c0a2f]/95 p-4 text-white backdrop-blur-xl shadow-[0_20px_40px_rgba(3,1,20,0.6),0_0_20px_rgba(82,113,255,0.15)] font-sans transition-all duration-300",
          title: "text-xs font-bold text-white tracking-wide",
          description: "text-[11px] text-white/70 leading-relaxed mt-0.5",
          actionButton:
            "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] text-white font-bold text-xs rounded-xl px-3 py-1.5 shadow-[0_0_12px_rgba(82,113,255,0.4)] transition hover:opacity-90",
          cancelButton:
            "bg-white/10 hover:bg-white/20 text-white/70 font-semibold text-xs rounded-xl px-3 py-1.5 transition",
          success:
            "!border-emerald-500/40 !bg-[#071f16]/95 !text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.25)]",
          error:
            "!border-rose-500/40 !bg-[#260917]/95 !text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.25)]",
          info:
            "!border-[#5271ff]/40 !bg-[#091136]/95 !text-[#96a9ff] shadow-[0_0_25px_rgba(82,113,255,0.25)]",
          warning:
            "!border-amber-500/40 !bg-[#261708]/95 !text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)]",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400 shrink-0 mt-0.5" />,
        info: <InfoIcon className="size-4 text-[#5271ff] shrink-0 mt-0.5" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400 shrink-0 mt-0.5" />,
        error: <OctagonXIcon className="size-4 text-rose-400 shrink-0 mt-0.5" />,
        loading: <Loader2Icon className="size-4 text-[#5271ff] animate-spin shrink-0 mt-0.5" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
