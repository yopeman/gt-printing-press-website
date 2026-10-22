"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { WORKFLOW_STAGES } from "@/data/machinery";
import { type Locale } from "@/types/database";
import { CheckCircle2, ChevronRight, Sparkles, Layers, ShieldCheck } from "lucide-react";

export function WorkflowPipeline() {
  const locale = useLocale() as Locale;
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="w-full space-y-8">
      {/* Stage Nodes Track */}
      <div className="relative">
        {/* Laser Connecting Path (Desktop) */}
        <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-border -z-0">
          <motion.div
            className="h-full bg-primary shadow-glow-sm"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeStage / (WORKFLOW_STAGES.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          {WORKFLOW_STAGES.map((item, idx) => {
            const isActive = idx === activeStage;
            const isCompleted = idx < activeStage;

            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`flex flex-col items-start lg:items-center text-left lg:text-center p-4 rounded-2xl border transition-all duration-300 relative group ${
                  isActive
                    ? "bg-surface border-primary shadow-glow-sm"
                    : "bg-surface/70 border-border/80 hover:bg-surface hover:border-primary/40"
                }`}
              >
                {/* Node Pill */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl text-sm font-black transition-all mb-3 ${
                    isActive
                      ? "bg-primary text-white shadow-glow-md scale-105"
                      : isCompleted
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                      : "bg-surface-secondary text-foreground-muted border border-border"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{item.stage}</span>
                  )}
                </div>

                <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {item.name[locale] || item.name.en}
                </div>

                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-primary mt-1">
                  Phase {item.stage}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Spotlight */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-card-glass">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STAGE {WORKFLOW_STAGES[activeStage].stage} OF 05</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {WORKFLOW_STAGES[activeStage].name[locale] || WORKFLOW_STAGES[activeStage].name.en}
            </h3>
            <p className="text-sm text-foreground-muted max-w-2xl leading-relaxed">
              {WORKFLOW_STAGES[activeStage].desc[locale] || WORKFLOW_STAGES[activeStage].desc.en}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-surface-secondary border border-border flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-foreground-muted block">
                Quality Gate Checkpoint
              </span>
              <span className="text-xs font-bold text-foreground">
                {WORKFLOW_STAGES[activeStage].checkpoint}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
