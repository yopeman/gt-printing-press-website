"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
  ArrowRight,
  FileEdit,
  FolderKanban,
  Sparkles,
  PhoneCall,
  Send,
  RefreshCw,
} from "lucide-react";

interface QuoteStats {
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  won: number;
  lost: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<QuoteStats>({
    total: 0,
    new: 0,
    contacted: 0,
    quoted: 0,
    won: 0,
    lost: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/quotes");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentQuotes(data.quotes.slice(0, 6));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const winRate = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Production & Lead Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Real-time commercial quote inquiries, pipeline conversion, and content operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/api/admin/quotes/export"
            download
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card-glass space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-foreground">
            {stats.total}
          </div>
          <p className="text-[11px] text-foreground-muted">All-time commercial inquiries</p>
        </div>

        {/* New Leads */}
        <div className="p-6 rounded-2xl bg-surface border border-amber-500/30 shadow-card-glass space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Action Needed
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-amber-500">
            {stats.new}
          </div>
          <p className="text-[11px] text-foreground-muted">Awaiting initial phone/telegram response</p>
        </div>

        {/* Quoted in Progress */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card-glass space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
              Under Review / Quoted
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-foreground">
            {stats.quoted + stats.contacted}
          </div>
          <p className="text-[11px] text-foreground-muted">{stats.quoted} pricing issued &bull; {stats.contacted} contacted</p>
        </div>

        {/* Deals Won */}
        <div className="p-6 rounded-2xl bg-surface border border-emerald-500/20 shadow-card-glass space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Jobs Won ({winRate}%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-extrabold text-emerald-500">
            {stats.won}
          </div>
          <p className="text-[11px] text-foreground-muted">Contracts advanced to production</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/quotes"
          className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:bg-surface-secondary/70 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Manage Pipeline</h3>
              <p className="text-xs text-foreground-muted">Update inquiry status & notes</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/blog"
          className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:bg-surface-secondary/70 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Publish Blog Post</h3>
              <p className="text-xs text-foreground-muted">Trilingual editorial guides</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/portfolio"
          className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:bg-surface-secondary/70 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Portfolio Showcase</h3>
              <p className="text-xs text-foreground-muted">Add recent print project</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Inquiries List */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Recent Lead Submissions
            </h2>
            <p className="text-xs text-foreground-muted">
              Most recent quote inquiries received through the website and Telegram pipeline.
            </p>
          </div>
          <Link
            href="/admin/quotes"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Quotes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="py-12 text-center text-foreground-muted text-sm space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-foreground-muted/40" />
            <p>No quote inquiries recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-foreground-muted uppercase font-mono text-[11px]">
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentQuotes.map((q) => {
                  const statusColors: Record<string, string> = {
                    New: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    Contacted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    Quoted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
                    Won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    Lost: "bg-red-500/10 text-red-500 border-red-500/20",
                  };

                  return (
                    <tr key={q._id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-primary">
                        #{q.reference}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-foreground">{q.name}</div>
                        {q.company && (
                          <div className="text-[11px] text-foreground-muted">{q.company}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-foreground-muted capitalize">
                        {q.serviceType?.replace(/-/g, " ")}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <a
                          href={`tel:${q.phone}`}
                          className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <PhoneCall className="w-3 h-3 text-foreground-muted" />
                          <span>{q.phone}</span>
                        </a>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${
                            statusColors[q.status] || "bg-surface-secondary text-foreground"
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-foreground-muted text-xs">
                        {new Date(q.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/quotes?ref=${q.reference}`}
                          className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-primary hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
