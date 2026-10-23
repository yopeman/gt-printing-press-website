"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  FileEdit,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  MoreVertical,
  KeyRound,
  Trash2,
  Edit3,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  X,
  Check,
  Lock,
  UserCheck,
  UserX,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";

interface StaffUser {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  phone?: string;
  avatarUrl?: string;
  active?: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface UserStats {
  total: number;
  admins: number;
  editors: number;
  active: number;
  inactive: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    admins: 0,
    editors: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [passwordResetUser, setPasswordResetUser] = useState<StaffUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<StaffUser | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
    phone: "",
    avatarUrl: "",
    active: true,
  });
  const [newPassword, setNewPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/users", window.location.origin);
      if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());
      if (roleFilter !== "all") url.searchParams.set("role", roleFilter);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);

      const [usersRes, meRes] = await Promise.all([
        fetch(url.toString()),
        fetch("/api/admin/auth/me"),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
        if (data.stats) setStats(data.stats);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user || null);
      }
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to load staff list" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const showToast = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "editor",
      phone: "",
      avatarUrl: "",
      active: true,
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (u: StaffUser) => {
    if (currentUser && (currentUser.userId === u._id || currentUser._id === u._id || currentUser.email === u.email)) {
      showToast("error", "You cannot edit your own account from User Management. Please use My Profile.");
      return;
    }
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      phone: u.phone || "",
      avatarUrl: u.avatarUrl || "",
      active: u.active !== false,
    });
  };

  // Handle Add User Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create staff account");

      showToast("success", `Staff account for ${data.user.name} created successfully`);
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to create user");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Edit User Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (currentUser && (currentUser.userId === editingUser._id || currentUser._id === editingUser._id || currentUser.email === editingUser.email)) {
      showToast("error", "You cannot edit your own account from User Management. Please use My Profile.");
      return;
    }
    setFormSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
        active: formData.active,
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update staff account");

      showToast("success", `Account details for ${data.user.name} updated`);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to update user");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Quick Toggle Active Status
  const handleToggleActive = async (u: StaffUser) => {
    if (currentUser && (currentUser.userId === u._id || currentUser._id === u._id || currentUser.email === u.email)) {
      showToast("error", "You cannot modify your own account status here. Please use My Profile.");
      return;
    }
    const nextState = u.active === false ? true : false;
    try {
      const res = await fetch(`/api/admin/users/${u._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setUsers((prev) =>
        prev.map((item) => (item._id === u._id ? { ...item, active: nextState } : item))
      );
      showToast("success", `${u.name} is now ${nextState ? "Active" : "Deactivated"}`);
      fetchUsers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to toggle status");
    }
  };

  // Quick Password Reset
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetUser) return;
    if (currentUser && (currentUser.userId === passwordResetUser._id || currentUser._id === passwordResetUser._id || currentUser.email === passwordResetUser.email)) {
      showToast("error", "You cannot reset your own password here. Please use My Profile.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters");
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${passwordResetUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      showToast("success", `Password reset successfully for ${passwordResetUser.name}`);
      setPasswordResetUser(null);
      setNewPassword("");
    } catch (err: any) {
      showToast("error", err.message || "Failed to reset password");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    if (currentUser && (currentUser.userId === deletingUser._id || currentUser._id === deletingUser._id || currentUser.email === deletingUser.email)) {
      showToast("error", "You cannot delete your own account.");
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${deletingUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      showToast("success", data.message || "Account removed successfully");
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete user");
    } finally {
      setFormSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card-glass">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Staff & User Management
              </h1>
              <p className="text-xs text-foreground-muted">
                Administer console accounts, permission roles, and active credentials
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-glow-sm transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Staff Member</span>
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
          <span className="text-[11px] font-mono uppercase text-foreground-muted block">
            Total Staff Accounts
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {stats.total}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-foreground-muted block">
              Administrators
            </span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            {stats.admins}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-foreground-muted block">
              Content Editors
            </span>
            <FileEdit className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
            {stats.editors}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-foreground-muted block">
              Active Users
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </form>

        <div className="flex items-center gap-2.5 overflow-x-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="editor">Content Editors</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated Only</option>
          </select>

          <button
            onClick={fetchUsers}
            title="Refresh directory"
            className="p-2.5 rounded-xl bg-surface-secondary hover:bg-surface border border-border text-foreground transition-colors shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-card-glass">
        {loading && users.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-foreground-muted">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-xs font-semibold">Loading staff credentials...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-secondary text-foreground-muted mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-foreground">No staff members found</p>
            <p className="text-xs text-foreground-muted max-w-sm mx-auto">
              No users matched your search criteria. Try modifying your filters or add a new staff member.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/40 text-[11px] font-mono uppercase text-foreground-muted tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Staff Member</th>
                  <th className="py-3.5 px-4">Role & Access</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Activity Log</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {users.map((u) => {
                  const isSelf = Boolean(
                    currentUser && (currentUser.userId === u._id || currentUser.email === u.email)
                  );
                  const isActive = u.active !== false;

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-surface-secondary/30 transition-colors group"
                    >
                      {/* Name & Contact Info */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-10 h-10 rounded-xl object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 font-mono text-xs">
                              {getInitials(u.name)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground text-sm truncate">
                                {u.name}
                              </span>
                              {isSelf && (
                                <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-foreground-muted text-[11px] mt-0.5">
                              <span className="truncate">{u.email}</span>
                              {u.phone && (
                                <>
                                  <span>&bull;</span>
                                  <span className="font-mono">{u.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td className="py-4 px-4">
                        {u.role === "admin" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-[11px]">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Administrator</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold text-[11px]">
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>Content Editor</span>
                          </div>
                        )}
                      </td>

                      {/* Status Toggle / Badge */}
                      <td className="py-4 px-4">
                        {isSelf ? (
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400 select-none cursor-default"
                            title="Active administrative session"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active (You)</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(u)}
                            title="Click to toggle active state"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                              isActive
                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                            } cursor-pointer`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                              }`}
                            />
                            <span>{isActive ? "Active" : "Deactivated"}</span>
                          </button>
                        )}
                      </td>

                      {/* Activity & Joined */}
                      <td className="py-4 px-4 hidden md:table-cell text-foreground-muted text-[11px]">
                        <div>
                          <span className="text-foreground block font-medium">
                            {u.lastLogin
                              ? new Date(u.lastLogin).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Never logged in"}
                          </span>
                          <span className="text-[10px] text-foreground-muted/80">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        {isSelf ? (
                          <Link
                            href="/admin/profile"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-primary hover:text-white border border-border text-foreground text-xs font-semibold transition-all shadow-xs"
                            title="Manage your credentials in My Profile"
                          >
                            <span>My Profile</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              title="Edit details"
                              className="p-1.5 rounded-lg bg-surface-secondary hover:bg-primary hover:text-white text-foreground-muted transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setPasswordResetUser(u);
                                setNewPassword("");
                              }}
                              title="Reset password"
                              className="p-1.5 rounded-lg bg-surface-secondary hover:bg-amber-500 hover:text-white text-foreground-muted transition-colors"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingUser(u)}
                              title="Delete staff account"
                              className="p-1.5 rounded-lg bg-surface-secondary hover:bg-red-500 hover:text-white text-foreground-muted transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD NEW USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Create New Staff Account
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Provision console credentials for printing press staff
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-surface-secondary text-foreground-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Solomon Girma"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="solomon@gtprintingpress.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+251 91 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  Initial Password (Minimum 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create temporary password"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-foreground mb-2">
                  System Role & Privileges *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "editor" })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.role === "editor"
                        ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500"
                        : "bg-surface-secondary border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileEdit className="w-4 h-4" />
                      <span>Content Editor</span>
                    </div>
                    <p className="text-[10px] text-foreground-muted mt-1 leading-snug">
                      Can manage services, portfolio, blog, and view quotes.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.role === "admin"
                        ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500"
                        : "bg-surface-secondary border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Shield className="w-4 h-4" />
                      <span>Administrator</span>
                    </div>
                    <p className="text-[10px] text-foreground-muted mt-1 leading-snug">
                      Full access to settings, user management, and API keys.
                    </p>
                  </button>
                </div>
              </div>

              <SingleImageUploader
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                label="Avatar / Profile Photo (Optional)"
                description="Upload a photo from your computer (JPG, PNG, WebP up to 15MB)."
              />

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-secondary border border-border">
                <div>
                  <span className="font-bold text-foreground block">Account Active</span>
                  <span className="text-[11px] text-foreground-muted">
                    Allow this user to sign into the admin console
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {formSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Edit Staff Profile
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Updating credentials for {editingUser.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-xl bg-surface-secondary text-foreground-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-foreground mb-2">
                  System Role & Privileges
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "editor" })}
                    disabled={Boolean(currentUser?.userId === editingUser._id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.role === "editor"
                        ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500"
                        : "bg-surface-secondary border-border text-foreground"
                    } ${currentUser?.userId === editingUser._id ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileEdit className="w-4 h-4" />
                      <span>Content Editor</span>
                    </div>
                    <p className="text-[10px] text-foreground-muted mt-1 leading-snug">
                      Content, blogs, portfolio, services
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.role === "admin"
                        ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500"
                        : "bg-surface-secondary border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Shield className="w-4 h-4" />
                      <span>Administrator</span>
                    </div>
                    <p className="text-[10px] text-foreground-muted mt-1 leading-snug">
                      Full access to settings & staff
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  Reset Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter new password if changing"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <SingleImageUploader
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                label="Avatar / Profile Photo (Optional)"
                description="Upload a photo from your computer (JPG, PNG, WebP up to 15MB)."
              />

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-secondary border border-border">
                <div>
                  <span className="font-bold text-foreground block">Account Status</span>
                  <span className="text-[11px] text-foreground-muted">
                    {formData.active ? "User can sign in" : "User is blocked from signing in"}
                  </span>
                </div>
                <input
                  type="checkbox"
                  disabled={Boolean(currentUser?.userId === editingUser._id)}
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {formSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PASSWORD RESET MODAL */}
      {passwordResetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Reset Password
                </h3>
                <p className="text-xs text-foreground-muted">
                  For: <span className="font-semibold text-foreground">{passwordResetUser.name}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordResetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  New Password (Minimum 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordResetUser(null);
                    setNewPassword("");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface-secondary text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || newPassword.length < 6}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold disabled:opacity-50"
                >
                  {formSubmitting ? "Updating..." : "Confirm Password Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                Delete Staff Account?
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Are you sure you want to permanently remove{" "}
                <span className="font-semibold text-foreground">{deletingUser.name}</span> ({deletingUser.email})?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-5 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 text-foreground font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={formSubmitting}
                className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs disabled:opacity-50"
              >
                {formSubmitting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
