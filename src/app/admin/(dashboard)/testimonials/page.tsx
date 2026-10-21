"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  MessageSquareQuote,
  Plus,
  Edit,
  Trash2,
  Star,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Building,
} from "lucide-react";

interface TestimonialItem {
  _id: string;
  clientName: string;
  role: string;
  company: string;
  avatarUrl: string;
  order: number;
  published: boolean;
  translations: {
    en: { quote: string };
    am: { quote: string };
    om: { quote: string };
  };
}

function TestimonialsContent() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "am" | "om">("en");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientName: "",
    role: "",
    company: "",
    avatarUrl: "",
    order: 0,
    published: true,
    translations: {
      en: { quote: "" },
      am: { quote: "" },
      om: { quote: "" },
    },
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      clientName: "",
      role: "",
      company: "",
      avatarUrl: "",
      order: testimonials.length,
      published: true,
      translations: {
        en: { quote: "" },
        am: { quote: "" },
        om: { quote: "" },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName,
      role: item.role,
      company: item.company,
      avatarUrl: item.avatarUrl || "",
      order: item.order,
      published: item.published,
      translations: {
        en: { quote: item.translations?.en?.quote || "" },
        am: { quote: item.translations?.am?.quote || "" },
        om: { quote: item.translations?.om?.quote || "" },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.clientName.trim() || !formData.company.trim() || !formData.translations.en.quote.trim()) {
      setErrorMsg("Client name, company, and English quote are required");
      return;
    }

    setSaving(true);
    try {
      const endpoint = editingItem
        ? `/api/admin/testimonials/${editingItem._id}`
        : "/api/admin/testimonials";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save testimonial");
      }

      setModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Client Testimonials CMS
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Endorsements from corporate banks, airlines, and humanitarian agencies in 3 languages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTestimonials}
            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-foreground-muted mt-2">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full py-16 text-center text-foreground-muted text-sm space-y-2">
            <MessageSquareQuote className="w-10 h-10 mx-auto text-foreground-muted/40" />
            <p className="font-semibold text-foreground">No testimonials found</p>
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t._id}
              className="p-6 rounded-2xl bg-surface border border-border shadow-card-glass space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      t.published
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-surface-secondary text-foreground-muted"
                    }`}
                  >
                    {t.published ? "Live" : "Draft"}
                  </span>
                </div>

                <p className="text-xs text-foreground-muted italic leading-relaxed line-clamp-4">
                  "{t.translations?.en?.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{t.clientName}</h4>
                  <p className="text-[11px] text-foreground-muted">{t.company}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-lg bg-surface-secondary hover:bg-primary hover:text-white text-foreground-muted transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 rounded-lg bg-surface-secondary hover:bg-red-500 hover:text-white text-foreground-muted transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[92vh] bg-surface border border-border rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
              <h3 className="text-lg font-bold text-foreground">
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-surface-secondary text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 flex-1">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Yohannes Bekele"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Brand & Marketing Director"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Commercial Banking Institution"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex items-center gap-4 pt-5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publishedTest"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="publishedTest" className="text-xs font-semibold text-foreground cursor-pointer">
                      Published on Site
                    </label>
                  </div>
                </div>
              </div>

              {/* Trilingual Tabs */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                    Quote Feedback ({activeTab.toUpperCase()})
                  </label>
                  <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => setActiveTab("en")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "en" ? "bg-primary text-white shadow-xs" : "text-foreground-muted"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("am")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "am" ? "bg-primary text-white shadow-xs" : "text-foreground-muted"
                      }`}
                    >
                      አማርኛ
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("om")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "om" ? "bg-primary text-white shadow-xs" : "text-foreground-muted"
                      }`}
                    >
                      Afaan Oromoo
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  required
                  value={formData.translations[activeTab].quote}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      translations: {
                        ...formData.translations,
                        [activeTab]: { quote: e.target.value },
                      },
                    })
                  }
                  placeholder={`Enter testimonial statement in ${activeTab.toUpperCase()}...`}
                  className="w-full p-3.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingItem ? "Update Testimonial" : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        </div>
      }
    >
      <TestimonialsContent />
    </Suspense>
  );
}
