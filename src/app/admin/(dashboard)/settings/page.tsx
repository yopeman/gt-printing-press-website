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
} from "lucide-react";

function SettingsContent() {
  const [settings, setSettings] = useState({
    companyName: "",
    phonePrimary: "",
    phoneSecondary: "",
    emailGeneral: "",
    emailQuotes: "",
    telegramChannel: "",
    telegramAdminDesk: "",
    addressBole: "",
    latitude: 8.9954,
    longitude: 38.7885,
    workingHoursWeekday: "",
    workingHoursSaturday: "",
    workingHoursSunday: "",
    turnaroundGuarantee: "",
  });

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
        setSettings(data.settings);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Site Settings & Configurations
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Manage public contact endpoints, Bole Road office coordinates, and Telegram routing.
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Configurations successfully committed to database!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Business Identity */}
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Business Entity Identity
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Official Company Registered Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Production Turnaround SLA Guarantee
                </label>
                <input
                  type="text"
                  value={settings.turnaroundGuarantee}
                  onChange={(e) => setSettings({ ...settings, turnaroundGuarantee: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Communication Endpoints */}
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone & Telegram Endpoints
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Primary Mobile / Telegram Phone
                </label>
                <input
                  type="text"
                  value={settings.phonePrimary}
                  onChange={(e) => setSettings({ ...settings, phonePrimary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Workshop Landline
                </label>
                <input
                  type="text"
                  value={settings.phoneSecondary}
                  onChange={(e) => setSettings({ ...settings, phoneSecondary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  General Info Email
                </label>
                <input
                  type="email"
                  value={settings.emailGeneral}
                  onChange={(e) => setSettings({ ...settings, emailGeneral: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Sales & Quotes Dispatch Email
                </label>
                <input
                  type="email"
                  value={settings.emailQuotes}
                  onChange={(e) => setSettings({ ...settings, emailQuotes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Public Telegram Channel
                </label>
                <input
                  type="text"
                  value={settings.telegramChannel}
                  onChange={(e) => setSettings({ ...settings, telegramChannel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Admin Telegram Lead Desk Handle
                </label>
                <input
                  type="text"
                  value={settings.telegramAdminDesk}
                  onChange={(e) => setSettings({ ...settings, telegramAdminDesk: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bole Location & Hours */}
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Bole Road Facility & Operating Hours
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Physical Workshop & Showroom Address
                </label>
                <input
                  type="text"
                  value={settings.addressBole}
                  onChange={(e) => setSettings({ ...settings, addressBole: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={settings.latitude}
                    onChange={(e) => setSettings({ ...settings, latitude: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={settings.longitude}
                    onChange={(e) => setSettings({ ...settings, longitude: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Monday &ndash; Friday Hours
                  </label>
                  <input
                    type="text"
                    value={settings.workingHoursWeekday}
                    onChange={(e) => setSettings({ ...settings, workingHoursWeekday: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Saturday Hours
                  </label>
                  <input
                    type="text"
                    value={settings.workingHoursSaturday}
                    onChange={(e) => setSettings({ ...settings, workingHoursSaturday: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Sunday Schedule
                  </label>
                  <input
                    type="text"
                    value={settings.workingHoursSunday}
                    onChange={(e) => setSettings({ ...settings, workingHoursSunday: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm hover:shadow-glow-md transition-all flex items-center gap-2 disabled:opacity-50"
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
