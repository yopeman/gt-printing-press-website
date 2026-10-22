"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  Search,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Video,
  Hash,
} from "lucide-react";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { MediaLinksEditor } from "@/components/admin/media-links-editor";
import { HashtagsEditor } from "@/components/admin/hashtags-editor";
import { IMediaLink } from "@/types/database";

interface BlogPostItem {
  _id: string;
  slug: string;
  coverImage: string;
  galleryUrls?: string[];
  category: string;
  status: "draft" | "published";
  tags?: string[];
  mediaLinks?: IMediaLink[];
  publishedAt: string;
  translations: {
    en: { title: string; excerpt: string; body: string };
    am: { title: string; excerpt: string; body: string };
    om: { title: string; excerpt: string; body: string };
  };
}

function BlogCMSContent() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "am" | "om">("en");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: "",
    category: "commercial-printing",
    coverImage: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
    galleryUrls: [] as string[],
    tags: [] as string[],
    mediaLinks: [] as IMediaLink[],
    status: "published" as "draft" | "published",
    translations: {
      en: { title: "", excerpt: "", body: "" },
      am: { title: "", excerpt: "", body: "" },
      om: { title: "", excerpt: "", body: "" },
    },
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      slug: "",
      category: "commercial-printing",
      coverImage: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
      galleryUrls: [],
      tags: ["printing", "addis-ababa"],
      mediaLinks: [],
      status: "published",
      translations: {
        en: { title: "", excerpt: "", body: "" },
        am: { title: "", excerpt: "", body: "" },
        om: { title: "", excerpt: "", body: "" },
      },
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (post: BlogPostItem) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      category: post.category,
      coverImage: post.coverImage,
      galleryUrls: post.galleryUrls || [],
      tags: post.tags || [],
      mediaLinks: post.mediaLinks || [],
      status: post.status,
      translations: {
        en: {
          title: post.translations?.en?.title || "",
          excerpt: post.translations?.en?.excerpt || "",
          body: post.translations?.en?.body || "",
        },
        am: {
          title: post.translations?.am?.title || "",
          excerpt: post.translations?.am?.excerpt || "",
          body: post.translations?.am?.body || "",
        },
        om: {
          title: post.translations?.om?.title || "",
          excerpt: post.translations?.om?.excerpt || "",
          body: post.translations?.om?.body || "",
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
      setErrorMsg("Post URL slug is required");
      return;
    }
    if (!formData.translations.en.title.trim()) {
      setErrorMsg("English title is required");
      return;
    }

    setSaving(true);
    try {
      const endpoint = editingPost
        ? `/api/admin/blog/${editingPost._id}`
        : "/api/admin/blog";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      setModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.translations?.en?.title?.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Blog & Knowledge CMS
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Publish educational articles on prepress, luxury finishes, and offset printing in 3 languages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-2 transition-all"
            title="Refresh Articles"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
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
            placeholder="Search articles by title or slug..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <span className="text-xs font-mono text-foreground-muted">
          {filteredPosts.length} Articles
        </span>
      </div>

      {/* Posts Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-foreground-muted mt-2">Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-foreground-muted text-sm space-y-2">
            <FileText className="w-10 h-10 mx-auto text-foreground-muted/40" />
            <p className="font-semibold text-foreground">No articles found</p>
            <p className="text-xs">Click "Create Article" to write your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-foreground-muted uppercase font-mono text-[11px]">
                  <th className="py-3 px-3">Title & Summary</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Published</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3 px-3 max-w-md">
                      <div className="font-bold text-foreground text-sm line-clamp-1">
                        {post.translations?.en?.title || "Untitled"}
                      </div>
                      <div className="text-[11px] text-foreground-muted font-mono mt-0.5">
                        /{post.slug}
                      </div>
                      {/* Tags & Media Indicators */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-semibold"
                              >
                                #{t}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-[10px] font-mono text-foreground-muted">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        {post.mediaLinks && post.mediaLinks.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-surface-secondary border border-border text-foreground-muted text-[10px] font-mono flex items-center gap-1">
                            <Video className="w-2.5 h-2.5 text-primary" />
                            <span>{post.mediaLinks.length} media</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-secondary border border-border text-[11px] font-mono capitalize">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-foreground-muted whitespace-nowrap">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/en/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-surface-secondary/80 text-foreground-muted hover:text-foreground transition-colors"
                          title="View on Live Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-primary hover:text-white text-foreground-muted transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-red-500 hover:text-white text-foreground-muted transition-colors"
                          title="Delete Article"
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

      {/* Editor Modal with Trilingual Tabs */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[92vh] bg-surface border border-border rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
              <h3 className="text-lg font-bold text-foreground">
                {editingPost ? "Edit Blog Article" : "Create New Blog Article"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-surface-secondary text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-6 flex-1">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Core Meta Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. print-ready-artwork-preparation-guide"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="commercial-printing">Commercial Printing</option>
                    <option value="prepress">Pre-Press & Technical</option>
                    <option value="materials-finishing">Materials & Luxury Finishes</option>
                    <option value="large-format">Large Format & Signage</option>
                    <option value="packaging-technology">Packaging Technology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Unpublished)</option>
                </select>
              </div>

              {/* Multi-Image Uploader */}
              <MultiImageUploader
                images={
                  Array.from(
                    new Set(
                      [formData.coverImage, ...(formData.galleryUrls || [])].filter(Boolean)
                    )
                  )
                }
                coverImage={formData.coverImage}
                onSetCover={(newCover) => {
                  const currentAll = Array.from(
                    new Set(
                      [formData.coverImage, ...(formData.galleryUrls || [])].filter(Boolean)
                    )
                  );
                  setFormData({
                    ...formData,
                    coverImage: newCover,
                    galleryUrls: currentAll.filter((u) => u !== newCover),
                  });
                }}
                onChange={(updatedImages) => {
                  if (updatedImages.length === 0) {
                    setFormData({
                      ...formData,
                      coverImage: "",
                      galleryUrls: [],
                    });
                  } else {
                    const currentCoverValid = updatedImages.includes(formData.coverImage);
                    const cover = currentCoverValid ? formData.coverImage : updatedImages[0];
                    setFormData({
                      ...formData,
                      coverImage: cover,
                      galleryUrls: updatedImages.filter((u) => u !== cover),
                    });
                  }
                }}
                label="Article Images (Cover & Gallery)"
                description="Upload multiple images (saved to local storage). Pick one as the primary Cover photo. Additional images form the article gallery."
              />

              {/* Hashtags Editor */}
              <HashtagsEditor
                tags={formData.tags || []}
                onChange={(tags) => setFormData({ ...formData, tags })}
                suggestions={[
                  "packaging",
                  "signage",
                  "offset",
                  "prepress",
                  "finishing",
                  "cmyk",
                  "branding",
                  "color-management",
                ]}
              />

              {/* Media Links Editor */}
              <MediaLinksEditor
                links={formData.mediaLinks || []}
                onChange={(mediaLinks) => setFormData({ ...formData, mediaLinks })}
                label="Article Media Links (YouTube, Shorts, Vimeo, Social)"
                description="Add YouTube videos/Shorts, Vimeo, image links, or social media posts that readers can watch in a modal on the frontend."
              />

              {/* Trilingual Language Selector Tabs */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                    Localized Content
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

                {/* Tab Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Article Title ({activeTab.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      value={formData.translations[activeTab].title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeTab]: {
                              ...formData.translations[activeTab],
                              title: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={`Enter title in ${activeTab.toUpperCase()}...`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Short Excerpt ({activeTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={formData.translations[activeTab].excerpt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeTab]: {
                              ...formData.translations[activeTab],
                              excerpt: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={`Summary displayed on index cards (${activeTab.toUpperCase()})...`}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Markdown Body Content ({activeTab.toUpperCase()}) *
                    </label>
                    <textarea
                      rows={8}
                      value={formData.translations[activeTab].body}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [activeTab]: {
                              ...formData.translations[activeTab],
                              body: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={`Full article body in Markdown (### Heading, - bullets, bold, tables)...`}
                      className="w-full p-3.5 rounded-xl bg-surface-secondary border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingPost ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        </div>
      }
    >
      <BlogCMSContent />
    </Suspense>
  );
}
