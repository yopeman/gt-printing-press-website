"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { CheckCircle2, ArrowRight, Phone, Send, FileText, AlertCircle } from "lucide-react";

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickQuoteModal({ isOpen, onClose }: QuickQuoteModalProps) {
  const quoteT = useTranslations("quote");
  const servicesT = useTranslations("services");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "offset-digital-printing",
    specifications: "",
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
      setErrorMsg("Please enter a valid Ethiopian phone number (+251 9... / 09... / +251 7... / 07...)");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: formData.serviceType,
          name: formData.name,
          phone: cleanPhone,
          specification: formData.specifications,
          quantity: "Quick Inquiry",
          preferredContact: "phone",
          artworkStatus: "ready",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not submit quote.");
      }

      setSubmittedRef(data.reference);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not submit quote. Please call or message our Telegram desk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedRef(null);
    setErrorMsg(null);
    setFormData({
      name: "",
      phone: "",
      serviceType: "offset-digital-printing",
      specifications: "",
    });
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={resetForm}
      title={submittedRef ? undefined : quoteT("title")}
      description={submittedRef ? undefined : quoteT("subtitle")}
      maxWidth="md"
    >
      {submittedRef ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-foreground">
            {quoteT("successTitle")}
          </h4>
          <p className="text-sm text-foreground-muted">
            {quoteT("successMessage")}{" "}
            <span className="font-mono font-bold text-primary block mt-1 text-base">
              #{submittedRef}
            </span>
          </p>
          <p className="text-xs text-foreground-muted/80 max-w-xs mx-auto">
            {quoteT("successSubtext")}
          </p>
          <div className="pt-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-glow-sm transition-all"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Service Selector */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              {quoteT("step1")}
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="offset-digital-printing">{servicesT("offsetDigital")}</option>
              <option value="publishing-binding">{servicesT("publishingBinding")}</option>
              <option value="packaging-solutions">{servicesT("packagingSolutions")}</option>
              <option value="large-format-signage">{servicesT("largeFormatSignage")}</option>
              <option value="graphic-design-prepress">{servicesT("graphicDesignPrepress")}</option>
              <option value="corporate-promotional-items">{servicesT("corporatePromotional")}</option>
            </select>
          </div>

          {/* Full Name */}
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              {quoteT("phone")} (Ethiopian) *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+251 91 234 5678 or 0912345678"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              {quoteT("specs")} *
            </label>
            <textarea
              required
              rows={3}
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              placeholder={quoteT("specsPlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
    </ModalDialog>
  );
}
