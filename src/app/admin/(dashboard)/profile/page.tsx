"use client";

import React, { useState, useEffect } from "react";
import {
  UserCog,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Sparkles,
  Check,
  X,
  FileEdit,
  ShieldCheck,
  Layers,
  ExternalLink,
} from "lucide-react";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  phone?: string;
  avatarUrl?: string;
  active?: boolean;
  lastLogin?: string;
  createdAt: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Toast feedback
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setPersonalData({
          name: data.profile.name || "",
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          avatarUrl: data.profile.avatarUrl || "",
        });
      } else {
        showToast("error", "Failed to load user profile");
      }
    } catch (err: any) {
      console.error(err);
      showToast("error", "Connection error loading profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Save Personal Details
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personalData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setProfile(data.profile);
      showToast("success", "Profile details updated successfully");
    } catch (err: any) {
      showToast("error", err.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "New password and confirmation do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters long");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/admin/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      showToast("success", data.message || "Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "GT";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-surface backdrop-blur-md"
              : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 bg-surface backdrop-blur-md"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-surface-secondary text-foreground-muted ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Avatar Display */}
        <div className="relative group shrink-0">
          {personalData.avatarUrl ? (
            <img
              src={personalData.avatarUrl}
              alt={profile?.name || "User Avatar"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-primary/30 shadow-glow-sm"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-primary/10 border-2 border-primary/20 text-primary flex items-center justify-center font-black text-3xl font-mono shadow-glow-sm">
              {getInitials(profile?.name || "Admin")}
            </div>
          )}

          <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-xl bg-surface border border-border shadow-sm">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 block animate-pulse" />
          </div>
        </div>

        {/* Profile Info Summary */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              {profile?.name || "Staff Administrator"}
            </h1>
            {profile?.role === "admin" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold text-xs uppercase tracking-wider font-mono">
                <FileEdit className="w-3.5 h-3.5" />
                <span>Content Editor</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-foreground-muted flex items-center justify-center sm:justify-start gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span>{profile?.email || "admin@gtprintingpress.com"}</span>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-foreground-muted font-mono">
            {profile?.createdAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                Active Session &bull;{" "}
                {profile?.lastLogin
                  ? new Date(profile.lastLogin).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Current session"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Personal Details & Security Passwords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: Personal Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Personal Information
              </h2>
              <p className="text-xs text-foreground-muted">
                Update your display name, contact phone, and avatar
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="text"
                  required
                  value={personalData.name}
                  onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                  placeholder="Your Full Name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Email Address (Login Credential) *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="email"
                  required
                  value={personalData.email}
                  onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                  placeholder="admin@gtprintingpress.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <span className="text-[10px] text-foreground-muted mt-1 block">
                Changing your email updates the username required to log in.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="text"
                  value={personalData.phone}
                  onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                  placeholder="+251 91 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <SingleImageUploader
              value={personalData.avatarUrl}
              onChange={(url) => setPersonalData({ ...personalData, avatarUrl: url })}
              label="Avatar / Profile Photo"
              description="Upload a photo from your computer (JPG, PNG, WebP up to 15MB)."
            />

            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-glow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* PANEL 2: Password & Security */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Security & Password
              </h2>
              <p className="text-xs text-foreground-muted">
                Update your private administrative password
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            {/* Current Password */}
            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                New Password (Minimum 6 characters) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Choose strong new password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block font-semibold text-foreground mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Security Notice Box */}
            <div className="p-3.5 rounded-2xl bg-surface-secondary/70 border border-border text-[11px] text-foreground-muted space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Password Requirements</span>
              </span>
              <p>
                Must be at least 6 characters. We recommend a mix of uppercase letters, numbers, and symbols for high security.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-glow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Role & Permissions Breakdown Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Account Privileges & Capabilities
            </h3>
            <p className="text-xs text-foreground-muted">
              Scope of operations enabled for role: <span className="font-bold text-primary capitalize">{profile?.role || "Staff"}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border space-y-1.5">
            <span className="font-bold text-foreground block">Content & Production CMS</span>
            <p className="text-foreground-muted text-[11px] leading-relaxed">
              Full control over Services, Machinery specs, Industries, Blogs, Testimonials, and Portfolio projects.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border space-y-1.5">
            <span className="font-bold text-foreground block">Lead & Quote Pipeline</span>
            <p className="text-foreground-muted text-[11px] leading-relaxed">
              View incoming customer quote requests, download artwork files, update pipeline stages, and contact clients.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border space-y-1.5">
            <span className="font-bold text-foreground block">
              {profile?.role === "admin" ? "Administrative Controls" : "Restricted System Controls"}
            </span>
            <p className="text-foreground-muted text-[11px] leading-relaxed">
              {profile?.role === "admin"
                ? "Full access to Staff User Management, Telegram API bot configuration, and Site Settings."
                : "Staff User Management and Global Site Settings are reserved for Administrators."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
