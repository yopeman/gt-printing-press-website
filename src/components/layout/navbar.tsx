"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Phone, Send } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { MagneticButton } from "@/components/ui/magnetic-button";

interface NavbarProps {
  onOpenQuoteModal?: () => void;
}

export function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for shadow & blur elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
    { href: "/capabilities", label: t("capabilities") },
    { href: "/industries", label: t("industries") },
    { href: "/portfolio", label: t("portfolio") },
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "glass-panel shadow-md border-b border-border/80"
            : "bg-background/80 backdrop-blur-md border-b border-border/40"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            aria-label="GT Printing Press Home"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl overflow-hidden shadow-glow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/gt-logo-mark.png"
                alt="GT Printing Press logo"
                width={512}
                height={512}
                priority
                sizes="(max-width: 640px) 40px, 44px"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground block leading-tight whitespace-nowrap">
                GT <span className="text-primary font-black">PRINTING</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-foreground-muted block truncate max-w-[150px] sm:max-w-none">
                Since 2000 E.C. • In-House
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden xl:flex items-center gap-1.5 lg:gap-2 text-sm font-semibold"
            aria-label="Main Navigation"
          >
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg transition-colors hover:text-primary ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Dock: Language Switcher, Theme Switcher & Quote CTA */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Magnetic Quote Button */}
            {onOpenQuoteModal ? (
              <MagneticButton
                onClick={onOpenQuoteModal}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs lg:text-sm font-semibold shadow-glow-sm hover:shadow-glow-md"
              >
                <span>{t("requestQuote")}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </MagneticButton>
            ) : (
              <Link href="/quote">
                <MagneticButton className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs lg:text-sm font-semibold shadow-glow-sm hover:shadow-glow-md">
                  <span>{t("requestQuote")}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </MagneticButton>
              </Link>
            )}
          </div>

          {/* Mobile Right Controls: Language + Hamburger */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden min-[400px]:block">
              <LanguageSwitcher className="scale-90" />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-surface border border-border text-foreground hover:bg-surface-secondary transition-colors"
              aria-label={t("toggleMenu")}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-In Fullscreen Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-x-0 bottom-0 top-16 sm:top-20 z-40 xl:hidden bg-background/95 backdrop-blur-xl border-t border-border flex flex-col justify-between p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain"
          >
            {/* Nav list */}
            <nav className="flex flex-col space-y-2 pt-2">
              {navLinks.map((item, idx) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-base font-semibold border transition-all ${
                        isActive
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-surface border-border text-foreground hover:bg-surface-secondary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Drawer Bottom Controls */}
            <div className="pt-8 pb-4 space-y-4 border-t border-border mt-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-foreground-muted">Language</span>
                <LanguageSwitcher />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground-muted">Theme</span>
                <ThemeToggle />
              </div>

              {onOpenQuoteModal ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuoteModal();
                  }}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-center shadow-glow-md flex items-center justify-center gap-2"
                >
                  <span>{t("requestQuote")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-center shadow-glow-md flex items-center justify-center gap-2"
                >
                  <span>{t("requestQuote")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {/* Direct Quick Contact Row */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+251115505050"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>+251 11 550 5050</span>
                </a>
                <a
                  href="https://t.me/gtprintadmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:text-sky-500 transition-colors"
                >
                  <Send className="w-4 h-4 text-sky-500" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
