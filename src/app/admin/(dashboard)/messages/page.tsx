"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  Send,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  X,
  Clock,
  Trash2,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { type ContactMessageStatus } from "@/types/database";

function MessagesPageContent() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [internalNotes, setInternalNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/messages", window.location.origin);
      if (selectedStatus !== "all") url.searchParams.set("status", selectedStatus);
      if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setStats(data.stats || { total: 0, new: 0, read: 0, replied: 0, archived: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMessages();
  };

  const updateStatus = async (messageId: string, newStatus: ContactMessageStatus) => {
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: internalNotes }),
      });
      if (res.ok) {
        setSelectedMessage({ ...selectedMessage, notes: internalNotes });
        setMessages((prev) =>
          prev.map((m) => (m._id === selectedMessage._id ? { ...m, notes: internalNotes } : m))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to permanently delete this contact inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDrawer = (message: any) => {
    setSelectedMessage(message);
    setInternalNotes(message.notes || "");
    // Automatically mark as read if it's new
    if (message.status === "New") {
      updateStatus(message._id, "Read");
    }
  };

  const cleanPhoneForTelegram = (phone: string) => {
    const clean = phone.replace(/[\s-]/g, "");
    return clean.startsWith("+")
      ? clean.slice(1)
      : clean.startsWith("0")
      ? `251${clean.slice(1)}`
      : clean;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-primary" />
            <span>Contact Form Inquiries</span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            General communications, corporate inquiries, and Telegram dispatch audit log.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Received", count: stats.total, color: "text-foreground" },
          { label: "New (Unread)", count: stats.new, color: "text-primary" },
          { label: "In Review (Read)", count: stats.read, color: "text-sky-500" },
          { label: "Replied", count: stats.replied, color: "text-emerald-500" },
          { label: "Archived", count: stats.archived, color: "text-foreground-muted" },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-surface border border-border shadow-sm">
            <span className="text-[11px] font-semibold text-foreground-muted block">{item.label}</span>
            <span className={`text-xl font-extrabold ${item.color}`}>{item.count}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference (#GT-MSG-...), client name, phone, subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
          />
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface border border-border shadow-sm">
          {["all", "New", "Read", "Replied", "Archived"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedStatus === st
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-foreground-muted mt-2">Loading contact inquiries...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-surface border border-border p-8 space-y-3">
          <MessageSquare className="w-10 h-10 text-foreground-muted/40 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No inquiries found</h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            {searchQuery
              ? `No messages matched "${searchQuery}". Try a different keyword.`
              : "No contact submissions have been recorded in this category yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-card-glass">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50 font-semibold text-foreground-muted">
                <th className="p-3.5 pl-4">Reference</th>
                <th className="p-3.5">Client & Contact</th>
                <th className="p-3.5">Subject & Message Excerpt</th>
                <th className="p-3.5">Language</th>
                <th className="p-3.5">Telegram</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {messages.map((m) => {
                const submittedDate = new Date(m.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const isNew = m.status === "New";

                return (
                  <tr
                    key={m._id}
                    onClick={() => openDrawer(m)}
                    className={`cursor-pointer hover:bg-surface-secondary/70 transition-colors ${
                      isNew ? "bg-primary/5 font-medium" : ""
                    }`}
                  >
                    <td className="p-3.5 pl-4 font-mono font-bold text-primary whitespace-nowrap">
                      #{m.reference}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-foreground">{m.name}</div>
                      <div className="text-[11px] text-foreground-muted font-mono">{m.phone}</div>
                      {m.email && <div className="text-[11px] text-foreground-muted truncate max-w-[150px]">{m.email}</div>}
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-foreground truncate">{m.subject}</div>
                      <div className="text-[11px] text-foreground-muted truncate">{m.message}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-surface-secondary border border-border text-[10px] font-bold uppercase">
                        {m.locale || "EN"}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {m.telegramDeliveryStatus === "sent" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sent</span>
                        </span>
                      ) : m.telegramDeliveryStatus === "failed" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-500 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Failed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={m.status}
                        onChange={(e) => updateStatus(m._id, e.target.value as ContactMessageStatus)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          m.status === "New"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : m.status === "Replied"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : m.status === "Read"
                            ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                            : "bg-surface-secondary text-foreground-muted border-border"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-foreground-muted text-[11px] whitespace-nowrap">
                      {submittedDate}
                    </td>

                    <td className="p-3.5 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://t.me/+${cleanPhoneForTelegram(m.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors"
                          title="Chat on Telegram"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(m._id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-foreground-muted hover:text-red-500 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Detail Modal / Drawer */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-card-glass overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-base sm:text-lg flex items-center gap-2">
                    <span>Inquiry Reference #{selectedMessage.reference}</span>
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Received {new Date(selectedMessage.createdAt).toLocaleString()} (EAT)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl hover:bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Client Info Grid */}
              <div className="p-4 rounded-2xl bg-surface-secondary border border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-foreground-muted block">Client Name</span>
                  <span className="font-bold text-foreground text-sm">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block">Phone Number</span>
                  <span className="font-mono font-bold text-foreground">{selectedMessage.phone}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block">Email Address</span>
                  <span className="font-medium text-foreground">{selectedMessage.email || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block">Status</span>
                  <span className="font-bold text-primary">{selectedMessage.status}</span>
                </div>
              </div>

              {/* Subject & Full Message */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider font-mono">
                  Subject: {selectedMessage.subject}
                </span>
                <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-border text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* 1-Tap Quick Actions */}
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={`https://t.me/+${cleanPhoneForTelegram(selectedMessage.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center gap-2 hover:bg-sky-600 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Chat on Telegram</span>
                </a>

                <a
                  href={`tel:${selectedMessage.phone}`}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground font-bold text-xs flex items-center gap-2 hover:bg-surface-secondary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Call {selectedMessage.phone}</span>
                </a>

                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground font-bold text-xs flex items-center gap-2 hover:bg-surface-secondary transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>Send Email</span>
                  </a>
                )}
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-primary" />
                  <span>Internal Staff Notes</span>
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record follow-up calls, assigned sales engineer, quotation notes..."
                  className="w-full p-3 rounded-xl bg-surface-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {savingNotes ? "Saving Notes..." : "Save Internal Notes"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-surface-secondary/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteMessage(selectedMessage._id)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        </div>
      }
    >
      <MessagesPageContent />
    </Suspense>
  );
}
