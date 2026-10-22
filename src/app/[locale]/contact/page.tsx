"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { StatusBadge } from "@/components/ui";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Building,
  Compass,
  Navigation,
} from "lucide-react";

export default function ContactPage() {
  const locale = useLocale();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website_honey: "",
  });

  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

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

  const handleCopyRef = () => {
    if (!submittedRef) return;
    navigator.clipboard.writeText(submittedRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: form.subject,
          message: form.message,
          website_honey: form.website_honey,
          locale,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to transmit inquiry. Please call our sales desk directly.");
      }

      setSubmittedRef(result.reference);
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website_honey: "",
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Connection error. Please call our sales desk directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="Direct Communication" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Contact GT Printing Press
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            Visit our corporate office behind Dembel City Centre, reach our sales engineers via telephone, or send a direct Telegram inquiry.
          </p>
        </div>

        {/* Contact Information & Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Coordinates & Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Company Locations Cards */}
            {siteSettings?.locations?.length > 0 ? (
              siteSettings.locations.map((loc: any) => (
                <div key={loc.id} className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
                      <MapPin className="w-4 h-4" />
                      <span>{loc.label === "other" ? loc.customLabel || "Facility" : loc.label}</span>
                    </div>
                    {loc.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase font-mono">
                        Primary HQ
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {loc.address}
                  </p>
                  {loc.phone && (
                    <div className="text-xs font-mono text-foreground font-semibold">
                      Tel: <a href={`tel:${loc.phone}`} className="hover:text-primary transition-colors">{loc.phone}</a>
                    </div>
                  )}

                  {/* Schedule for this location */}
                  {loc.operatingHours && (
                    <div className="pt-2 border-t border-border/60 text-xs space-y-1 text-foreground-muted">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-500 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Operating Hours</span>
                      </div>
                      <p className="font-medium text-foreground text-[11px]">{loc.operatingHours.weekday}</p>
                      {loc.operatingHours.saturday && <p className="text-[11px]">{loc.operatingHours.saturday}</p>}
                    </div>
                  )}

                  <div className="pt-2">
                    <a
                      href={loc.mapUrl || "https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
                  <MapPin className="w-4 h-4" />
                  <span>Head Office & Studio</span>
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Africa Avenue (Bole Road)
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  2nd Floor, Behind Dembel City Centre, Africa Avenue, Kirkos Sub-City, Addis Ababa, Ethiopia.
                </p>
                <div className="pt-2">
                  <a
                    href="https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Direct Telephone & Communication Lines */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider font-mono">
                <Phone className="w-4 h-4" />
                <span>Contact Channels & Desks</span>
              </div>
              <div className="space-y-2 text-sm text-foreground">
                {siteSettings?.contactEndpoints?.length > 0 ? (
                  siteSettings.contactEndpoints.map((ep: any) => (
                    <div key={ep.id} className="text-xs">
                      <span className="text-foreground-muted block text-[11px]">{ep.title}:</span>
                      {ep.type === "phone" || ep.type === "whatsapp" ? (
                        <a href={`tel:${ep.value}`} className="font-bold hover:text-primary transition-colors font-mono">
                          {ep.value}
                        </a>
                      ) : ep.type === "email" ? (
                        <a href={`mailto:${ep.value}`} className="font-bold hover:text-primary transition-colors">
                          {ep.value}
                        </a>
                      ) : (
                        <span className="font-semibold text-foreground">{ep.value}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div>
                      <span className="text-xs text-foreground-muted block">Office PBX:</span>
                      <a href="tel:+251115505050" className="font-bold hover:text-primary transition-colors">
                        +251 11 550 5050
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-foreground-muted block">Quotation Mobile:</span>
                      <a href="tel:+251911234567" className="font-bold hover:text-primary transition-colors">
                        +251 91 123 4567
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Telegram 1-Tap Desks */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-sky-500 font-bold text-xs uppercase tracking-wider font-mono">
                <Send className="w-4 h-4" />
                <span>Instant Telegram Connectivity</span>
              </div>
              <p className="text-xs text-foreground-muted">
                Connect directly with our estimator team for instantaneous file vetting.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={
                    siteSettings?.contactEndpoints?.find((e: any) => e.type === "telegram")?.value?.startsWith("http")
                      ? siteSettings.contactEndpoints.find((e: any) => e.type === "telegram").value
                      : `https://t.me/${(siteSettings?.contactEndpoints?.find((e: any) => e.type === "telegram")?.value || "gtprintadmin").replace("@", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-semibold text-xs text-center hover:bg-sky-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Direct Sales Chat</span>
                </a>
                <a
                  href={
                    siteSettings?.socialLinks?.find((s: any) => s.platform === "telegram")?.url ||
                    "https://t.me/gtprintingpress"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-surface-secondary border border-border text-foreground font-semibold text-xs text-center hover:bg-surface transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Channel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: General Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-card-glass space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>Send Us a General Inquiry</span>
                </h3>
                <p className="text-xs text-foreground-muted">
                  Have a question regarding corporate contracts or facility visits? Send our desk a message.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-foreground">
                      Message Transmitted Successfully!
                    </h4>
                    <p className="text-xs text-foreground-muted">
                      Your inquiry has been dispatched directly to our Telegram alert desk & sales queue.
                    </p>
                  </div>

                  {submittedRef && (
                    <div className="inline-flex items-center gap-2 p-3 px-4 rounded-2xl bg-surface-secondary border border-border shadow-inner">
                      <span className="text-xs text-foreground-muted">Reference:</span>
                      <span className="font-mono text-sm font-bold text-primary">
                        #{submittedRef}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyRef}
                        className="p-1 rounded-lg hover:bg-surface text-foreground-muted hover:text-foreground transition-colors ml-1"
                        title="Copy reference code"
                      >
                        {copiedRef ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-foreground-muted max-w-sm mx-auto">
                    Thank you. Our administrative team will review your message and reply via phone or email on the same working day.
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSubmittedRef(null);
                        setErrorMsg(null);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-glow-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Honeypot field (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website_honey}
                      onChange={(e) => setForm({ ...form, website_honey: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Abebe Kebede"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+251 9... / 09..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="abebe@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Partnership inquiry / Facility inspection"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we assist your business?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <span>Transmit Inquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Multi-Location Maps Slider (Slide between all DB facilities: <- map1 | map2 ->) */}
        {(() => {
          const locations =
            siteSettings?.locations && siteSettings.locations.length > 0
              ? siteSettings.locations
              : [
                  {
                    id: "loc-1",
                    label: "Head Office",
                    name: "Africa Avenue (Bole Road) Corporate Facility",
                    address:
                      "2nd Floor, Behind Dembel City Centre, Africa Avenue, Kirkos Sub-City, Addis Ababa, Ethiopia",
                    phone: "+251 11 550 5050",
                    mapUrl: "https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8",
                    latitude: 8.9954,
                    longitude: 38.7885,
                    operatingHours: {
                      weekday: "Monday – Friday: 8:00 AM – 7:30 PM",
                      saturday: "Saturday: 8:30 AM – 5:00 PM",
                      sunday: "Closed",
                    },
                    isPrimary: true,
                  },
                  {
                    id: "loc-2",
                    label: "Production Workshop",
                    name: "Industrial Printing & Large Format Fabrication Plant",
                    address: "Industrial Zone, Kality Industrial Sub-City, Addis Ababa, Ethiopia",
                    phone: "+251 91 123 4567",
                    mapUrl: "https://maps.google.com",
                    latitude: 8.9214,
                    longitude: 38.7422,
                    operatingHours: {
                      weekday: "Monday – Saturday: 24-Hour Production Shifts",
                      saturday: "Saturday: Active Press Shifts",
                      sunday: "Scheduled Volume Production",
                    },
                    isPrimary: false,
                  },
                ];

          const total = locations.length;
          const firstIndex = activeMapIndex % total;
          const secondIndex = (activeMapIndex + 1) % total;
          const firstLoc = locations[firstIndex] || locations[0];
          const secondLoc = total > 1 ? locations[secondIndex] : null;

          const getEmbedUrl = (loc: any) => {
            if (loc.latitude && loc.longitude) {
              return `https://maps.google.com/maps?q=${loc.latitude},${loc.longitude}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
            }
            if (loc.address) {
              return `https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
            }
            return "https://maps.google.com/maps?q=Behind+Dembel+City+Centre,+Africa+Avenue,+Addis+Ababa,+Ethiopia&t=&z=16&ie=UTF8&iwloc=&output=embed";
          };

          const handlePrev = () => {
            setActiveMapIndex((prev) => (prev - 1 + total) % total);
          };

          const handleNext = () => {
            setActiveMapIndex((prev) => (prev + 1) % total);
          };

          const renderMapCard = (loc: any, mapIndex: number, isActiveSlide: boolean) => (
            <div
              key={loc.id || mapIndex}
              className={`flex flex-col justify-between rounded-3xl bg-surface border transition-all duration-300 p-4 sm:p-6 space-y-4 shadow-sm hover:shadow-md ${
                isActiveSlide
                  ? "border-primary/60 ring-2 ring-primary/20 shadow-glow-sm"
                  : "border-border/80"
              }`}
            >
              {/* Header: Map #, Facility Type, Coordinates */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-xs">
                      MAP {String(mapIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-surface-secondary border border-border text-foreground-muted text-[11px] font-semibold uppercase font-mono">
                      {loc.label === "other" ? loc.customLabel || "Facility" : loc.label || "Facility"}
                    </span>
                    {loc.isPrimary && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase font-mono">
                        Primary HQ
                      </span>
                    )}
                  </div>

                  {loc.latitude && loc.longitude && (
                    <span className="text-[10px] font-mono text-foreground-muted flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-primary" />
                      <span>
                        {loc.latitude.toFixed(4)}° N, {loc.longitude.toFixed(4)}° E
                      </span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug">
                  {loc.name}
                </h3>

                <p className="text-xs text-foreground-muted flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </p>
              </div>

              {/* Operating hours & Phone snippet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2.5 px-3 rounded-2xl bg-surface-secondary/70 border border-border/70">
                {loc.phone && (
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                    <a
                      href={`tel:${loc.phone}`}
                      className="text-foreground hover:text-primary transition-colors font-semibold truncate"
                    >
                      {loc.phone}
                    </a>
                  </div>
                )}
                {loc.operatingHours?.weekday && (
                  <div className="flex items-center gap-1.5 font-mono text-foreground-muted truncate">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{loc.operatingHours.weekday}</span>
                  </div>
                )}
              </div>

              {/* Responsive Embedded Map Viewport */}
              <div className="rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] min-h-[260px] sm:min-h-[300px] bg-surface-secondary border border-border/90 relative group shadow-inner">
                <iframe
                  title={`${loc.name} Location Map`}
                  src={getEmbedUrl(loc)}
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Footer action buttons */}
              <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/60">
                <div className="text-[11px] text-foreground-muted font-mono flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-primary" />
                  <span>GPS Directions</span>
                </div>

                <a
                  href={
                    loc.mapUrl ||
                    `https://maps.google.com/?q=${encodeURIComponent(loc.address)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );

          return (
            <div className="rounded-3xl border border-border shadow-card-glass bg-surface p-4 sm:p-7 space-y-6">
              {/* Top Controls Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-base text-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Company Facilities & Location Maps Slider</span>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    Explore all {total} production and administrative locations saved in database. Slide between maps using arrows below.
                  </p>
                </div>

                {/* Top Facility Counter and Jump Controls */}
                <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-surface-secondary border border-border text-foreground">
                    {total <= 2 ? `Showing All ${total} Maps` : `Viewing ${firstIndex + 1} & ${secondIndex + 1} of ${total}`}
                  </span>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-secondary hover:bg-primary hover:text-white border border-border text-foreground transition-all flex items-center gap-1 text-xs font-bold"
                    title="Previous Location (<-)"
                    aria-label="Previous Location"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-secondary hover:bg-primary hover:text-white border border-border text-foreground transition-all flex items-center gap-1 text-xs font-bold"
                    title="Next Location (->)"
                    aria-label="Next Location"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Location Direct Selector Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {locations.map((loc: any, idx: number) => {
                  const isVisibleInView =
                    idx === firstIndex || (total > 1 && idx === secondIndex);
                  return (
                    <button
                      key={loc.id || idx}
                      type="button"
                      onClick={() => setActiveMapIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                        isVisibleInView
                          ? "bg-primary text-white border-primary shadow-glow-sm"
                          : "bg-surface-secondary hover:bg-surface border-border text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>
                        Map {idx + 1}: {loc.label || "Facility"} – {loc.name}
                      </span>
                      {loc.isPrimary && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md uppercase font-bold ${
                            isVisibleInView
                              ? "bg-white/20 text-white"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          HQ
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* The Slide Row: (<- map1 | map2 ->) */}
              <div className="flex items-stretch gap-2 sm:gap-4">
                {/* Left Arrow Button (<-) */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="self-center p-2.5 sm:p-4 rounded-2xl bg-surface-secondary hover:bg-primary text-foreground hover:text-white border border-border hover:border-primary shadow-md hover:shadow-glow-sm transition-all hover:scale-105 shrink-0 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-primary/40"
                  title="Previous Facility Map (<-)"
                  aria-label="Previous Facility Map (<-)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
                </button>

                {/* Multi-Map Slide Viewport: Map 1 | Map 2 */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative">
                  {/* First Map Slide */}
                  {renderMapCard(firstLoc, firstIndex, activeMapIndex === firstIndex)}

                  {/* Vertical Divider | on Desktop */}
                  {secondLoc && (
                    <div className="hidden lg:flex absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-border to-transparent pointer-events-none items-center justify-center z-10">
                      <div className="p-1 rounded-full bg-surface border border-border shadow-xs text-foreground-muted">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  )}

                  {/* Second Map Slide (Desktop side-by-side, or slide on mobile) */}
                  {secondLoc && (
                    <div className="hidden lg:block">
                      {renderMapCard(secondLoc, secondIndex, activeMapIndex === secondIndex)}
                    </div>
                  )}
                </div>

                {/* Right Arrow Button (->) */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="self-center p-2.5 sm:p-4 rounded-2xl bg-surface-secondary hover:bg-primary text-foreground hover:text-white border border-border hover:border-primary shadow-md hover:shadow-glow-sm transition-all hover:scale-105 shrink-0 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-primary/40"
                  title="Next Facility Map (->)"
                  aria-label="Next Facility Map (->)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* Mobile Slide Switcher Notification */}
              <div className="lg:hidden text-center">
                <p className="text-xs text-foreground-muted font-mono">
                  Showing Map {firstIndex + 1} of {total}. Tap arrows <span className="font-bold text-foreground">&lt;- / -&gt;</span> to slide between facilities.
                </p>
              </div>

              {/* Slide Pagination Dots Indicator */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {locations.map((loc: any, idx: number) => {
                  const isCurrent = activeMapIndex === idx;
                  return (
                    <button
                      key={loc.id || idx}
                      type="button"
                      onClick={() => setActiveMapIndex(idx)}
                      className={`transition-all rounded-full ${
                        isCurrent
                          ? "w-8 h-2.5 bg-primary shadow-glow-xs"
                          : "w-2.5 h-2.5 bg-border hover:bg-foreground-muted"
                      }`}
                      title={`Go to Map ${idx + 1}: ${loc.name}`}
                      aria-label={`Go to Map ${idx + 1}: ${loc.name}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
