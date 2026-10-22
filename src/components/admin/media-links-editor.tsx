"use client";

import React, { useState } from "react";
import { IMediaLink, MediaLinkType } from "@/types/database";
import {
  Video,
  Play,
  Share2,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  Film,
} from "lucide-react";

interface MediaLinksEditorProps {
  links: IMediaLink[];
  onChange: (links: IMediaLink[]) => void;
  label?: string;
  description?: string;
}

const MEDIA_TYPE_CONFIG: Record<
  MediaLinkType,
  { label: string; placeholder: string; icon: any; colorClass: string }
> = {
  youtube: {
    label: "YouTube Video",
    placeholder: "https://www.youtube.com/watch?v=...",
    icon: Play,
    colorClass: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  youtube_short: {
    label: "YouTube Short",
    placeholder: "https://www.youtube.com/shorts/...",
    icon: Film,
    colorClass: "bg-red-500/10 text-red-600 border-red-500/30",
  },
  vimeo: {
    label: "Vimeo Video",
    placeholder: "https://vimeo.com/...",
    icon: Video,
    colorClass: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  },
  image: {
    label: "Image Link",
    placeholder: "https://... (direct .png/.jpg/.webp)",
    icon: ImageIcon,
    colorClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  social: {
    label: "Social Media Post",
    placeholder: "https://www.tiktok.com/... or Instagram / LinkedIn / X",
    icon: Share2,
    colorClass: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  website: {
    label: "Website Link",
    placeholder: "https://...",
    icon: Globe,
    colorClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  other: {
    label: "Other Media",
    placeholder: "https://...",
    icon: LinkIcon,
    colorClass: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  },
};

export function MediaLinksEditor({
  links,
  onChange,
  label = "External Media & Video Links",
  description = "Add YouTube videos, Shorts, Vimeo clips, image links, or social media shares. Video and image links will open in an interactive modal on the live frontend.",
}: MediaLinksEditorProps) {
  const [type, setType] = useState<MediaLinkType>("youtube");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleAddLink = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    const newLink: IMediaLink = {
      type,
      url: trimmedUrl,
      title: title.trim() || undefined,
    };

    onChange([...links, newLink]);
    setUrl("");
    setTitle("");
  };

  const handleRemove = (index: number) => {
    const updated = [...links];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-surface-secondary/60 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-primary" />
            <span>{label}</span>
          </label>
          <p className="text-[11px] text-foreground-muted">{description}</p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-foreground-muted self-start sm:self-auto">
          {links.length} {links.length === 1 ? "Link" : "Links"}
        </span>
      </div>

      {/* Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
        <div className="sm:col-span-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MediaLinkType)}
            className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="youtube">YouTube Video</option>
            <option value="youtube_short">YouTube Short</option>
            <option value="vimeo">Vimeo Video</option>
            <option value="image">Image Link</option>
            <option value="social">Social Media Post</option>
            <option value="website">Website Link</option>
            <option value="other">Other Link</option>
          </select>
        </div>

        <div className="sm:col-span-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. 3D Laser Demo)"
            className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="sm:col-span-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLink();
              }
            }}
            placeholder={MEDIA_TYPE_CONFIG[type].placeholder}
            className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
          />
        </div>

        <div className="sm:col-span-1">
          <button
            type="button"
            onClick={handleAddLink}
            disabled={!url.trim()}
            className="w-full h-full py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-glow-sm"
            title="Add Media Link"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Links List */}
      {links.length > 0 && (
        <div className="space-y-2 pt-2">
          {links.map((link, idx) => {
            const config = MEDIA_TYPE_CONFIG[link.type] || MEDIA_TYPE_CONFIG.other;
            const IconComponent = config.icon;

            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface border border-border hover:border-border-hover transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border flex items-center gap-1 shrink-0 ${config.colorClass}`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{config.label}</span>
                  </span>

                  {link.title && (
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                      {link.title}
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-foreground-muted truncate flex-1">
                    {link.url}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-surface-secondary transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
