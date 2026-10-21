import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import {
  Printer,
  Sparkles,
  ShieldCheck,
  Clock,
  Layers,
  Cpu,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Database,
  Palette,
  Languages,
} from "lucide-react";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const t = useTranslations("home");
  const common = useTranslations("common");
  const nav = useTranslations("nav");
  const themeT = useTranslations("theme");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Demo Bar / Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-border/80 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-white shadow-glow-sm">
              <Printer className="w-6 h-6" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-foreground block leading-tight">
                GT <span className="text-primary font-black">PRINTING</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-foreground-muted block">
                {common("legalName")}
              </span>
            </div>
          </div>

          {/* Action Dock: Language + Theme Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 md:py-24 lg:py-32">
          {/* Ambient Lighting Gradients */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 animate-pulse-subtle" />
                <span>{t("hero.badge")}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                {t("hero.title")}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
                {t("hero.description")}
              </p>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm sm:text-base shadow-glow-md hover:shadow-glow-lg transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>{t("hero.ctaPrimary")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-secondary text-foreground font-semibold text-sm sm:text-base border border-border transition-colors flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>{t("hero.ctaSecondary")}</span>
                </button>
              </div>

              {/* Quick Trust Strip */}
              <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">
                    {t("stats.experienceYears")}
                  </div>
                  <div className="text-xs text-foreground-muted font-medium">
                    {t("stats.experienceLabel")}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
                    {t("stats.inHouse")}
                  </div>
                  <div className="text-xs text-foreground-muted font-medium">
                    {t("stats.inHouseLabel")}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">
                    {t("stats.turnaround")}
                  </div>
                  <div className="text-xs text-foreground-muted font-medium">
                    {t("stats.turnaroundLabel")}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
                    {t("stats.satisfaction")}
                  </div>
                  <div className="text-xs text-foreground-muted font-medium">
                    {t("stats.satisfactionLabel")}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 1 Verification Grid */}
            <div className="mt-20 max-w-5xl mx-auto">
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-card-glass">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Phase 1 Architecture & Foundation Verified
                    </h2>
                    <p className="text-xs text-foreground-muted">
                      Core infrastructure status across Themes, i18n, Fonts, and Database Schemas
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Theme Engine */}
                  <div className="p-5 rounded-2xl bg-surface-secondary/60 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Palette className="w-4 h-4" />
                      <span>4-State Theme Engine</span>
                    </div>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      Zero-FOUC inline script + CSS token variables configured for Light, Dark, Night (OLED Obsidian & Neon Ruby), and Adaptive System Sync.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">Light</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">Dark</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">Night (OLED)</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">System</span>
                    </div>
                  </div>

                  {/* Trilingual i18n */}
                  <div className="p-5 rounded-2xl bg-surface-secondary/60 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Languages className="w-4 h-4" />
                      <span>Trilingual i18n Engine</span>
                    </div>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      Next-intl routing with prefix negotiation. Plus Jakarta Sans + Noto Sans Ethiopic typography with tuned line-heights.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">/en (English)</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">/am (አማርኛ)</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">/om (Oromoo)</span>
                    </div>
                  </div>

                  {/* Database Models */}
                  <div className="p-5 rounded-2xl bg-surface-secondary/60 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Database className="w-4 h-4" />
                      <span>Mongoose Schemas</span>
                    </div>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      Embedded Localization Pattern for BlogPost, Portfolio, Testimonial, plus QuoteRequest with Ethiopian contact validation schema.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">QuoteRequest</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">BlogPost</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">Portfolio</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-mono border border-border">User</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-surface py-8 text-center text-xs text-foreground-muted">
        <div className="container mx-auto px-4">
          <p>© 2026 {common("legalName")}. {common("allRightsReserved")}.</p>
          <p className="mt-1 text-[11px] text-foreground-muted/70">
            Africa Avenue (Bole Road), Addis Ababa, Ethiopia
          </p>
        </div>
      </footer>
    </div>
  );
}
