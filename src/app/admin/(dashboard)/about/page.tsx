"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Info,
  Target,
  Compass,
  CheckCircle2,
  Save,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Layers,
  Factory,
  Image as ImageIcon,
} from "lucide-react";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { MediaLinksEditor } from "@/components/admin/media-links-editor";
import { IMediaLink, Locale } from "@/types/database";
import { ABOUT_DATA } from "@/data/about";

function AboutCMSContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Locale>("en");

  // Form State
  const [heroBadge, setHeroBadge] = useState(ABOUT_DATA.heroBadge);
  const [heroTitle, setHeroTitle] = useState(ABOUT_DATA.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(ABOUT_DATA.heroSubtitle);

  const [storyTag, setStoryTag] = useState(ABOUT_DATA.storyTag);
  const [storyTitle, setStoryTitle] = useState(ABOUT_DATA.storyTitle);
  const [storyParagraphsText, setStoryParagraphsText] = useState({
    en: ABOUT_DATA.storyParagraphs.en.join("\n\n"),
    am: ABOUT_DATA.storyParagraphs.am.join("\n\n"),
    om: ABOUT_DATA.storyParagraphs.om.join("\n\n"),
  });
  const [storyImage, setStoryImage] = useState(ABOUT_DATA.storyImage);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(ABOUT_DATA.galleryUrls || []);
  const [mediaLinks, setMediaLinks] = useState<IMediaLink[]>(ABOUT_DATA.mediaLinks as IMediaLink[] || []);

  const [missionTitle, setMissionTitle] = useState(ABOUT_DATA.missionTitle);
  const [missionText, setMissionText] = useState(ABOUT_DATA.missionText);
  const [visionTitle, setVisionTitle] = useState(ABOUT_DATA.visionTitle);
  const [visionText, setVisionText] = useState(ABOUT_DATA.visionText);

  const [achievements, setAchievements] = useState(ABOUT_DATA.achievements);

  const [ctaTitle, setCtaTitle] = useState(ABOUT_DATA.ctaTitle);
  const [ctaSubtitle, setCtaSubtitle] = useState(ABOUT_DATA.ctaSubtitle);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about");
      if (res.ok) {
        const data = await res.json();
        const a = data.about;
        if (a) {
          if (a.heroBadge) setHeroBadge(a.heroBadge);
          if (a.heroTitle) setHeroTitle(a.heroTitle);
          if (a.heroSubtitle) setHeroSubtitle(a.heroSubtitle);
          if (a.storyTag) setStoryTag(a.storyTag);
          if (a.storyTitle) setStoryTitle(a.storyTitle);
          if (a.storyParagraphs) {
            setStoryParagraphsText({
              en: (a.storyParagraphs.en || []).join("\n\n"),
              am: (a.storyParagraphs.am || []).join("\n\n"),
              om: (a.storyParagraphs.om || []).join("\n\n"),
            });
          }
          if (a.storyImage) setStoryImage(a.storyImage);
          if (a.galleryUrls) setGalleryUrls(a.galleryUrls);
          if (a.mediaLinks) setMediaLinks(a.mediaLinks);
          if (a.missionTitle) setMissionTitle(a.missionTitle);
          if (a.missionText) setMissionText(a.missionText);
          if (a.visionTitle) setVisionTitle(a.visionTitle);
          if (a.visionText) setVisionText(a.visionText);
          if (a.achievements && a.achievements.length > 0) setAchievements(a.achievements);
          if (a.ctaTitle) setCtaTitle(a.ctaTitle);
          if (a.ctaSubtitle) setCtaSubtitle(a.ctaSubtitle);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleAddAchievement = () => {
    setAchievements([
      ...achievements,
      {
        title: { en: "New Achievement", am: "አዲስ ስኬት", om: "Milkaa'ina Haaraa" },
        desc: {
          en: "Describe the proof of reliability or milestone achieved.",
          am: "የስራውን ጥራት ወይም የተከናወነውን ስኬት ያብራሩ።",
          om: "Ibsa milkaa'ina kanaa asitti barreessaa.",
        },
      },
    ]);
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    const payload = {
      heroBadge,
      heroTitle,
      heroSubtitle,
      storyTag,
      storyTitle,
      storyParagraphs: {
        en: storyParagraphsText.en.split("\n\n").map((p) => p.trim()).filter(Boolean),
        am: storyParagraphsText.am.split("\n\n").map((p) => p.trim()).filter(Boolean),
        om: storyParagraphsText.om.split("\n\n").map((p) => p.trim()).filter(Boolean),
      },
      storyImage,
      galleryUrls,
      mediaLinks,
      missionTitle,
      missionText,
      visionTitle,
      visionText,
      achievements,
      ctaTitle,
      ctaSubtitle,
    };

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMsg(data.error || "Failed to update about page content");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-foreground-muted flex flex-col items-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        <span className="text-xs font-medium">Loading corporate about content...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Info className="w-6 h-6 text-primary" />
            <span>Company Profile, Mission & Vision CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Manage company narrative, plant evolution, mission, vision, key achievements, and multimedia credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/en/about"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live</span>
          </a>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>About page content updated and synchronized across all locales!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Language Selector Strip */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4 sticky top-4 z-20 shadow-sm backdrop-blur-md bg-surface/95">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider mr-2 font-mono">
            Editing Language:
          </span>
          {(["en", "am", "om"] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveTab(loc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                activeTab === loc
                  ? "bg-primary text-white shadow-glow-sm"
                  : "bg-surface-secondary text-foreground-muted hover:text-foreground"
              }`}
            >
              {loc === "en" ? "English" : loc === "am" ? "አማርኛ" : "Afaan Oromoo"}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-foreground-muted font-mono hidden sm:inline">
          Changes apply to <strong>{activeTab.toUpperCase()}</strong> locale
        </span>
      </div>

      {/* 1. Hero Section */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>1. Hero Header Banner</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Hero Top Badge ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={heroBadge[activeTab] || ""}
              onChange={(e) => setHeroBadge({ ...heroBadge, [activeTab]: e.target.value })}
              placeholder="e.g. Established 2000 E.C. • Addis Ababa"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Main Headline ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={heroTitle[activeTab] || ""}
              onChange={(e) => setHeroTitle({ ...heroTitle, [activeTab]: e.target.value })}
              placeholder="e.g. Engineering Precision Print & 3D Signage Under One Roof"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Hero Subtitle ({activeTab.toUpperCase()})
            </label>
            <textarea
              rows={2}
              value={heroSubtitle[activeTab] || ""}
              onChange={(e) => setHeroSubtitle({ ...heroSubtitle, [activeTab]: e.target.value })}
              placeholder="Introduction to GT Printing Press..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Target className="w-5 h-5" />
            <span>Mission Statement</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Mission Title ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={missionTitle[activeTab] || ""}
                onChange={(e) => setMissionTitle({ ...missionTitle, [activeTab]: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Mission Description ({activeTab.toUpperCase()})
              </label>
              <textarea
                rows={4}
                value={missionText[activeTab] || ""}
                onChange={(e) => setMissionText({ ...missionText, [activeTab]: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <Compass className="w-5 h-5" />
            <span>Vision Statement</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Vision Title ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={visionTitle[activeTab] || ""}
                onChange={(e) => setVisionTitle({ ...visionTitle, [activeTab]: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Vision Description ({activeTab.toUpperCase()})
              </label>
              <textarea
                rows={4}
                value={visionText[activeTab] || ""}
                onChange={(e) => setVisionText({ ...visionText, [activeTab]: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Origin Story & Evolution */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
          <Factory className="w-4 h-4" />
          <span>3. Company Narrative & Evolution</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Section Tag ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={storyTag[activeTab] || ""}
                onChange={(e) => setStoryTag({ ...storyTag, [activeTab]: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Section Headline ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={storyTitle[activeTab] || ""}
                onChange={(e) => setStoryTitle({ ...storyTitle, [activeTab]: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Evolution Story Paragraphs ({activeTab.toUpperCase()}) (Separate paragraphs with empty line)
            </label>
            <textarea
              rows={6}
              value={storyParagraphsText[activeTab] || ""}
              onChange={(e) =>
                setStoryParagraphsText({
                  ...storyParagraphsText,
                  [activeTab]: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Brand Emblem / Logo URL
            </label>
            <input
              type="text"
              value={storyImage}
              onChange={(e) => setStoryImage(e.target.value)}
              placeholder="/gt-logo.png or CDN image URL"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>
      </div>

      {/* 4. Proven Reliability & Key Achievements */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>4. Proven Reliability / Key Achievements</span>
          </h3>

          <button
            type="button"
            onClick={handleAddAchievement}
            className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-surface-secondary/40 border border-border space-y-2.5 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-foreground-muted">
                  Achievement #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(idx)}
                  className="p-1 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Remove card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Title ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={ach.title?.[activeTab] || ""}
                  onChange={(e) => {
                    const next = [...achievements];
                    next[idx].title = { ...next[idx].title, [activeTab]: e.target.value };
                    setAchievements(next);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Description ({activeTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={ach.desc?.[activeTab] || ""}
                  onChange={(e) => {
                    const next = [...achievements];
                    next[idx].desc = { ...next[idx].desc, [activeTab]: e.target.value };
                    setAchievements(next);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Inspection Callout */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>5. Bottom Facility Inspection Banner</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Banner Headline ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={ctaTitle[activeTab] || ""}
              onChange={(e) => setCtaTitle({ ...ctaTitle, [activeTab]: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Banner Subtitle ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={ctaSubtitle[activeTab] || ""}
              onChange={(e) => setCtaSubtitle({ ...ctaSubtitle, [activeTab]: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 6. Visual Media Assets & Facility Photographs */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <MultiImageUploader
          label="Corporate & Plant Photography Gallery"
          description="Upload photographs of your Bole Road offices, workshop equipment, or production floors."
          images={galleryUrls}
          onChange={(imgs) => setGalleryUrls(imgs)}
        />
      </div>

      {/* 7. File Link Management & External Media */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <MediaLinksEditor
          label="Corporate Video Tours & Official PDF Links"
          description="Link YouTube virtual facility tours, company profile brochure PDFs, or external credential links."
          links={mediaLinks}
          onChange={(lks) => setMediaLinks(lks)}
        />
      </div>

      {/* Floating or Bottom Save Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4 shadow-xl">
        <span className="text-xs text-foreground-muted font-medium">
          Make sure to review translations across EN, AM, and OM before publishing.
        </span>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function AboutCMSPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-foreground-muted">Loading CMS...</div>}>
      <AboutCMSContent />
    </Suspense>
  );
}
