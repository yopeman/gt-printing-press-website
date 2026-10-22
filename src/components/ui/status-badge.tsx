"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface StatusBadgeProps {
  label: string;
  variant?: "express" | "success" | "neutral" | "warning";
  pulsingDot?: boolean;
  shimmer?: boolean;
  icon?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  variant = "express",
  pulsingDot = true,
  shimmer = true,
  icon = false,
  className = "",
}: StatusBadgeProps) {
  const variantStyles = {
    express: {
      pill: "bg-primary/10 border-primary/25 text-primary",
      dot: "bg-primary shadow-[0_0_8px_rgba(220,38,38,0.7)]",
      pulse: "bg-primary/40",
    },
    success: {
      pill: "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
      pulse: "bg-emerald-500/40",
    },
    warning: {
      pill: "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
      pulse: "bg-amber-500/40",
    },
    neutral: {
      pill: "bg-surface-secondary border-border text-foreground-muted",
      dot: "bg-foreground-muted",
      pulse: "bg-foreground-muted/30",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide backdrop-blur-sm ${
        style.pill
      } ${className}`}
    >
      {/* Shimmer wave effect */}
      {shimmer && (
        <span
          className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Pulsing Dot */}
      {pulsingDot && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.pulse}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
        </span>
      )}

      {icon && <Sparkles className="w-3.5 h-3.5" />}

      <span>{label}</span>
    </div>
  );
}
