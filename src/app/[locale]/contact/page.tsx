"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
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
            {/* Office Address Card */}
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

            {/* Direct Telephone Lines */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider font-mono">
                <Phone className="w-4 h-4" />
                <span>Telephone & Sales Desk</span>
              </div>
              <div className="space-y-1.5 text-sm text-foreground">
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
                  href="https://t.me/gtprintadmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-semibold text-xs text-center hover:bg-sky-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Direct Sales Chat</span>
                </a>
                <a
                  href="https://t.me/gtprintingpress"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-surface-secondary border border-border text-foreground font-semibold text-xs text-center hover:bg-surface transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Channel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-wider font-mono">
                <Clock className="w-4 h-4" />
                <span>Operating Schedule</span>
              </div>
              <p className="font-semibold text-foreground">
                Monday – Saturday: 8:30 AM – 6:00 PM (East Africa Time)
              </p>
              <p className="text-foreground-muted">
                Sunday: Closed (Online quote inquiries accepted 24/7)
              </p>
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
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-sm text-foreground-muted max-w-sm mx-auto">
                    Thank you. Our administrative team will review your message and reply via email or phone on the same working day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Embedded Interactive Map Card */}
        <div className="rounded-3xl overflow-hidden border border-border shadow-card-glass bg-surface p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>GT Printing Location Map (Africa Avenue)</span>
            </div>
            <a
              href="https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Direct Google Maps Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-surface-secondary border border-border/80 relative">
            <iframe
              title="GT Printing Press Africa Avenue Location"
              src="https://maps.google.com/maps?q=Behind+Dembel+City+Centre,+Africa+Avenue,+Addis+Ababa,+Ethiopia&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter contrast-105"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
