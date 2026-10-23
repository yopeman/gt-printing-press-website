"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Cpu,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Factory,
  Globe,
  Layers,
  Sparkles,
} from "lucide-react";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { MediaLinksEditor } from "@/components/admin/media-links-editor";
import { IMediaLink, Locale } from "@/types/database";

interface CapabilityItem {
  _id: string;
  name: string;
  slug?: string;
  category: string;
  manufacturer: string;
  origin: string;
  keySpecs: string[];
  image: string;
  galleryUrls?: string[];
  mediaLinks?: IMediaLink[];
  order: number;
  active: boolean;
  translations: {
    en: { description: string };
    am: { description: string };
    om: { description: string };
  };
}

const CATEGORY_OPTIONS = [
  { value: "offset", label: "Commercial Offset & Digital Presses" },
  { value: "cutting", label: "Precision Cutting & Trimming" },
  { value: "binding", label: "Automated Book Folding & Binding" },
  { value: "finishing", label: "High-Speed Thermal Lamination & Foil" },
  { value: "signage", label: "Heavy CNC Routing & UV Flatbed" },
  { value: "other", label: "Other Industrial Machinery" },
];

function CapabilitiesCMSContent() {
  const [machines, setMachines] = useState<CapabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CapabilityItem | null>(null);
  const [activeTab, setActiveTab] = useState<Locale>("en");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "offset",
    manufacturer: "",
    origin: "Germany",
    keySpecsText: "" as string, // newline or comma separated in form
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    galleryUrls: [] as string[],
    mediaLinks: [] as IMediaLink[],
    order: 0,
    active: true,
    translations: {
      en: { description: "" },
      am: { description: "" },
      om: { description: "" },
    },
  });

  const fetchCapabilities = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/capabilities");
      if (res.ok) {
        const data = await res.json();
        setMachines(data.capabilities || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapabilities();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      slug: "",
      category: "offset",
      manufacturer: "",
      origin: "Germany",
      keySpecsText: "Speed: Up to 15,000 sheets/hour\nMax Sheet Size: 530 x 740 mm\nDigital Touchscreen Control",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      galleryUrls: [],
      mediaLinks: [],
      order: machines.length + 1,
      active: true,
      translations: {
        en: { description: "" },
        am: { description: "" },
        om: { description: "" },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (item: CapabilityItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug || "",
      category: item.category || "offset",
      manufacturer: item.manufacturer,
      origin: item.origin || "Germany",
      keySpecsText: (item.keySpecs || []).join("\n"),
      image: item.image,
      galleryUrls: item.galleryUrls || [item.image],
      mediaLinks: item.mediaLinks || [],
      order: item.order || 0,
      active: item.active !== false,
      translations: {
        en: { description: item.translations?.en?.description || "" },
        am: { description: item.translations?.am?.description || "" },
        om: { description: item.translations?.om?.description || "" },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the machine "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/capabilities/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMachines((prev) => prev.filter((m) => m._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete machine");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during deletion");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg("Machine name is required");
      return;
    }
    if (!formData.manufacturer.trim()) {
      setErrorMsg("Manufacturer is required");
      return;
    }
    if (!formData.translations.en.description.trim()) {
      setErrorMsg("English description is required");
      return;
    }

    setSaving(true);

    const specsArray = formData.keySpecsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: formData.category,
      manufacturer: formData.manufacturer.trim(),
      origin: formData.origin.trim(),
      keySpecs: specsArray,
      image: formData.image,
      galleryUrls: formData.galleryUrls.length > 0 ? formData.galleryUrls : [formData.image],
      mediaLinks: formData.mediaLinks,
      order: Number(formData.order),
      active: formData.active,
      translations: {
        en: {
          description: formData.translations.en.description.trim(),
        },
        am: {
          description: formData.translations.am.description.trim() || formData.translations.en.description.trim(),
        },
        om: {
          description: formData.translations.om.description.trim() || formData.translations.en.description.trim(),
        },
      },
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/capabilities/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchCapabilities();
        } else {
          setErrorMsg(data.error || "Failed to update machine");
        }
      } else {
        const res = await fetch("/api/admin/capabilities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchCapabilities();
        } else {
          setErrorMsg(data.error || "Failed to create machine");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const filteredMachines = machines.filter((m) => {
    const q = search.toLowerCase();
    const name = m.name.toLowerCase();
    const manufacturer = m.manufacturer.toLowerCase();
    const cat = m.category.toLowerCase();
    return name.includes(q) || manufacturer.includes(q) || cat.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-primary" />
            <span>Plant Capabilities & Machinery CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Manage heavy industrial offset presses, digital engines, Swiss binders, and laser/CNC machinery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCapabilities}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            title="Refresh Machinery"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Machine</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by machine, brand, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="text-xs text-foreground-muted self-end sm:self-center font-mono">
          Showing <strong>{filteredMachines.length}</strong> machines
        </div>
      </div>

      {/* Machinery Cards */}
      {loading ? (
        <div className="py-20 text-center text-foreground-muted flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs font-medium">Loading plant machinery...</span>
        </div>
      ) : filteredMachines.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-surface border border-border border-dashed p-8 space-y-3">
          <Cpu className="w-10 h-10 text-foreground-muted mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-foreground">No machinery found</h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            {search ? "No machinery matched your search criteria." : "Start by registering your plant equipment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((m, idx) => (
            <div
              key={m._id}
              className="rounded-2xl bg-surface border border-border overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition-all shadow-sm"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-surface-secondary overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-mono font-bold text-foreground border border-border">
                      {m.origin}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-mono uppercase font-bold">
                      {m.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      {m.manufacturer}
                    </span>
                    <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors mt-0.5">
                      {m.name}
                    </h3>
                  </div>

                  <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                    {m.translations?.en?.description}
                  </p>

                  {/* Specs list */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-bold text-foreground-muted uppercase tracking-wider block mb-1">
                      Key Specs:
                    </span>
                    <ul className="space-y-0.5 text-[11px] text-foreground font-mono">
                      {(m.keySpecs || []).slice(0, 3).map((spec, sIdx) => (
                        <li key={sIdx} className="truncate flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {m.mediaLinks && m.mediaLinks.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>{m.mediaLinks.length} media / video link(s)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-surface-secondary/30 flex items-center justify-between">
                <a
                  href="/en/capabilities"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-foreground-muted hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public View</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(m)}
                    className="p-1.5 rounded-lg bg-surface border border-border text-foreground hover:text-primary hover:border-primary transition-colors"
                    title="Edit Machine"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m._id, m.name)}
                    className="p-1.5 rounded-lg bg-surface border border-border text-foreground-muted hover:text-red-500 hover:border-red-500/30 transition-colors"
                    title="Delete Machine"
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
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {editingItem ? "Edit Machinery Specification" : "Register New Plant Equipment"}
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    Configure machine specifications, country of origin, operational speeds, and video links.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Machine Model & Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Heidelberg Speedmaster SM 74"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Manufacturer / Engineering Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g. Heidelberg Druckmaschinen AG"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Manufacturing Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Country of Origin / Engineering
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Germany, Japan, Switzerland"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Key Specs */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Engineering Specifications (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.keySpecsText}
                  onChange={(e) => setFormData({ ...formData, keySpecsText: e.target.value })}
                  placeholder="Speed: 15,000 sheets/hour&#10;Max Sheet Size: 530 x 740 mm&#10;Spectrophotometric color control"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-3 pt-2">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider mr-2 font-mono">
                  Description Language:
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

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Machine Overview & Capability Details ({activeTab.toUpperCase()}) *
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
                        [activeTab]: { description: e.target.value },
                      },
                    })
                  }
                  placeholder="Explain accuracy, throughput capacity, and what makes this equipment vital..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Order and Active */}
              <div className="flex items-center gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Sort / Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-28 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground pt-5">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                  />
                  <span>Active & Visible in Plant Lineup</span>
                </label>
              </div>

              {/* Image Uploader */}
              <div className="pt-4 border-t border-border space-y-4">
                <MultiImageUploader
                  label="Machine Photographs & Operational Imagery"
                  description="Upload photographs of this machinery on the plant floor or paste high-resolution CDN URLs."
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

              {/* Media Links / File Link Management */}
              <div className="pt-4 border-t border-border space-y-4">
                <MediaLinksEditor
                  label="Machinery Media Links & Operational Videos"
                  description="Link video demonstrations (YouTube, Shorts, Vimeo) showing this machine in action, manufacturer spec sheet PDF downloads, or external links."
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
                    <span>{editingItem ? "Update Machine" : "Save Machine"}</span>
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

export default function CapabilitiesCMSPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-foreground-muted">Loading CMS...</div>}>
      <CapabilitiesCMSContent />
    </Suspense>
  );
}
