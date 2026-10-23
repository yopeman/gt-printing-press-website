"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Building,
  Landmark,
  GraduationCap,
  HeartPulse,
  Globe2,
  UtensilsCrossed,
  ShieldCheck,
  Factory,
  Award,
  Sparkles,
} from "lucide-react";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { MediaLinksEditor } from "@/components/admin/media-links-editor";
import { IMediaLink, Locale } from "@/types/database";

interface IndustryItem {
  _id: string;
  slug: string;
  icon: string;
  image?: string;
  galleryUrls?: string[];
  mediaLinks?: IMediaLink[];
  order: number;
  active: boolean;
  translations: {
    en: {
      title: string;
      subtitle: string;
      description: string;
      products: string[];
    };
    am: {
      title: string;
      subtitle: string;
      description: string;
      products: string[];
    };
    om: {
      title: string;
      subtitle: string;
      description: string;
      products: string[];
    };
  };
}

const ICON_OPTIONS = [
  { value: "Landmark", label: "Landmark (Banking & Finance)" },
  { value: "GraduationCap", label: "GraduationCap (Education & Academic)" },
  { value: "HeartPulse", label: "HeartPulse (Medical & Healthcare)" },
  { value: "Globe2", label: "Globe2 (Diplomatic & NGOs)" },
  { value: "Building", label: "Building (Corporate & Telecom)" },
  { value: "UtensilsCrossed", label: "UtensilsCrossed (Hospitality & Retail)" },
  { value: "Factory", label: "Factory (Industrial & Manufacturing)" },
  { value: "ShieldCheck", label: "ShieldCheck (High Security)" },
  { value: "Award", label: "Award (Luxury / Prestige Brands)" },
];

function IndustriesCMSContent() {
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IndustryItem | null>(null);
  const [activeTab, setActiveTab] = useState<Locale>("en");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: "",
    icon: "Building",
    image: "",
    galleryUrls: [] as string[],
    mediaLinks: [] as IMediaLink[],
    order: 0,
    active: true,
    translations: {
      en: {
        title: "",
        subtitle: "",
        description: "",
        productsText: "",
      },
      am: {
        title: "",
        subtitle: "",
        description: "",
        productsText: "",
      },
      om: {
        title: "",
        subtitle: "",
        description: "",
        productsText: "",
      },
    },
  });

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/industries");
      if (res.ok) {
        const data = await res.json();
        setIndustries(data.industries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      slug: "",
      icon: "Building",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      galleryUrls: [],
      mediaLinks: [],
      order: industries.length + 1,
      active: true,
      translations: {
        en: {
          title: "",
          subtitle: "",
          description: "",
          productsText: "Deliverable 1, Deliverable 2, Deliverable 3",
        },
        am: {
          title: "",
          subtitle: "",
          description: "",
          productsText: "",
        },
        om: {
          title: "",
          subtitle: "",
          description: "",
          productsText: "",
        },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (item: IndustryItem) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      icon: item.icon || "Building",
      image: item.image || "",
      galleryUrls: item.galleryUrls || [],
      mediaLinks: item.mediaLinks || [],
      order: item.order || 0,
      active: item.active !== false,
      translations: {
        en: {
          title: item.translations.en?.title || "",
          subtitle: item.translations.en?.subtitle || "",
          description: item.translations.en?.description || "",
          productsText: (item.translations.en?.products || []).join(", "),
        },
        am: {
          title: item.translations.am?.title || "",
          subtitle: item.translations.am?.subtitle || "",
          description: item.translations.am?.description || "",
          productsText: (item.translations.am?.products || []).join(", "),
        },
        om: {
          title: item.translations.om?.title || "",
          subtitle: item.translations.om?.subtitle || "",
          description: item.translations.om?.description || "",
          productsText: (item.translations.om?.products || []).join(", "),
        },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the industry "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/industries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIndustries((prev) => prev.filter((i) => i._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete industry");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during deletion");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.slug.trim()) {
      setErrorMsg("Slug is required");
      return;
    }
    if (!formData.translations.en.title.trim()) {
      setErrorMsg("English title is required");
      return;
    }

    setSaving(true);

    const payload = {
      slug: formData.slug.trim().toLowerCase(),
      icon: formData.icon,
      image: formData.image,
      galleryUrls: formData.galleryUrls,
      mediaLinks: formData.mediaLinks,
      order: Number(formData.order),
      active: formData.active,
      translations: {
        en: {
          title: formData.translations.en.title.trim(),
          subtitle: formData.translations.en.subtitle.trim(),
          description: formData.translations.en.description.trim(),
          products: formData.translations.en.productsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        am: {
          title: formData.translations.am.title.trim() || formData.translations.en.title.trim(),
          subtitle: formData.translations.am.subtitle.trim() || formData.translations.en.subtitle.trim(),
          description: formData.translations.am.description.trim() || formData.translations.en.description.trim(),
          products: formData.translations.am.productsText
            ? formData.translations.am.productsText.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.translations.en.productsText.split(",").map((s) => s.trim()).filter(Boolean),
        },
        om: {
          title: formData.translations.om.title.trim() || formData.translations.en.title.trim(),
          subtitle: formData.translations.om.subtitle.trim() || formData.translations.en.subtitle.trim(),
          description: formData.translations.om.description.trim() || formData.translations.en.description.trim(),
          products: formData.translations.om.productsText
            ? formData.translations.om.productsText.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.translations.en.productsText.split(",").map((s) => s.trim()).filter(Boolean),
        },
      },
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/industries/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchIndustries();
        } else {
          setErrorMsg(data.error || "Failed to update industry");
        }
      } else {
        const res = await fetch("/api/admin/industries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchIndustries();
        } else {
          setErrorMsg(data.error || "Failed to create industry");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const filteredIndustries = industries.filter((ind) => {
    const q = search.toLowerCase();
    const title = ind.translations?.en?.title?.toLowerCase() || "";
    const subtitle = ind.translations?.en?.subtitle?.toLowerCase() || "";
    const slug = ind.slug.toLowerCase();
    return title.includes(q) || subtitle.includes(q) || slug.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Building className="w-6 h-6 text-primary" />
            <span>Target Industries CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Manage customized sector solutions, specialized deliverables, and corporate client references.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchIndustries}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            title="Refresh Industries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Industry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by title, clients, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="text-xs text-foreground-muted self-end sm:self-center font-mono">
          Showing <strong>{filteredIndustries.length}</strong> industries
        </div>
      </div>

      {/* Industries Cards */}
      {loading ? (
        <div className="py-20 text-center text-foreground-muted flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs font-medium">Loading target industries...</span>
        </div>
      ) : filteredIndustries.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-surface border border-border border-dashed p-8 space-y-3">
          <Building className="w-10 h-10 text-foreground-muted mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-foreground">No industries found</h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            {search ? "No industries matched your search." : "Add your first sector profile."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndustries.map((ind, idx) => (
            <div
              key={ind._id}
              className="rounded-2xl bg-surface border border-border overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition-all shadow-sm"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold font-mono">
                    {ind.icon}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-secondary text-[10px] font-mono font-bold text-foreground-muted border border-border">
                    0{ind.order || idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                    {ind.translations?.en?.title}
                  </h3>
                  <span className="text-xs text-primary font-medium block mt-0.5">
                    {ind.translations?.en?.subtitle}
                  </span>
                  <p className="text-xs text-foreground-muted line-clamp-3 leading-relaxed mt-2">
                    {ind.translations?.en?.description}
                  </p>
                </div>

                {/* Products pills */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block mb-1.5 font-mono">
                    Deliverables:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(ind.translations?.en?.products || []).slice(0, 3).map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded-md bg-surface-secondary text-[10px] text-foreground font-medium border border-border"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {ind.mediaLinks && ind.mediaLinks.length > 0 && (
                  <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>{ind.mediaLinks.length} media / file link(s)</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
                <a
                  href="/en/industries"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-foreground-muted hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(ind)}
                    className="p-1.5 rounded-lg bg-surface border border-border text-foreground hover:text-primary hover:border-primary transition-colors"
                    title="Edit Industry"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ind._id, ind.translations?.en?.title)}
                    className="p-1.5 rounded-lg bg-surface border border-border text-foreground-muted hover:text-red-500 hover:border-red-500/30 transition-colors"
                    title="Delete Industry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {editingItem ? "Edit Industry Sector" : "Add Industry Sector"}
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    Configure specialized products, deliverables, and multi-language sector copy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* General Technical Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    URL Identifier / Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. banking-finance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Icon Representation
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {ICON_OPTIONS.map((ico) => (
                      <option key={ico.value} value={ico.value}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-3 pt-2">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider mr-2 font-mono">
                  Translate:
                </span>
                {(["en", "am", "om"] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setActiveTab(loc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      activeTab === loc
                        ? "bg-primary text-white shadow-glow-sm"
                        : "bg-surface-secondary text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    {loc === "en" ? "English" : loc === "am" ? "አማርኛ" : "Afaan Oromoo"}
                  </button>
                ))}
              </div>

              {/* Translation Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Industry Sector Title ({activeTab.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required={activeTab === "en"}
                    value={formData.translations[activeTab].title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [activeTab]: { ...formData.translations[activeTab], title: e.target.value },
                        },
                      })
                    }
                    placeholder="e.g. Banking & Financial Institutions"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Client Subtitle / Key Partners ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formData.translations[activeTab].subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [activeTab]: { ...formData.translations[activeTab], subtitle: e.target.value },
                        },
                      })
                    }
                    placeholder="e.g. Awash Bank, Oromia Bank, Commercial Cooperatives"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Sector Overview & Scope ({activeTab.toUpperCase()}) *
                  </label>
                  <textarea
                    rows={3}
                    required={activeTab === "en"}
                    value={formData.translations[activeTab].description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [activeTab]: { ...formData.translations[activeTab], description: e.target.value },
                        },
                      })
                    }
                    placeholder="Describe specific security features, requirements, and compliance standards..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Specialized Deliverables (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.translations[activeTab].productsText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [activeTab]: { ...formData.translations[activeTab], productsText: e.target.value },
                        },
                      })
                    }
                    placeholder="e.g. Annual reports & statements, 3D illuminated letters, Anti-copy vouchers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                  />
                  <span>Active & Visible in Industries List</span>
                </label>
              </div>

              {/* Image & Visual Assets */}
              <div className="pt-4 border-t border-border space-y-4">
                <MultiImageUploader
                  label="Industry Photographs & Sector Imagery"
                  description="Upload representative industry photography or paste image URLs."
                  images={
                    formData.image
                      ? [formData.image, ...formData.galleryUrls.filter((u) => u !== formData.image)]
                      : formData.galleryUrls
                  }
                  coverImage={formData.image}
                  onSetCover={(url) => setFormData({ ...formData, image: url })}
                  onChange={(images) => {
                    const cover = images[0] || formData.image;
                    setFormData({
                      ...formData,
                      image: cover,
                      galleryUrls: images,
                    });
                  }}
                />
              </div>

              {/* File Link Management */}
              <div className="pt-4 border-t border-border space-y-4">
                <MediaLinksEditor
                  label="Sector Case Studies & Media Links"
                  description="Link video project case studies (YouTube, Vimeo), sector brochure PDF downloads, or external links."
                  links={formData.mediaLinks}
                  onChange={(links) => setFormData({ ...formData, mediaLinks: links })}
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-surface-secondary/50 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingItem ? "Update Industry" : "Save Industry"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IndustriesCMSPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-foreground-muted">Loading CMS...</div>}>
      <IndustriesCMSContent />
    </Suspense>
  );
}
