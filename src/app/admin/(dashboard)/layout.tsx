"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FileEdit,
  FolderKanban,
  MessageSquareQuote,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Printer,
  Shield,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";

interface AdminUser {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Quote Pipeline",
      href: "/admin/quotes",
      icon: Inbox,
      badge: "Live Leads",
    },
    {
      label: "Contact Inquiries",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      label: "Blog CMS",
      href: "/admin/blog",
      icon: FileEdit,
    },
    {
      label: "Portfolio CMS",
      href: "/admin/portfolio",
      icon: FolderKanban,
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
    },
    {
      label: "Site Settings",
      href: "/admin/settings",
      icon: Settings,
      adminOnly: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-surface/90 border-b border-border sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
            <Printer className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight">GT Admin Console</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-surface-secondary text-foreground hover:bg-surface-secondary/80"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 md:w-72 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-glow-sm">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight leading-none text-foreground">
              GT Printing Press
            </h2>
            <p className="text-[11px] text-foreground-muted mt-1 font-mono uppercase tracking-wider">
              Staff CMS &bull; Bole Road
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
            Core Modules
          </div>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            if (item.adminOnly && user && user.role !== "admin") {
              return null;
            }

            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-primary text-white shadow-glow-sm"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-foreground-muted group-hover:text-foreground"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User profile & footer actions */}
        <div className="p-4 border-t border-border space-y-3 bg-surface-secondary/30">
          {/* User badge */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {user?.name || "Authenticating..."}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
                  {user?.role || "staff"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-foreground-muted" />
              <span>View Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
