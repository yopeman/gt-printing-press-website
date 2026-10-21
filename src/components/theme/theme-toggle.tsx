"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles, Monitor } from "lucide-react";

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "night", label: "Night", icon: Sparkles },
  { id: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center gap-1 p-1 rounded-full bg-surface-secondary/70 border border-border h-9 w-[156px] ${className}`}>
        <div className="w-7 h-7 rounded-full bg-surface animate-pulse" />
      </div>
    );
  }

  const currentTheme = theme || "system";

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className={`relative flex items-center p-1 rounded-full bg-surface-secondary/80 border border-border/80 backdrop-blur-md shadow-sm ${className}`}
    >
      {THEMES.map((item) => {
        const Icon = item.icon;
        const isActive = currentTheme === item.id;

        return (
          <button
            key={item.id}
            role="radio"
            aria-checked={isActive}
            aria-label={`${item.label} theme`}
            title={`${item.label} theme`}
            onClick={() => setTheme(item.id)}
            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-foreground/80 hover:text-foreground transition-colors ${
              isActive ? "text-primary font-medium" : "text-foreground-muted"
            }`}
          >
            <Icon className="w-4 h-4 transition-transform duration-200" />
            {isActive && (
              <motion.div
                layoutId="activeThemePill"
                className="absolute inset-0 rounded-full bg-surface shadow-sm border border-border -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
