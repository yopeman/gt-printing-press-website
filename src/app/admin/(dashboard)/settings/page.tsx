"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Settings,
  Phone,
  Mail,
  Send,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Globe,
  Share2,
  Building,
  ExternalLink,
  Layers,
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
} from "lucide-react";

interface ContactEndpoint {
  id: string;
  title: string;
  type: string;
  customType?: string;
  value: string;
}

interface SocialLink {
  id: string;
  platform: string;
  customPlatform?: string;
  title?: string;
  url: string;
}

interface CompanyLocation {
  id: string;
  label: string;
  customLabel?: string;
  name: string;
  address: string;
  phone?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  operatingHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  isPrimary?: boolean;
}

function SettingsContent() {
  const [companyName, setCompanyName] = useState("");
  const [turnaroundGuarantee, setTurnaroundGuarantee] = useState("");
  const [contactEndpoints, setContactEndpoints] = useState<ContactEndpoint[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [locations, setLocations] = useState<CompanyLocation[]>([]);

  // Telegram Credentials from Database
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestSuccess, setTelegramTestSuccess] = useState<string | null>(null);
  const [telegramTestError, setTelegramTestError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const s = data.settings;
        setCompanyName(s.companyName || "");
        setTurnaroundGuarantee(s.turnaroundGuarantee || "");
        setContactEndpoints(s.contactEndpoints || []);
        setSocialLinks(s.socialLinks || []);
        setLocations(s.locations || []);
        setTelegramBotToken(s.telegramBotToken || "");
        setTelegramChatId(s.telegramChatId || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Contact Endpoints Helpers
  const addContactEndpoint = () => {
    const newEndpoint: ContactEndpoint = {
      id: `ep-${Date.now()}`,
      title: "New Contact Channel",
      type: "phone",
      value: "",
    };
    setContactEndpoints([...contactEndpoints, newEndpoint]);
  };

  const updateContactEndpoint = (id: string, updates: Partial<ContactEndpoint>) => {
    setContactEndpoints((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, ...updates } : ep))
    );
  };

  const removeContactEndpoint = (id: string) => {
    setContactEndpoints((prev) => prev.filter((ep) => ep.id !== id));
  };

  // Social Links Helpers
  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: "telegram",
      title: "Telegram Channel",
      url: "https://",
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks((prev) =>
      prev.map((soc) => (soc.id === id ? { ...soc, ...updates } : soc))
    );
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((soc) => soc.id !== id));
  };

  // Locations Helpers
  const addLocation = () => {
    const newLoc: CompanyLocation = {
      id: `loc-${Date.now()}`,
      label: "Production Workshop",
      name: "New Facility / Workshop Branch",
      address: "Addis Ababa, Ethiopia",
      phone: "+251 11 ...",
      mapUrl: "https://maps.google.com",
      latitude: 8.9954,
      longitude: 38.7885,
      operatingHours: {
        weekday: "Monday – Friday: 8:00 AM – 7:00 PM",
        saturday: "Saturday: 8:30 AM – 5:00 PM",
        sunday: "Sunday: Closed",
      },
      isPrimary: locations.length === 0,
    };
    setLocations([...locations, newLoc]);
  };

  const updateLocation = (id: string, updates: Partial<CompanyLocation>) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc))
    );
  };

  const updateLocationHours = (id: string, key: "weekday" | "saturday" | "sunday", value: string) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id
          ? {
              ...loc,
              operatingHours: {
                ...loc.operatingHours,
                [key]: value,
              },
            }
          : loc
      )
    );
  };

  const removeLocation = (id: string) => {
    if (locations.length <= 1) {
      alert("At least one company location is required.");
      return;
    }
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramTestSuccess(null);
    setTelegramTestError(null);

    try {
      const res = await fetch("/api/admin/telegram/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: telegramBotToken,
          chatId: telegramChatId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch test notification");
      }

      setTelegramTestSuccess("✅ Test notification successfully received by your Telegram channel/chat!");
      setTimeout(() => setTelegramTestSuccess(null), 5000);
    } catch (err: any) {
      setTelegramTestError(err.message || "Failed to send test alert");
      setTimeout(() => setTelegramTestError(null), 7000);
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    // Compute legacy fields for backward compatibility
    const primaryPhone = contactEndpoints.find((e) => e.type === "phone")?.value || "";
    const secondaryPhone = contactEndpoints.filter((e) => e.type === "phone")[1]?.value || "";
    const primaryEmail = contactEndpoints.find((e) => e.type === "email")?.value || "";
    const quotesEmail = contactEndpoints.filter((e) => e.type === "email")[1]?.value || primaryEmail;
    const telegramDesk = contactEndpoints.find((e) => e.type === "telegram")?.value || "";
    const telegramChan = socialLinks.find((s) => s.platform === "telegram")?.url || "";
    const primaryLoc = locations.find((l) => l.isPrimary) || locations[0];

    const payload = {
      companyName,
      turnaroundGuarantee,
      contactEndpoints,
      socialLinks,
      locations,
      // Database-stored Telegram Bot Alert Credentials
      telegramBotToken,
      telegramChatId,
      telegramAlertChannelId: telegramChatId,
      // Fallbacks
      phonePrimary: primaryPhone,
      phoneSecondary: secondaryPhone,
      emailGeneral: primaryEmail,
      emailQuotes: quotesEmail,
      telegramAdminDesk: telegramDesk,
      telegramChannel: telegramChan,
      addressBole: primaryLoc?.address || "",
      latitude: primaryLoc?.latitude || 8.9954,
      longitude: primaryLoc?.longitude || 38.7885,
      workingHoursWeekday: primaryLoc?.operatingHours?.weekday || "",
      workingHoursSaturday: primaryLoc?.operatingHours?.saturday || "",
      workingHoursSunday: primaryLoc?.operatingHours?.sunday || "",
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update configurations");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Site Settings & Configurations
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Dynamic contact endpoints, social platforms, multi-facility locations, and operating hours.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
          title="Refresh Settings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Reload</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-foreground-muted mt-2">Loading system configurations...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Configurations successfully committed to database & synchronized with frontend!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Business Identity */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Business Entity Identity</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Official Company Registered Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Production Turnaround SLA Guarantee
                </label>
                <input
                  type="text"
                  value={turnaroundGuarantee}
                  onChange={(e) => setTurnaroundGuarantee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Endpoints (Renamed & Dynamic) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/80">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Contact Endpoints</span>
                </h2>
                <p className="text-xs text-foreground-muted mt-1">
                  Dynamic contact channels for sales desks, PBX telephones, telegram handles, emails, and WhatsApp.
                </p>
              </div>

              <button
                type="button"
                onClick={addContactEndpoint}
                className="px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact Endpoint</span>
              </button>
            </div>

            {/* Dynamic Contact Endpoints List */}
            <div className="space-y-3">
              {contactEndpoints.map((ep, idx) => (
                <div
                  key={ep.id}
                  className="p-4 rounded-2xl bg-surface-secondary/60 border border-border flex flex-col md:flex-row items-stretch md:items-center gap-3"
                >
                  {/* Channel Title */}
                  <div className="md:w-1/3">
                    <label className="block text-[11px] font-semibold text-foreground-muted mb-1">
                      Channel Title / Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sales Desk Mobile, PBX Switchboard"
                      value={ep.title}
                      onChange={(e) => updateContactEndpoint(ep.id, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* Channel Type Dropdown */}
                  <div className="md:w-1/4">
                    <label className="block text-[11px] font-semibold text-foreground-muted mb-1">
                      Channel Type
                    </label>
                    <select
                      value={ep.type}
                      onChange={(e) => updateContactEndpoint(ep.id, { type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 capitalize"
                    >
                      <option value="phone">Phone Line</option>
                      <option value="telegram">Telegram Handle</option>
                      <option value="email">Email Address</option>
                      <option value="whatsapp">WhatsApp Line</option>
                      <option value="address">Physical Address</option>
                      <option value="custom">Other / Custom</option>
                    </select>
                  </div>

                  {/* Channel Value */}
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-foreground-muted mb-1">
                      Contact Value / Endpoint
                    </label>
                    <input
                      type="text"
                      placeholder={
                        ep.type === "phone"
                          ? "+251 91 123 4567"
                          : ep.type === "telegram"
                          ? "@gtprintadmin"
                          : ep.type === "email"
                          ? "sales@gtprinting.et"
                          : "Channel value..."
                      }
                      value={ep.value}
                      onChange={(e) => updateContactEndpoint(ep.id, { value: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="pt-2 md:pt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeContactEndpoint(ep.id)}
                      className="p-2 rounded-xl text-foreground-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Remove Channel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Links Sub-section */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-primary" />
                    <span>Social Media & Public Channels</span>
                  </h3>
                  <p className="text-[11px] text-foreground-muted">
                    Dropdown selection with custom manual write support for social media, video links & feeds.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSocialLink}
                  className="px-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-foreground hover:border-primary/40 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Social Link</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {socialLinks.map((soc) => (
                  <div
                    key={soc.id}
                    className="p-4 rounded-2xl bg-surface-secondary/50 border border-border flex items-start gap-3"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={soc.platform}
                          onChange={(e) => updateSocialLink(soc.id, { platform: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-bold text-foreground capitalize focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="telegram">Telegram</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="vimeo">Vimeo</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="twitter">X / Twitter</option>
                          <option value="other">Other / Custom</option>
                        </select>

                        {soc.platform === "other" && (
                          <input
                            type="text"
                            placeholder="Platform Name (e.g. Threads)"
                            value={soc.customPlatform || ""}
                            onChange={(e) => updateSocialLink(soc.id, { customPlatform: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        )}

                        <input
                          type="text"
                          placeholder="Title / Caption"
                          value={soc.title || ""}
                          onChange={(e) => updateSocialLink(soc.id, { title: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="https://..."
                          value={soc.url}
                          onChange={(e) => updateSocialLink(soc.id, { url: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSocialLink(soc.id)}
                      className="p-1.5 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Remove Social Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Telegram Bot Dispatch & Alert Credentials (Database-stored) */}
            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram Bot Dispatch Credentials (Database Stored)</span>
                  </h3>
                  <p className="text-[11px] text-foreground-muted">
                    Configure the Telegram Bot Token and Destination Chat/Channel directly in the database. When submitted, production quote alerts and contact inquiries will be dispatched using these credentials (overriding .env.local).
                  </p>
                </div>

                <button
                  type="button"
                  disabled={testingTelegram || !telegramBotToken.trim() || !telegramChatId.trim()}
                  onClick={handleTestTelegram}
                  className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-40"
                  title="Dispatch a live test message to verify Telegram integration"
                >
                  {testingTelegram ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Test Alert...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Alert</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status alerts */}
              {telegramTestSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{telegramTestSuccess}</span>
                </div>
              )}
              {telegramTestError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{telegramTestError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bot Token */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Telegram Bot Token
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      value={telegramBotToken}
                      onChange={(e) => setTelegramBotToken(e.target.value)}
                      placeholder="e.g. bot token from bot father"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors p-1"
                      title={showToken ? "Hide token" : "Show token"}
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-foreground-muted mt-1 font-mono">
                    Created via Telegram @BotFather (saved directly to MongoDB SiteSetting).
                  </p>
                </div>

                {/* Destination Chat ID / Channel */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Destination Chat ID / Channel Username
                  </label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="e.g. -1002233445566"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <p className="text-[10px] text-foreground-muted mt-1 font-mono">
                    Telegram Channel username (e.g. @channel) or private group chat ID.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Company Locations & Operating Hours (Renamed & Multi-Location) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/80">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Company Locations & Operating Hours</span>
                </h2>
                <p className="text-xs text-foreground-muted mt-1">
                  Manage multiple facility branches (Head Office, Production Workshops, Studio) with respective operating schedules.
                </p>
              </div>

              <button
                type="button"
                onClick={addLocation}
                className="px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Location (+ Add Location)</span>
              </button>
            </div>

            {/* Locations Cards List */}
            <div className="space-y-6">
              {locations.map((loc, idx) => (
                <div
                  key={loc.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 ${
                    loc.isPrimary
                      ? "bg-surface border-primary/40 shadow-sm"
                      : "bg-surface-secondary/40 border-border"
                  }`}
                >
                  {/* Top Bar of Location Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={loc.label}
                        onChange={(e) => updateLocation(loc.id, { label: e.target.value })}
                        className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="Head Office">Head Office</option>
                        <option value="Production Workshop">Production Workshop</option>
                        <option value="Showroom & Studio">Showroom & Studio</option>
                        <option value="Branch Office">Branch Office</option>
                        <option value="other">Other / Custom Label</option>
                      </select>

                      {loc.label === "other" && (
                        <input
                          type="text"
                          placeholder="Custom Label"
                          value={loc.customLabel || ""}
                          onChange={(e) => updateLocation(loc.id, { customLabel: e.target.value })}
                          className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      )}

                      {loc.isPrimary ? (
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          Primary Headquarters
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setLocations((prev) =>
                              prev.map((l) => ({ ...l, isPrimary: l.id === loc.id }))
                            );
                          }}
                          className="text-[11px] text-foreground-muted hover:text-primary transition-colors underline"
                        >
                          Set as Primary
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLocation(loc.id)}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 self-end sm:self-auto"
                      title="Remove Location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Facility</span>
                    </button>
                  </div>

                  {/* Location Details Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Facility Name / Title
                      </label>
                      <input
                        type="text"
                        value={loc.name}
                        onChange={(e) => updateLocation(loc.id, { name: e.target.value })}
                        placeholder="e.g. Africa Avenue (Bole Road) Facility"
                        className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Facility Direct Telephone
                      </label>
                      <input
                        type="text"
                        value={loc.phone || ""}
                        onChange={(e) => updateLocation(loc.id, { phone: e.target.value })}
                        placeholder="+251 11 550 5050"
                        className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Full Physical Address
                      </label>
                      <input
                        type="text"
                        value={loc.address}
                        onChange={(e) => updateLocation(loc.id, { address: e.target.value })}
                        placeholder="e.g. 2nd Floor, Behind Dembel City Centre, Africa Avenue, Addis Ababa"
                        className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Google Maps Link / Direct Navigation URL
                      </label>
                      <input
                        type="text"
                        value={loc.mapUrl || ""}
                        onChange={(e) => updateLocation(loc.id, { mapUrl: e.target.value })}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground-muted mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={loc.latitude || 8.9954}
                        onChange={(e) => updateLocation(loc.id, { latitude: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-foreground-muted mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={loc.longitude || 38.7885}
                        onChange={(e) => updateLocation(loc.id, { longitude: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  {/* Operating Schedule Inputs for this location */}
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[11px] font-bold text-foreground-muted block mb-2 font-mono uppercase">
                      Operating Schedule for this Facility
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Monday &ndash; Friday Schedule
                        </label>
                        <input
                          type="text"
                          value={loc.operatingHours?.weekday || ""}
                          onChange={(e) => updateLocationHours(loc.id, "weekday", e.target.value)}
                          placeholder="Monday – Friday: 8:00 AM – 7:30 PM"
                          className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Saturday Schedule
                        </label>
                        <input
                          type="text"
                          value={loc.operatingHours?.saturday || ""}
                          onChange={(e) => updateLocationHours(loc.id, "saturday", e.target.value)}
                          placeholder="Saturday: 8:30 AM – 5:00 PM"
                          className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Sunday Schedule
                        </label>
                        <input
                          type="text"
                          value={loc.operatingHours?.sunday || ""}
                          onChange={(e) => updateLocationHours(loc.id, "sunday", e.target.value)}
                          placeholder="Sunday: Closed (Online quotes 24/7)"
                          className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Save Button */}
          <div className="flex justify-end pt-2 pb-12">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm hover:shadow-glow-md transition-all flex items-center gap-2.5 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Configurations</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
