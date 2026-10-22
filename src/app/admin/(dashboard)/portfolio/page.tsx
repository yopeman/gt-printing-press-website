"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Star,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Video,
  Hash,
} from "lucide-react";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { MediaLinksEditor } from "@/components/admin/media-links-editor";
import { HashtagsEditor } from "@/components/admin/hashtags-editor";
import { IMediaLink } from "@/types/database";

interface PortfolioProjectItem {
  _id: string;
  slug: string;
  serviceType: string;
  industry: string;
  year: number;
  featured: boolean;
  order: number;
  galleryUrls: string[];
  tags?: string[];
  mediaLinks?: IMediaLink[];
  translations: {
    en: { title: string; description: string; materials: string; clientName: string; location: string };
    am: { title: string; description: string; materials: string; clientName: string; location: string };
    om: { title: string; description: string; materials: string; clientName: string; location: string };
  };
}

function PortfolioCMSContent() {
  const [projects, setProjects] = useState<PortfolioProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProjectItem | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "am" | "om">("en");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: "",
    serviceType: "offset-digital-printing",
    industry: "corporate",
    year: 2026,
    featured: false,
    order: 0,
    galleryUrls: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"] as string[],
    tags: [] as string[],
    mediaLinks: [] as IMediaLink[],
    translations: {
      en: { title: "", description: "", materials: "", clientName: "", location: "Addis Ababa, Ethiopia" },
      am: { title: "", description: "", materials: "", clientName: "", location: "አዲስ አበባ፣ ኢትዮጵያ" },
      om: { title: "", description: "", materials: "", clientName: "", location: "Finfinnee, Itoophiyaa" },
    },
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      slug: "",
      serviceType: "offset-digital-printing",
      industry: "corporate",
      year: 2026,
      featured: false,
      order: projects.length,
      galleryUrls: [
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
      ],
      tags: ["commercial", "signage", "addis-ababa"],
      mediaLinks: [],
      translations: {
        en: { title: "", description: "", materials: "", clientName: "", location: "Addis Ababa, Ethiopia" },
        am: { title: "", description: "", materials: "", clientName: "", location: "አዲስ አበባ፣ ኢትዮጵያ" },
        om: { title: "", description: "", materials: "", clientName: "", location: "Finfinnee, Itoophiyaa" },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (proj: PortfolioProjectItem) => {
    setEditingProject(proj);
    setFormData({
      slug: proj.slug,
      serviceType: proj.serviceType,
      industry: proj.industry,
      year: proj.year,
      featured: proj.featured,
      order: proj.order,
      galleryUrls: proj.galleryUrls || [],
      tags: proj.tags || [],
      mediaLinks: proj.mediaLinks || [],
      translations: {
        en: {
          title: proj.translations?.en?.title || "",
          description: proj.translations?.en?.description || "",
          materials: proj.translations?.en?.materials || "",
          clientName: proj.translations?.en?.clientName || "",
          location: proj.translations?.en?.location || "",
        },
        am: {
          title: proj.translations?.am?.title || "",
          description: proj.translations?.am?.description || "",
          materials: proj.translations?.am?.materials || "",
          clientName: proj.translations?.am?.clientName || "",
          location: proj.translations?.am?.location || "",
        },
        om: {
          title: proj.translations?.om?.title || "",
          description: proj.translations?.om?.description || "",
          materials: proj.translations?.om?.materials || "",
          clientName: proj.translations?.om?.clientName || "",
          location: proj.translations?.om?.location || "",
        },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.slug.trim()) {
      setErrorMsg("Project URL slug is required");
      return;
    }
    if (!formData.translations.en.title.trim()) {
      setErrorMsg("English project title is required");
      return;
    }

    setSaving(true);
    try {
      const endpoint = editingProject
        ? `/api/admin/portfolio/${editingProject._id}`
        : "/api/admin/portfolio";
      const method = editingProject ? "PUT" : "POST";

      const payload = {
        ...formData,
        galleryUrls: formData.galleryUrls.filter(Boolean),
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      setModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this portfolio project?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = projects.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.translations?.en?.title?.toLowerCase().includes(term) ||
      p.translations?.en?.clientName?.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      p.industry.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Portfolio & Showcases CMS
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Manage commercial printing and signage case studies across aviation, banking, and retail sectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
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
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by client or title..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <span className="text-xs font-mono text-foreground-muted">
          {filtered.length} Projects
        </span>
      </div>

      {/* Projects Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-foreground-muted mt-2">Loading portfolio projects...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-foreground-muted text-sm space-y-2">
            <FolderKanban className="w-10 h-10 mx-auto text-foreground-muted/40" />
            <p className="font-semibold text-foreground">No portfolio projects found</p>
            <p className="text-xs">Click "Add Project" to upload your first showcase.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-foreground-muted uppercase font-mono text-[11px]">
                  <th className="py-3 px-3">Project Title</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Service & Industry</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((proj) => (
                  <tr key={proj._id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-bold text-foreground line-clamp-1">
                        {proj.translations?.en?.title}
                      </div>
                      <div className="text-[11px] font-mono text-foreground-muted">/{proj.slug}</div>
                      {/* Tags & Media Indicators */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {proj.tags && proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {proj.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-semibold"
                              >
                                #{t}
                              </span>
                            ))}
                            {proj.tags.length > 3 && (
                              <span className="text-[10px] font-mono text-foreground-muted">
                                +{proj.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        {proj.mediaLinks && proj.mediaLinks.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-surface-secondary border border-border text-foreground-muted text-[10px] font-mono flex items-center gap-1">
                            <Video className="w-2.5 h-2.5 text-primary" />
                            <span>{proj.mediaLinks.length} media</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">
                      {proj.translations?.en?.clientName || "Corporate Client"}
                    </td>
                    <td className="py-3 px-3">
                      <div className="capitalize text-xs text-foreground">
                        {proj.serviceType?.replace(/-/g, " ")}
                      </div>
                      <div className="text-[11px] text-foreground-muted capitalize">
                        {proj.industry}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {proj.featured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-foreground-muted text-xs">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-foreground-muted">
                      {proj.year}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/en/portfolio/${proj.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-surface-secondary/80 text-foreground-muted hover:text-foreground transition-colors"
                          title="View on Live Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-primary hover:text-white text-foreground-muted transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id)}
                          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-red-500 hover:text-white text-foreground-muted transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[92vh] bg-surface border border-border rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
              <h3 className="text-lg font-bold text-foreground">
                {editingProject ? "Edit Showcase Project" : "Add Portfolio Project"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-surface-secondary text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 flex-1">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. awash-bank-hq-architectural-signage"
                    className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Service Category
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="offset-digital-printing">Offset & Digital</option>
                    <option value="publishing-binding">Publishing & Binding</option>
                    <option value="packaging-solutions">Packaging Solutions</option>
                    <option value="large-format-signage">Large Format & Signage</option>
                    <option value="graphic-design-prepress">Design & Prepress</option>
                    <option value="corporate-promotional-items">Corporate Promotional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="banking">Banking & Finance</option>
                    <option value="aviation">Aviation & Transport</option>
                    <option value="diplomatic">Diplomatic & NGO</option>
                    <option value="hospitality">Hospitality & Tourism</option>
                    <option value="fmcg">FMCG & Coffee</option>
                    <option value="corporate">Corporate & Tech</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Year Produced
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>
                <div className="pt-5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featuredProj"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="featuredProj" className="text-xs font-semibold text-foreground cursor-pointer">
                    Feature on Home Showcase
                  </label>
                </div>
              </div>

              {/* Multi-Image Uploader for Project Gallery */}
              <MultiImageUploader
                images={formData.galleryUrls || []}
                coverImage={formData.galleryUrls?.[0] || ""}
                onSetCover={(newCover) => {
                  const current = formData.galleryUrls || [];
                  const reordered = [newCover, ...current.filter((u) => u !== newCover)];
                  setFormData({ ...formData, galleryUrls: reordered });
                }}
                onChange={(updated) => setFormData({ ...formData, galleryUrls: updated })}
                label="Project Showcase Gallery Images"
                description="Upload multiple project photographs (stored locally). The first image serves as the primary cover thumbnail on project cards."
              />

              {/* Hashtags Editor */}
              <HashtagsEditor
                tags={formData.tags || []}
                onChange={(tags) => setFormData({ ...formData, tags })}
                suggestions={[
                  "signage",
                  "packaging",
                  "3d-letters",
                  "offset",
                  "aviation",
                  "luxury-finishes",
                  "corporate-branding",
                  "led-facade",
                ]}
              />

              {/* Media Links Editor */}
              <MediaLinksEditor
                links={formData.mediaLinks || []}
                onChange={(mediaLinks) => setFormData({ ...formData, mediaLinks })}
                label="Project Video Showcases & Media Links"
                description="Add YouTube videos/Shorts, Vimeo, or social media post links that show fabrication, CNC cutting, and on-site installation."
              />

              {/* Trilingual Tabs */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                    Localized Details
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

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Project Title ({activeTab.toUpperCase()}) *
                      </label>
                      <input
                        type="text"
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
                        className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Client Name ({activeTab.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={formData.translations[activeTab].clientName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            translations: {
                              ...formData.translations,
                              [activeTab]: { ...formData.translations[activeTab], clientName: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Project Description ({activeTab.toUpperCase()}) *
                    </label>
                    <textarea
                      rows={3}
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
                      className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Materials & Fabrication Techniques ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.translations[activeTab].materials}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeTab]: { ...formData.translations[activeTab], materials: e.target.value },
                          },
                        })
                      }
                      placeholder="e.g. 350gsm SBS folding carton, matte soft-touch lamination, gold foil debossing"
                      className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
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
                  {saving ? "Saving..." : editingProject ? "Update Project" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        </div>
      }
    >
      <PortfolioCMSContent />
    </Suspense>
  );
}
