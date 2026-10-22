"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Send,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

export function Footer() {
  const t = useTranslations("footer");
  const common = useTranslations("common");
  const nav = useTranslations("nav");
  const services = useTranslations("services");

  const [ethiopianTime, setEthiopianTime] = useState<string>("");
  const [isWorkshopOpen, setIsWorkshopOpen] = useState<boolean>(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data.settings);
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    const updateTimeAndStatus = () => {
      const now = new Date();
      // Format to East Africa Time (Africa/Addis_Ababa)
      const eatFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Addis_Ababa",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      const dayFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Addis_Ababa",
        weekday: "short",
      });

      const hourFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Addis_Ababa",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });

      setEthiopianTime(eatFormatter.format(now));

      const day = dayFormatter.format(now); // "Mon", "Tue", etc.
      const hourParts = hourFormatter.format(now).split(":");
      const hours = parseInt(hourParts[0], 10);
      const minutes = parseInt(hourParts[1], 10);
      const currentMinutes = hours * 60 + minutes;

      // Monday to Saturday: 8:30 AM (510 min) to 6:00 PM (1080 min)
      const isWorkingDay = day !== "Sun";
      const isWorkingHour = currentMinutes >= 510 && currentMinutes < 1080;

      setIsWorkshopOpen(isWorkingDay && isWorkingHour);
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const serviceLinks = [
    { href: "/services/offset-digital-printing", label: services("offsetDigital") },
    { href: "/services/publishing-binding", label: services("publishingBinding") },
    { href: "/services/packaging-solutions", label: services("packagingSolutions") },
    { href: "/services/large-format-signage", label: services("largeFormatSignage") },
    { href: "/services/graphic-design-prepress", label: services("graphicDesignPrepress") },
    { href: "/services/corporate-promotional-items", label: services("corporatePromotional") },
  ];

  const quickLinks = [
    { href: "/", label: nav("home") },
    { href: "/about", label: nav("about") },
    { href: "/capabilities", label: nav("capabilities") },
    { href: "/industries", label: nav("industries") },
    { href: "/portfolio", label: nav("portfolio") },
    { href: "/blog", label: nav("blog") },
    { href: "/contact", label: nav("contact") },
    { href: "/quote", label: nav("requestQuote") },
  ];

  return (
    <footer className="w-full bg-surface border-t border-border transition-colors content-visibility-auto">
      {/* Top Operating Status Strip */}
      <div className="border-b border-border/70 py-4 bg-surface-secondary/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              label={isWorkshopOpen ? t("statusOpen") : t("statusClosed")}
              variant={isWorkshopOpen ? "success" : "neutral"}
              pulsingDot
              shimmer={false}
            />
            <span className="hidden sm:inline text-foreground-muted">
              {t("hours")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-foreground font-semibold">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{t("localTime")}:</span>
            <span className="text-primary tracking-wide break-all">
              {ethiopianTime || "08:30:00 AM"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Origin (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-glow-sm">
                <Image
                  src="/gt-logo-mark.png"
                  alt="GT Printing Press logo"
                  width={512}
                  height={512}
                  sizes="40px"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-extrabold tracking-tight text-foreground block leading-tight">
                  GT <span className="text-primary font-black">PRINTING</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-foreground-muted block truncate">
                  {common("legalName")}
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground-muted max-w-sm leading-relaxed">
              {t("description")}
            </p>

            {/* Trust Anchors */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-surface-secondary border border-border text-foreground/80">
                {common("since")}
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-secondary border border-border text-foreground/80">
                {common("inHouseProduction")}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                {common("sameDayQuote")}
              </span>
            </div>

              {/* Social channels */}
              <div className="pt-3">
                <p className="text-xs font-bold text-foreground mb-2.5">
                  {t("followUs")}
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {siteSettings?.socialLinks?.length > 0 ? (
                    siteSettings.socialLinks.map((soc: any) => (
                      <a
                        key={soc.id || soc.platform}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={soc.title || soc.platform}
                        title={soc.title || soc.platform}
                        className="p-2 rounded-xl bg-surface-secondary hover:bg-surface text-foreground hover:text-primary border border-border transition-colors capitalize flex items-center gap-1.5"
                      >
                        {soc.platform === "telegram" ? (
                          <Send className="w-4 h-4 text-sky-500" />
                        ) : soc.platform === "linkedin" ? (
                          <Linkedin className="w-4 h-4 text-blue-500" />
                        ) : soc.platform === "instagram" ? (
                          <Instagram className="w-4 h-4 text-pink-500" />
                        ) : soc.platform === "youtube" || soc.platform === "vimeo" ? (
                          <Youtube className="w-4 h-4 text-red-500" />
                        ) : (
                          <Globe className="w-4 h-4 text-primary" />
                        )}
                        {soc.title && <span className="text-[11px] font-semibold pr-1 hidden sm:inline">{soc.title}</span>}
                      </a>
                    ))
                  ) : (
                    <>
                      <a
                        href="https://t.me/gtprintingpress"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram Channel"
                        className="p-2 rounded-xl bg-surface-secondary hover:bg-surface text-foreground hover:text-sky-500 border border-border transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-2 rounded-xl bg-surface-secondary hover:bg-surface text-foreground hover:text-blue-500 border border-border transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="p-2 rounded-xl bg-surface-secondary hover:bg-surface text-foreground hover:text-pink-500 border border-border transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="p-2 rounded-xl bg-surface-secondary hover:bg-surface text-foreground hover:text-red-500 border border-border transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {t("servicesTitle")}
            </h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

            {/* Column 4: Contact & Physical Location */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                {t("contactInfo")}
              </h4>
              <div className="space-y-3 text-sm text-foreground-muted">
                {siteSettings?.locations?.length > 0 ? (
                  siteSettings.locations.map((loc: any) => (
                    <div key={loc.id} className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.label}</span>
                      </div>
                      <a
                        href={loc.mapUrl || "https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs leading-relaxed hover:text-primary transition-colors"
                      >
                        {loc.address}
                      </a>
                    </div>
                  ))
                ) : (
                  <a
                    href="https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 hover:text-primary transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed group-hover:underline">
                      {t("address")}
                    </span>
                  </a>
                )}

                <div className="pt-1 space-y-2">
                  <a
                    href={`tel:${siteSettings?.contactEndpoints?.find((e: any) => e.type === "phone")?.value || "+251115505050"}`}
                    className="flex items-center gap-2.5 hover:text-primary transition-colors text-xs font-mono"
                  >
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      {siteSettings?.contactEndpoints?.find((e: any) => e.type === "phone")?.value || "+251 11 550 5050 / +251 91 123 4567"}
                    </span>
                  </a>

                  <a
                    href={`mailto:${siteSettings?.contactEndpoints?.find((e: any) => e.type === "email")?.value || "info@gtprinting.et"}`}
                    className="flex items-center gap-2.5 hover:text-primary transition-colors text-xs"
                  >
                    <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>
                      {siteSettings?.contactEndpoints?.find((e: any) => e.type === "email")?.value || "info@gtprinting.et"}
                    </span>
                  </a>

                  <a
                    href={
                      siteSettings?.contactEndpoints?.find((e: any) => e.type === "telegram")?.value?.startsWith("http")
                        ? siteSettings.contactEndpoints.find((e: any) => e.type === "telegram").value
                        : `https://t.me/${(siteSettings?.contactEndpoints?.find((e: any) => e.type === "telegram")?.value || "gtprintadmin").replace("@", "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-500/20 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t("telegramChat")}</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-border pt-6 pb-24 md:pb-6 text-xs text-foreground-muted bg-surface-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="max-w-full break-words">© 2026 {common("legalName")}. {common("allRightsReserved")}.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px]">
            <span>Africa Avenue (Bole Road), Addis Ababa</span>
            <span aria-hidden="true">•</span>
            <a
              href="https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              {t("directions")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
