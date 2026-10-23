"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Printer,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
  Eye,
  Sliders,
} from "lucide-react";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { MediaLinksEditor } from "@/components/admin/media-links-editor";
import { IMediaLink, Locale } from "@/types/database";

interface ServiceItem {
  _id: string;
  slug: string;
  glyph: string;
  coverImage: string;
  galleryUrls: string[];
  equipmentUsed: string[];
  mediaLinks?: IMediaLink[];
  order: number;
  featured: boolean;
  active: boolean;
  translations: {
    en: {
      title: string;
      shortDesc: string;
      fullDesc: string;
      typicalProducts: string[];
      finishesAndMaterials: string[];
      turnaroundTime: string;
    };
    am: {
      title: string;
      shortDesc: string;
      fullDesc: string;
      typicalProducts: string[];
      finishesAndMaterials: string[];
      turnaroundTime: string;
    };
    om: {
      title: string;
      shortDesc: string;
      fullDesc: string;
      typicalProducts: string[];
      finishesAndMaterials: string[];
      turnaroundTime: string;
    };
  };
}

const GLYPH_OPTIONS = [
  { value: "offset-roller", label: "Offset Roller (Presses)" },
  { value: "uv-flatbed", label: "UV Flatbed (Direct Print)" },
  { value: "laser-beam", label: "Laser Beam (Cutting/Etch)" },
  { value: "cnc-router", label: "CNC Router (3D Signage)" },
  { value: "guillotine-blade", label: "Guillotine (Trimming)" },
  { value: "foil-emboss", label: "Foil & Emboss (Luxury)" },
  { value: "thermal-laminate", label: "Thermal Laminate (Finishing)" },
  { value: "saddle-stitch", label: "Saddle Stitch (Book Binding)" },
];

function ServicesCMSContent() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [activeTab, setActiveTab] = useState<Locale>("en");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: "",
    glyph: "offset-roller",
    coverImage: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
    galleryUrls: [] as string[],
    equipmentUsed: "" as string, // comma-separated in form
    mediaLinks: [] as IMediaLink[],
    order: 0,
    featured: true,
    active: true,
    translations: {
      en: {
        title: "",
        shortDesc: "",
        fullDesc: "",
        typicalProducts: "",
        finishesAndMaterials: "",
        turnaroundTime: "2–4 working days",
      },
      am: {
        title: "",
        shortDesc: "",
        fullDesc: "",
        typicalProducts: "",
        finishesAndMaterials: "",
        turnaroundTime: "",
      },
      om: {
        title: "",
        shortDesc: "",
        fullDesc: "",
        typicalProducts: "",
        finishesAndMaterials: "",
        turnaroundTime: "",
      },
    },
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      slug: "",
      glyph: "offset-roller",
      coverImage: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
      galleryUrls: [],
      equipmentUsed: "Heidelberg Speedmaster, Polar Mohr Guillotine",
      mediaLinks: [],
      order: services.length + 1,
      featured: true,
      active: true,
      translations: {
        en: {
          title: "",
          shortDesc: "",
          fullDesc: "",
          typicalProducts: "Corporate Brochures, Annual Reports, Flyers",
          finishesAndMaterials: "Art Paper 150-350gsm, Matte Lamination, Spot UV",
          turnaroundTime: "2–4 working days",
        },
        am: {
          title: "",
          shortDesc: "",
          fullDesc: "",
          typicalProducts: "",
          finishesAndMaterials: "",
          turnaroundTime: "",
        },
        om: {
          title: "",
          shortDesc: "",
          fullDesc: "",
          typicalProducts: "",
          finishesAndMaterials: "",
          turnaroundTime: "",
        },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      glyph: service.glyph || "offset-roller",
      coverImage: service.coverImage || "",
      galleryUrls: service.galleryUrls || [],
      equipmentUsed: (service.equipmentUsed || []).join(", "),
      mediaLinks: service.mediaLinks || [],
      order: service.order || 0,
      featured: Boolean(service.featured),
      active: service.active !== false,
      translations: {
        en: {
          title: service.translations.en?.title || "",
          shortDesc: service.translations.en?.shortDesc || "",
          fullDesc: service.translations.en?.fullDesc || "",
          typicalProducts: (service.translations.en?.typicalProducts || []).join(", "),
          finishesAndMaterials: (service.translations.en?.finishesAndMaterials || []).join(", "),
          turnaroundTime: service.translations.en?.turnaroundTime || "",
        },
        am: {
          title: service.translations.am?.title || "",
          shortDesc: service.translations.am?.shortDesc || "",
          fullDesc: service.translations.am?.fullDesc || "",
          typicalProducts: (service.translations.am?.typicalProducts || []).join(", "),
          finishesAndMaterials: (service.translations.am?.finishesAndMaterials || []).join(", "),
          turnaroundTime: service.translations.am?.turnaroundTime || "",
        },
        om: {
          title: service.translations.om?.title || "",
          shortDesc: service.translations.om?.shortDesc || "",
          fullDesc: service.translations.om?.fullDesc || "",
          typicalProducts: (service.translations.om?.typicalProducts || []).join(", "),
          finishesAndMaterials: (service.translations.om?.finishesAndMaterials || []).join(", "),
          turnaroundTime: service.translations.om?.turnaroundTime || "",
        },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the service "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setServices((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete service");
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
      setErrorMsg("URL slug is required");
      return;
    }
    if (!formData.translations.en.title.trim()) {
      setErrorMsg("English title is required");
      return;
    }

    setSaving(true);

    const payload = {
      slug: formData.slug.trim().toLowerCase(),
      glyph: formData.glyph,
      coverImage: formData.coverImage,
      galleryUrls: formData.galleryUrls,
      equipmentUsed: formData.equipmentUsed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      mediaLinks: formData.mediaLinks,
      order: Number(formData.order),
      featured: formData.featured,
      active: formData.active,
      translations: {
        en: {
          title: formData.translations.en.title.trim(),
          shortDesc: formData.translations.en.shortDesc.trim(),
          fullDesc: formData.translations.en.fullDesc.trim(),
          typicalProducts: formData.translations.en.typicalProducts
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          finishesAndMaterials: formData.translations.en.finishesAndMaterials
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          turnaroundTime: formData.translations.en.turnaroundTime.trim(),
        },
        am: {
          title: formData.translations.am.title.trim() || formData.translations.en.title.trim(),
          shortDesc: formData.translations.am.shortDesc.trim() || formData.translations.en.shortDesc.trim(),
          fullDesc: formData.translations.am.fullDesc.trim() || formData.translations.en.fullDesc.trim(),
          typicalProducts: formData.translations.am.typicalProducts
            ? formData.translations.am.typicalProducts.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.translations.en.typicalProducts.split(",").map((s) => s.trim()).filter(Boolean),
          finishesAndMaterials: formData.translations.am.finishesAndMaterials
            ? formData.translations.am.finishesAndMaterials.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.translations.en.finishesAndMaterials.split(",").map((s) => s.trim()).filter(Boolean),
          turnaroundTime: formData.translations.am.turnaroundTime.trim() || formData.translations.en.turnaroundTime.trim(),
        },
        om: {
          title: formData.translations.om.title.trim() || formData.translations.en.title.trim(),
          shortDesc: formData.translations.om.shortDesc.trim() || formData.translations.en.shortDesc.trim(),
          fullDesc: formData.translations.om.fullDesc.trim() || formData.translations.en.fullDesc.trim(),
          typicalProducts: formData.translations.om.typicalProducts
            ? formData.translations.om.typicalProducts.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.translations.en.typicalProducts.split(",").map((s) => s.trim()).filter(Boolean),
          finishesAndMaterials: formData.translations.om.finishesAndMaterials
            ? formData.translations.om.finishesAndMaterials.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.translations.en.finishesAndMaterials.split(",").map((s) => s.trim()).filter(Boolean),
          turnaroundTime: formData.translations.om.turnaroundTime.trim() || formData.translations.en.turnaroundTime.trim(),
        },
      },
    };

    try {
      if (editingService) {
        const res = await fetch(`/api/admin/services/${editingService._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchServices();
        } else {
          setErrorMsg(data.error || "Failed to update service");
        }
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchServices();
        } else {
          setErrorMsg(data.error || "Failed to create service");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const q = search.toLowerCase();
    const titleEn = s.translations?.en?.title?.toLowerCase() || "";
    const slug = s.slug.toLowerCase();
    return titleEn.includes(q) || slug.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Printer className="w-6 h-6 text-primary" />
            <span>Manufacturing Services CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Manage public production lines, turnaround times, technical specifications, gallery media, and file links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchServices}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            title="Refresh Services"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="text-xs text-foreground-muted self-end sm:self-center font-mono">
          Showing <strong>{filteredServices.length}</strong> services
        </div>
      </div>

      {/* Services List / Cards */}
      {loading ? (
        <div className="py-20 text-center text-foreground-muted flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs font-medium">Loading database services...</span>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-surface border border-border border-dashed p-8 space-y-3">
          <Printer className="w-10 h-10 text-foreground-muted mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-foreground">No services found</h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            {search ? "No matching services match your search term." : "Start by adding your first production service division."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv, idx) => (
            <div
              key={srv._id}
              className="rounded-2xl bg-surface border border-border overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition-all shadow-sm"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-surface-secondary overflow-hidden">
                  <img
                    src={srv.coverImage}
                    alt={srv.translations?.en?.title || srv.slug}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-mono font-bold text-foreground border border-border">
                      0{srv.order || idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-mono uppercase font-bold">
                      {srv.glyph}
                    </span>
                  </div>
                  {srv.active === false && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-bold">
                        Draft / Inactive
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                    {srv.translations?.en?.title || srv.slug}
                  </h3>
                  <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                    {srv.translations?.en?.shortDesc}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-foreground-muted">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{srv.translations?.en?.turnaroundTime || "2–4 working days"}</span>
                  </div>

                  {srv.mediaLinks && srv.mediaLinks.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>{srv.mediaLinks.length} media / file link(s) configured</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
                <a
                  href={`/en/services/${srv.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-foreground-muted hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="p-1.5 rounded-lg bg-surface border border-border text-foreground hover:text-primary hover:border-primary transition-colors"
                    title="Edit Service"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv._id, srv.translations?.en?.title || srv.slug)}
                    className="p-1.5 rounded-lg bg-surface border border-border text-foreground-muted hover:text-red-500 hover:border-red-500/30 transition-colors"
                    title="Delete Service"
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
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {editingService ? "Edit Manufacturing Service" : "Add New Manufacturing Service"}
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    Configure multi-language metadata, gallery images, and external media links.
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

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-3">
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
                    {loc === "en" ? "English" : loc === "am" ? "አማርኛ (Amharic)" : "Afaan Oromoo"}
                  </button>
                ))}
              </div>

              {/* Multilingual Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Service Title ({activeTab.toUpperCase()}) *
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
                    placeholder="e.g. Offset & Digital Printing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Short Summary ({activeTab.toUpperCase()}) *
                  </label>
                  <textarea
                    rows={2}
                    required={activeTab === "en"}
                    value={formData.translations[activeTab].shortDesc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [activeTab]: { ...formData.translations[activeTab], shortDesc: e.target.value },
                        },
                      })
                    }
                    placeholder="Brief 1-2 sentence summary for cards..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Full Deep-Dive Description ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={formData.translations[activeTab].fullDesc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [activeTab]: { ...formData.translations[activeTab], fullDesc: e.target.value },
                        },
                      })
                    }
                    placeholder="Comprehensive overview of equipment, capacity, and precision guarantees..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Typical Products (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.translations[activeTab].typicalProducts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeTab]: { ...formData.translations[activeTab], typicalProducts: e.target.value },
                          },
                        })
                      }
                      placeholder="e.g. Business Cards, Catalogs, Presentation Folders"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Finishes & Materials (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.translations[activeTab].finishesAndMaterials}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeTab]: { ...formData.translations[activeTab], finishesAndMaterials: e.target.value },
                          },
                        })
                      }
                      placeholder="e.g. 350gsm Card, Matte Lamination, Spot UV, Gold Foil"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Turnaround Time Guarantee ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formData.translations[activeTab].turnaroundTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        translations: {
                          ...formData.translations,
                          [activeTab]: { ...formData.translations[activeTab], turnaroundTime: e.target.value },
                        },
                      })
                    }
                    placeholder="e.g. Same-Day for digital; 2–4 working days for volume offset."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* General Technical Settings */}
              <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. offset-digital-printing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Icon Glyph
                  </label>
                  <select
                    value={formData.glyph}
                    onChange={(e) => setFormData({ ...formData, glyph: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {GLYPH_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
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

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Plant Equipment Employed (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.equipmentUsed}
                  onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                  placeholder="e.g. Heidelberg Speedmaster SM 74, Komori Lithrone G40"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                  />
                  <span>Active & Published on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                  />
                  <span>Featured on Home Page</span>
                </label>
              </div>

              {/* Visual Assets & Images */}
              <div className="pt-4 border-t border-border space-y-4">
                <MultiImageUploader
                  label="Service Cover & Visual Gallery Assets"
                  description="Upload workshop production photographs or enter CDN image URLs. The first image will be used as the primary cover."
                  images={
                    formData.coverImage
                      ? [formData.coverImage, ...formData.galleryUrls.filter((u) => u !== formData.coverImage)]
                      : formData.galleryUrls
                  }
                  coverImage={formData.coverImage}
                  onSetCover={(url) => setFormData({ ...formData, coverImage: url })}
                  onChange={(images) => {
                    const cover = images[0] || formData.coverImage;
                    setFormData({
                      ...formData,
                      coverImage: cover,
                      galleryUrls: images,
                    });
                  }}
                />
              </div>

              {/* File Link Management */}
              <div className="pt-4 border-t border-border space-y-4">
                <MediaLinksEditor
                  label="Media Links & File Link Management"
                  description="Link video demonstrations (YouTube, Shorts, Vimeo), client digital proofs, technical PDF catalogs, or external asset links."
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
                    <span>{editingService ? "Update Service" : "Save Service"}</span>
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

export default function ServicesCMSPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-foreground-muted">Loading CMS...</div>}>
      <ServicesCMSContent />
    </Suspense>
  );
}
