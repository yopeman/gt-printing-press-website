"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Phone, Send, FileText } from "lucide-react";
import { Link } from "@/i18n/routing";

interface MobileQuickDockProps {
  onOpenQuoteModal?: () => void;
}

export function MobileQuickDock({ onOpenQuoteModal }: MobileQuickDockProps) {
  const footerT = useTranslations("footer");
  const common = useTranslations("common");

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the very top of page
      if (currentScrollY < 60) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
        // Scrolling down rapidly: auto-hide dock to free screen space
        setVisible(false);
      } else if (lastScrollY - currentScrollY > 10) {
        // Scrolling up: reveal dock immediately for quick reachability
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
        >
          <div className="flex items-center justify-between p-2 rounded-2xl glass-panel shadow-2xl border border-border/80">
            {/* 1-Tap Telegram Direct Chat */}
            <a
              href="https://t.me/gtprintadmin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={footerT("telegramChat")}
              className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-foreground hover:text-sky-500 hover:bg-surface-secondary/70 transition-colors"
            >
              <div className="relative">
                <Send className="w-5 h-5 text-sky-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-bold mt-1 tracking-tight">Telegram</span>
            </a>

            {/* Divider */}
            <div className="h-7 w-px bg-border/80" />

            {/* 1-Tap Phone Dialer */}
            <a
              href="tel:+251115505050"
              aria-label={footerT("callNow")}
              className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-foreground hover:text-emerald-500 hover:bg-surface-secondary/70 transition-colors"
            >
              <Phone className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-bold mt-1 tracking-tight">Call</span>
            </a>

            {/* Divider */}
            <div className="h-7 w-px bg-border/80" />

            {/* 1-Tap Instant Quote Modal Trigger or Link */}
            {onOpenQuoteModal ? (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                aria-label={footerT("quickQuote")}
                className="flex-[1.4] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-glow-sm font-bold text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>{footerT("quickQuote")}</span>
              </button>
            ) : (
              <Link
                href="/quote"
                aria-label={footerT("quickQuote")}
                className="flex-[1.4] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-glow-sm font-bold text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>{footerT("quickQuote")}</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
