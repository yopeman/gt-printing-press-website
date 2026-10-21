"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { StatusBadge, TiltCard } from "@/components/ui";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  PhoneCall,
  Paperclip,
} from "lucide-react";

function QuoteFormContent() {
  const quoteT = useTranslations("quote");
  const servicesT = useTranslations("services");
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "offset-digital-printing";

  const [formData, setFormData] = useState({
    serviceType: initialService,
    name: "",
    company: "",
    phone: "",
    email: "",
    preferredContact: "phone",
    specification: "",
    quantity: "",
    neededBy: "",
    artworkStatus: "ready",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate Ethiopian phone number
    const ethiopianPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;
    const cleanPhone = formData.phone.replace(/[\s-]/g, "");

    if (!ethiopianPhoneRegex.test(cleanPhone)) {
      setErrorMsg("Please enter a valid Ethiopian mobile number (+251 9... / 09... / +251 7... / 07...)");
      return;
    }

    setIsSubmitting(true);
    const refCode = `GT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await new Promise((r) => setTimeout(r, 900));
      setSubmittedRef(refCode);
    } catch (err: any) {
      setErrorMsg("Failed to transmit quote inquiry. Please contact our Telegram desk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <StatusBadge label="Same-Working-Day Estimation" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            {quoteT("title")}
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed max-w-2xl mx-auto">
            {quoteT("subtitle")}
          </p>
        </div>

        {submittedRef ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-card-glass text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {quoteT("successTitle")}
            </h2>

            <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border inline-block">
              <span className="text-xs text-foreground-muted block font-mono">Reference Number</span>
              <span className="text-2xl font-mono font-black text-primary block mt-0.5">
                #{submittedRef}
              </span>
            </div>

            <p className="text-sm text-foreground-muted max-w-md mx-auto leading-relaxed">
              {quoteT("successSubtext")}
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-glow-sm transition-all"
              >
                Submit Another Request
              </button>
              <a
                href="https://t.me/gtprintadmin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-foreground font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-sky-500" />
                <span>Message Telegram Desk</span>
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-card-glass space-y-8"
          >
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Service */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-primary uppercase tracking-wider">
                <span>01. SERVICE SELECTION</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: "offset-digital-printing", label: servicesT("offsetDigital") },
                  { id: "publishing-binding", label: servicesT("publishingBinding") },
                  { id: "packaging-solutions", label: servicesT("packagingSolutions") },
                  { id: "large-format-signage", label: servicesT("largeFormatSignage") },
                  { id: "graphic-design-prepress", label: servicesT("graphicDesignPrepress") },
                  { id: "corporate-promotional-items", label: servicesT("corporatePromotional") },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: s.id })}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all ${
                      formData.serviceType === s.id
                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                        : "bg-surface-secondary/50 border-border text-foreground hover:bg-surface hover:border-primary/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Contact */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-primary uppercase tracking-wider">
                <span>02. CONTACT DETAILS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("fullName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Abebe Kebede"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("company")}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Example PLC"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("phone")} (Ethiopian Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+251 9... / 09... / +251 7... / 07..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("email")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Specifications */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-primary uppercase tracking-wider">
                <span>03. JOB SPECIFICATIONS</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {quoteT("specs")} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  placeholder={quoteT("specsPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("quantity")}
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 500 pcs / 10,000 units"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("neededBy")}
                  </label>
                  <input
                    type="date"
                    value={formData.neededBy}
                    onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Artwork Status */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  {quoteT("artworkStatus")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, artworkStatus: "ready" })}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                      formData.artworkStatus === "ready"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-surface-secondary/50 border-border text-foreground hover:bg-surface"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{quoteT("artworkReady")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, artworkStatus: "need_help" })}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                      formData.artworkStatus === "need_help"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-surface-secondary/50 border-border text-foreground hover:bg-surface"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{quoteT("artworkHelp")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-glow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{quoteT("submitting")}</span>
                ) : (
                  <>
                    <span>{quoteT("submit")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <QuoteFormContent />
    </Suspense>
  );
}
