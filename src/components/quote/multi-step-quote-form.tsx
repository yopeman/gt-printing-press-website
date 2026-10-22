"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES_DATA } from "@/data/services";
import { type Locale, type ServiceType, type ContactMethod, type ArtworkStatus } from "@/types/database";
import { IconBox } from "@/components/ui/icon-box";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  FileCheck,
  Layers,
} from "lucide-react";

interface MultiStepQuoteFormProps {
  initialService?: string;
  onSuccess?: (reference: string) => void;
}

export function MultiStepQuoteForm({
  initialService = "offset-digital-printing",
  onSuccess,
}: MultiStepQuoteFormProps) {
  const locale = useLocale() as Locale;
  const quoteT = useTranslations("quote");
  const servicesT = useTranslations("services");

  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    serviceType: initialService as ServiceType,
    name: "",
    company: "",
    phone: "",
    email: "",
    preferredContact: "phone" as ContactMethod,
    specification: "",
    quantity: "1,000 – 5,000 pcs",
    neededBy: "Within 1 week",
    artworkStatus: "ready" as ArtworkStatus,
    externalFileUrl: "",
    attachments: [] as { fileName: string; fileUrl: string; size: number }[],
    website_honey: "", // Honeypot field
  });

  const [copiedRef, setCopiedRef] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalSteps = 4;

  const nextStep = () => {
    setValidationError(null);

    // Step 2 validation
    if (step === 2) {
      if (formData.name.trim().length < 2) {
        setValidationError("Please enter your full name (minimum 2 characters)");
        return;
      }
      const cleanPhone = formData.phone.replace(/[\s-]/g, "");
      const ethiopianPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;
      if (!ethiopianPhoneRegex.test(cleanPhone)) {
        setValidationError("Please enter a valid Ethiopian mobile number (+251 9... / 09... / +251 7... / 07...)");
        return;
      }
    }

    // Step 3 validation
    if (step === 3) {
      if (formData.specification.trim().length < 5) {
        setValidationError("Please describe your job specifications (minimum 5 characters)");
        return;
      }
    }

    if (step < totalSteps) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setValidationError(null);
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  // Handle local file drop and base64 conversion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: { fileName: string; fileUrl: string; size: number }[] = [];

    Array.from(files).forEach((file) => {
      // Limit to 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        setValidationError(`File ${file.name} exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({
            ...prev,
            attachments: [
              ...prev.attachments,
              { fileName: file.name, fileUrl: reader.result as string, size: file.size },
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Submission to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit quote inquiry");
      }

      setSubmittedRef(result.reference);
      if (onSuccess) {
        onSuccess(result.reference);
      }
    } catch (err: any) {
      setValidationError(err?.message || "Connection error. Please call our sales desk directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (!submittedRef) return;
    navigator.clipboard.writeText(submittedRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const quantityBrackets = [
    "100 – 500 pcs",
    "1,000 – 5,000 pcs",
    "10,000 – 50,000 pcs",
    "100,000+ units",
    "Custom / Prototyping",
  ];

  const timelineOptions = [
    "Urgent (24–48 Hours)",
    "Within 1 Week",
    "Within 2–3 Weeks",
    "Flexible / Quote Only",
  ];

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  // SUCCESS SCREEN
  if (submittedRef) {
    return (
      <div className="p-6 sm:p-12 rounded-3xl bg-surface border border-border shadow-card-glass text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-glow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {quoteT("successTitle")}
          </h2>
          <p className="text-sm text-foreground-muted max-w-md mx-auto">
            {quoteT("successMessage")}
          </p>
        </div>

        {/* Copyable Reference Box */}
        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-surface-secondary border border-border">
          <span className="font-mono text-lg sm:text-2xl font-black text-primary break-anywhere">
            #{submittedRef}
          </span>
          <button
            type="button"
            onClick={handleCopyRef}
            className="p-2 rounded-xl bg-surface hover:bg-surface-secondary text-foreground hover:text-primary border border-border transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Copy reference number"
          >
            {copiedRef ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-foreground-muted/90 max-w-md mx-auto leading-relaxed">
          {quoteT("successSubtext")}
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedRef(null);
              setStep(1);
            }}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-hover shadow-glow-sm transition-all"
          >
            Submit Another Quote
          </button>
          <a
            href="https://t.me/gtprintadmin"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-foreground font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>Chat on Telegram</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-10 rounded-3xl bg-surface border border-border shadow-card-glass space-y-8">
      {/* Progress Tracker */}
      <nav aria-label="Quote submission progress" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs font-bold font-mono text-foreground-muted">
          <span>STEP 0{step} OF 0{totalSteps}</span>
          <span className="text-primary uppercase text-right">
            {step === 1 && "Service Selection"}
            {step === 2 && "Contact Information"}
            {step === 3 && "Job Specifications"}
            {step === 4 && "Files & Final Review"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </nav>

      {validationError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Honeypot field (hidden visually from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_honey">Leave blank</label>
        <input
          id="website_honey"
          name="website_honey"
          type="text"
          value={formData.website_honey}
          onChange={(e) => setFormData({ ...formData, website_honey: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        <AnimatePresence mode="wait" custom={direction}>
          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-foreground">
                Which manufacturing division does your project require?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SERVICES_DATA.map((s) => {
                  const isSelected = formData.serviceType === s.slug;
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: s.slug as ServiceType })}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary"
                          : "bg-surface-secondary/50 border-border text-foreground hover:bg-surface hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <IconBox glyph={s.glyph} size="sm" variant={isSelected ? "glow" : "surface"} />
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-foreground">
                          {s.title[locale] || s.title.en}
                        </div>
                        <p className="text-[11px] text-foreground-muted line-clamp-2 mt-1">
                          {s.shortDesc[locale] || s.shortDesc.en}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: CONTACT DETAILS */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-foreground">
                Who should our production team contact with the estimate?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("fullName")} *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Abebe Kebede"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("company")}
                  </label>
                  <input
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Awash Bank / Commercial Entity"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("phone")} (Ethiopian Format) *
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+251 91 123 4567 or 0911234567"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {quoteT("email")}
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="abebe@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Preferred Channel */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  {quoteT("preferredContact")}
                </label>
                <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: "phone", label: "Phone Call", icon: Phone },
                    { id: "telegram", label: "Telegram", icon: Send },
                    { id: "email", label: "Email", icon: Mail },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = formData.preferredContact === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredContact: m.id as ContactMethod })}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-surface-secondary border-border text-foreground hover:bg-surface"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: TECHNICAL SPECIFICATIONS */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-foreground">
                Project Technical Specifications
              </h3>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {quoteT("specs")} (Dimensions, materials, finishing preferences) *
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

              {/* Quantity Bracket */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Estimated Quantity Bracket
                </label>
                <div className="flex flex-wrap gap-2">
                  {quantityBrackets.map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setFormData({ ...formData, quantity: qty })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.quantity === qty
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-surface-secondary border-border text-foreground hover:bg-surface"
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline selector */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Delivery Urgency
                </label>
                <div className="flex flex-wrap gap-2">
                  {timelineOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, neededBy: t })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.neededBy === t
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-surface-secondary border-border text-foreground hover:bg-surface"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
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
                        : "bg-surface-secondary border-border text-foreground hover:bg-surface"
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
                        : "bg-surface-secondary border-border text-foreground hover:bg-surface"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{quoteT("artworkHelp")}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ATTACHMENTS & FINAL REVIEW */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-foreground">
                Artwork Files & External Links (Optional)
              </h3>

              {/* File Dropzone */}
              <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center bg-surface-secondary/40 transition-colors">
                <input
                  type="file"
                  id="quote-files"
                  multiple
                  accept=".pdf,.ai,.psd,.eps,.jpg,.png,.zip"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="quote-files"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    Click to select artwork files
                  </span>
                  <span className="text-xs text-foreground-muted">
                    PDF, AI, PSD, ZIP, JPG, PNG up to 10MB each
                  </span>
                </label>
              </div>

              {/* Uploaded Files List */}
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground-muted font-mono">
                    ATTACHED FILES ({formData.attachments.length})
                  </span>
                  <div className="space-y-1.5">
                    {formData.attachments.map((f, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-surface-secondary border border-border flex items-center justify-between text-xs text-foreground"
                      >
                        <span className="min-w-0 font-mono truncate mr-2">{f.fileName}</span>
                        <span className="text-foreground-muted shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Share Link */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Large File Share Link (Google Drive, WeTransfer, Dropbox)
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input
                    type="url"
                    value={formData.externalFileUrl}
                    onChange={(e) => setFormData({ ...formData, externalFileUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Review Summary Pill */}
              <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border space-y-2 text-xs">
                <span className="font-bold text-foreground block font-mono">Order Inquiry Summary</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground-muted">
                  <div className="break-anywhere">Name: <span className="text-foreground font-semibold">{formData.name}</span></div>
                  <div className="break-anywhere">Phone: <span className="text-foreground font-semibold">{formData.phone}</span></div>
                  <div className="break-anywhere">Quantity: <span className="text-foreground font-semibold">{formData.quantity}</span></div>
                  <div className="break-anywhere">Urgency: <span className="text-foreground font-semibold">{formData.neededBy}</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-3 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-foreground font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-glow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto flex-1 sm:flex-none justify-center px-5 sm:px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-base shadow-glow-md hover:shadow-glow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Transmitting Quote...</span>
              ) : (
                <>
                  <span>Transmit Order Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
