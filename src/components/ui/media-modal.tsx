"use client";

import React, { useEffect, useCallback } from "react";
import { IMediaLink, MediaLinkType } from "@/types/database";
import {
  X,
  Play,
  Film,
  Video,
  Image as ImageIcon,
  Share2,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface MediaItem {
  type: MediaLinkType;
  url: string;
  title?: string;
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | MediaItem[] | null;
  initialIndex?: number;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  return match ? match[1] : null;
}

function isDirectImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);
}

export function MediaModal({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
}: MediaModalProps) {
  const items: MediaItem[] = React.useMemo(() => {
    if (!media) return [];
    return Array.isArray(media) ? media : [media];
  }, [media]);

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, media]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && items.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === "ArrowLeft" && items.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    },
    [onClose, items.length]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const ytId = extractYouTubeId(currentItem.url);
  const vimeoId = extractVimeoId(currentItem.url);
  const isImg = currentItem.type === "image" || isDirectImageUrl(currentItem.url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[95vh] flex flex-col rounded-3xl bg-surface border border-border/60 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              {currentItem.type === "youtube" && <Play className="w-3 h-3 fill-current" />}
              {currentItem.type === "youtube_short" && <Film className="w-3 h-3" />}
              {currentItem.type === "vimeo" && <Video className="w-3 h-3" />}
              {isImg && <ImageIcon className="w-3 h-3" />}
              {currentItem.type === "social" && <Share2 className="w-3 h-3" />}
              {currentItem.type === "website" && <Globe className="w-3 h-3" />}
              <span>{currentItem.type.replace("_", " ")}</span>
            </span>

            {currentItem.title ? (
              <h3 className="text-sm font-bold text-foreground truncate">
                {currentItem.title}
              </h3>
            ) : (
              <span className="text-xs font-mono text-foreground-muted truncate">
                {currentItem.url}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {items.length > 1 && (
              <span className="text-xs font-mono text-foreground-muted mr-2">
                {currentIndex + 1} / {items.length}
              </span>
            )}
            <a
              href={currentItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-surface-secondary text-foreground-muted hover:text-foreground transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Player / Viewer Viewport */}
        <div className="relative flex-1 bg-black/40 flex items-center justify-center min-h-[340px] sm:min-h-[480px] p-2 sm:p-6 overflow-hidden">
          {/* YouTube Video or Short */}
          {ytId ? (
            <div
              className={`w-full ${
                currentItem.type === "youtube_short"
                  ? "max-w-[340px] aspect-[9/16]"
                  : "max-w-4xl aspect-[16/9]"
              } mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10`}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                title={currentItem.title || "YouTube Player"}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : vimeoId ? (
            /* Vimeo Video */
            <div className="w-full max-w-4xl aspect-[16/9] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                title={currentItem.title || "Vimeo Player"}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : isImg ? (
            /* Image Preview */
            <div className="max-h-[75vh] flex items-center justify-center">
              <img
                src={currentItem.url}
                alt={currentItem.title || "Media preview"}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              />
            </div>
          ) : (
            /* Social Post / Website / Generic Link Preview Card */
            <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-surface border border-border text-center space-y-4 shadow-2xl my-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center shadow-glow-sm">
                {currentItem.type === "social" ? (
                  <Share2 className="w-8 h-8" />
                ) : (
                  <Globe className="w-8 h-8" />
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">
                  {currentItem.title || "External Media Link"}
                </h4>
                <p className="text-xs text-foreground-muted line-clamp-2 font-mono">
                  {currentItem.url}
                </p>
              </div>

              <p className="text-xs text-foreground-muted leading-relaxed">
                This media post or website link can be viewed directly on the platform in a new browser tab.
              </p>

              <div className="pt-2">
                <a
                  href={currentItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-glow-sm"
                >
                  <span>Open Media Link</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Carousel Next / Prev Controls */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 shadow-lg transition-transform hover:scale-105"
                title="Previous media"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % items.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 shadow-lg transition-transform hover:scale-105"
                title="Next media"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
