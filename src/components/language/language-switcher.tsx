"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { type Locale } from "@/i18n/routing";

const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "am", label: "አማርኛ", short: "አማ" },
  { code: "om", label: "Afaan Oromoo", short: "OM" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      role="radiogroup"
      aria-label="Language selector"
      className={`relative inline-flex items-center p-1 rounded-full bg-surface-secondary/80 border border-border/80 backdrop-blur-md shadow-sm ${className}`}
    >
      <div className="flex items-center pl-2 pr-1 text-foreground-muted">
        <Globe className="w-3.5 h-3.5" aria-hidden="true" />
      </div>

      {LOCALES.map((loc) => {
        const isActive = currentLocale === loc.code;

        return (
          <button
            key={loc.code}
            role="radio"
            aria-checked={isActive}
            aria-label={loc.label}
            title={loc.label}
            onClick={() => handleSelectLocale(loc.code)}
            className={`relative z-10 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
              isActive ? "text-primary" : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {loc.short}
            {isActive && (
              <motion.div
                layoutId="activeLocalePill"
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
