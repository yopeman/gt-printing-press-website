"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Inbox,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Send,
  Calendar,
  Layers,
  FileCheck,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  X,
  MessageSquare,
  Clock,
  Sparkles,
} from "lucide-react";

type QuoteStatus = "New" | "Contacted" | "Quoted" | "Won" | "Lost";

function QuotesPageContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref");

  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(initialRef || "");
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [internalNotes, setInternalNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    quoted: 0,
    won: 0,
    lost: 0,
  });

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/quotes", window.location.origin);
      if (selectedStatus !== "all") url.searchParams.set("status", selectedStatus);
      if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes);
        setStats(data.stats);

        // Auto-select if ref was in URL
        if (initialRef && !selectedQuote) {
          const match = data.quotes.find((q: any) => q.reference === initialRef);
          if (match) {
            setSelectedQuote(match);
            setInternalNotes(match.notes || match.internalNotes || "");
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes();
  };

  const updateStatus = async (quoteId: string, newStatus: QuoteStatus) => {
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuotes((prev) =>
          prev.map((q) => (q._id === quoteId ? { ...q, status: newStatus } : q))
        );
        if (selectedQuote && selectedQuote._id === quoteId) {
          setSelectedQuote((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuote) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${selectedQuote._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes }),
      });
      if (res.ok) {
        setSelectedQuote((prev: any) => ({ ...prev, internalNotes }));
        setQuotes((prev) =>
          prev.map((q) => (q._id === selectedQuote._id ? { ...q, internalNotes } : q))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const statusColors: Record<QuoteStatus, string> = {
    New: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Contacted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Quoted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Lost: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Quote Pipeline & Leads
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Track customer inquiries from initial submission to contract execution.
          </p>
        </div>

        <a
          href="/api/admin/quotes/export"
          download
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Leads (CSV)</span>
        </a>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Leads", count: stats.total },
            { id: "New", label: "New", count: stats.new },
            { id: "Contacted", label: "Contacted", count: stats.contacted },
            { id: "Quoted", label: "Quoted", count: stats.quoted },
            { id: "Won", label: "Won", count: stats.won },
            { id: "Lost", label: "Lost", count: stats.lost },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedStatus === tab.id
                  ? "bg-primary text-white shadow-glow-sm"
                  : "bg-surface hover:bg-surface-secondary text-foreground-muted border border-border"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  selectedStatus === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-surface-secondary text-foreground-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, ref..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface border border-border text-foreground text-xs placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-xs font-semibold transition-colors"
          >
            Find
          </button>
        </form>
      </div>

      {/* Main Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-foreground-muted mt-2">Loading pipeline inquiries...</p>
          </div>
        ) : quotes.length === 0 ? (
          <div className="py-16 text-center text-foreground-muted text-sm space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-foreground-muted/40" />
            <p className="font-semibold text-foreground">No leads found</p>
            <p className="text-xs">Try selecting another filter or clearing your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-foreground-muted uppercase font-mono text-[11px]">
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Volume</th>
                  <th className="py-3 px-3">Telegram</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes.map((q) => (
                  <tr
                    key={q._id}
                    className={`hover:bg-surface-secondary/40 transition-colors cursor-pointer ${
                      selectedQuote?._id === q._id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setSelectedQuote(q);
                      setInternalNotes(q.notes || q.internalNotes || "");
                    }}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      #{q.reference}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{q.name}</div>
                      {q.company && (
                        <div className="text-[11px] text-foreground-muted">{q.company}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-xs">{q.phone}</div>
                      {q.email && (
                        <div className="text-[11px] text-foreground-muted truncate max-w-[140px]">
                          {q.email}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-foreground-muted capitalize">
                      {q.serviceType?.replace(/-/g, " ")}
                    </td>
                    <td className="py-3 px-3 text-xs font-mono">
                      {q.quantity || "N/A"}
                    </td>
                    <td className="py-3 px-3">
                      {q.telegramDeliveryStatus === "sent" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Sent</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-foreground-muted">
                          <Clock className="w-3 h-3" />
                          <span>Local</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={q.status}
                        onChange={(e) => updateStatus(q._id, e.target.value as QuoteStatus)}
                        className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          statusColors[q.status as QuoteStatus] || "bg-surface text-foreground"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(q);
                          setInternalNotes(q.notes || q.internalNotes || "");
                        }}
                        className="px-3 py-1 rounded-lg bg-surface-secondary hover:bg-primary hover:text-white text-xs font-semibold transition-all"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Detail Drawer / Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] bg-surface border border-border rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono font-black text-primary">
                  #{selectedQuote.reference}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${
                    statusColors[selectedQuote.status as QuoteStatus]
                  }`}
                >
                  {selectedQuote.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Quick Communication CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedQuote.phone}`}
                  className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-3 text-xs font-bold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: {selectedQuote.phone}</span>
                </a>
                <a
                  href={`https://t.me/+251${selectedQuote.phone?.replace(/^(\+251|0)/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors flex items-center gap-3 text-xs font-bold"
                >
                  <Send className="w-4 h-4" />
                  <span>Chat on Telegram</span>
                </a>
              </div>

              {/* Client & Service Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-secondary/50 border border-border text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">Client Name</span>
                  <span className="font-bold text-foreground text-sm">{selectedQuote.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">Company</span>
                  <span className="font-bold text-foreground text-sm">{selectedQuote.company || "Individual Client"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">Service Requested</span>
                  <span className="font-bold text-foreground capitalize">{selectedQuote.serviceType?.replace(/-/g, " ")}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">Volume / Quantity</span>
                  <span className="font-bold text-foreground">{selectedQuote.quantity || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">Needed By Timeline</span>
                  <span className="font-bold text-foreground">{selectedQuote.neededBy || "Standard"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">Artwork Status</span>
                  <span className="font-bold text-foreground capitalize">{selectedQuote.artworkStatus || "Ready"}</span>
                </div>
              </div>

              {/* Technical Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                  Job Specifications & Details
                </span>
                <div className="p-4 rounded-2xl bg-surface-secondary/40 border border-border text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedQuote.specification || "No detailed notes provided."}
                </div>
              </div>

              {/* Attachments & External Links */}
              {(() => {
                const externalUrl =
                  selectedQuote.externalFileUrl ||
                  (selectedQuote.notes?.startsWith("External File Share: ")
                    ? selectedQuote.notes.replace("External File Share: ", "").trim()
                    : null);
                const hasAttachments = selectedQuote.attachments && selectedQuote.attachments.length > 0;

                if (!externalUrl && !hasAttachments) return null;

                return (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                      Supplied Artwork & Links
                    </span>
                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-surface-secondary border border-border hover:border-primary/40 text-xs font-semibold text-primary flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <LinkIcon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{externalUrl}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 shrink-0" />
                      </a>
                    )}
                    {selectedQuote.attachments?.map((att: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-surface-secondary border border-border text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0 mr-2">
                          <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">{att.fileName}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-foreground-muted">
                            {(att.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          {att.fileUrl && (
                            <a
                              href={att.fileUrl}
                              download={att.fileName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Internal Notes / Sales Staff Log */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-primary" />
                    Internal Staff Notes
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {savingNotes ? "Saving..." : "Save Note"}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record quote pricing sent (e.g. 45,000 ETB for 2,000 booklets, 150gsm art paper), sales follow-up dates, or customer preferences..."
                  className="w-full p-3.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminQuotesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        </div>
      }
    >
      <QuotesPageContent />
    </Suspense>
  );
}
