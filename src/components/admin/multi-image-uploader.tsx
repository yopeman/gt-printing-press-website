"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  Plus,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  coverImage?: string;
  onSetCover?: (url: string) => void;
  label?: string;
  description?: string;
}

export function MultiImageUploader({
  images,
  onChange,
  coverImage,
  onSetCover,
  label = "Image Gallery & Media Assets",
  description = "Upload high-resolution photographs or enter public CDN image URLs. Files are stored locally and previewed immediately.",
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const newUrls = (data.urls as string[]) || [];
      const updated = [...images, ...newUrls];
      onChange(updated);

      // If no cover is set and onSetCover is provided, default to the first image
      if (!coverImage && onSetCover && updated.length > 0) {
        onSetCover(updated[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    if (!images.includes(trimmed)) {
      const updated = [...images, trimmed];
      onChange(updated);
      if (!coverImage && onSetCover) {
        onSetCover(trimmed);
      }
    }
    setManualUrl("");
  };

  const handleRemove = (urlToRemove: string) => {
    const updated = images.filter((u) => u !== urlToRemove);
    onChange(updated);
    if (coverImage === urlToRemove && onSetCover) {
      onSetCover(updated[0] || "");
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-surface-secondary/60 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            <span>{label}</span>
          </label>
          <p className="text-[11px] text-foreground-muted">{description}</p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-foreground-muted self-start sm:self-auto">
          {images.length} {images.length === 1 ? "Image" : "Images"}
        </span>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload & Manual URL Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* File Picker */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            id="multi-image-upload-input"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to Local Storage...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Multiple Files</span>
              </>
            )}
          </button>
        </div>

        {/* Manual URL Input */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddManualUrl();
                }
              }}
              placeholder="Or paste image URL (https://...)"
              className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-2 rounded-xl bg-surface border border-border hover:bg-primary hover:text-white text-xs font-bold transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => {
            const isCover = coverImage === url;
            return (
              <div
                key={`${url}-${idx}`}
                className={`group relative rounded-xl overflow-hidden border aspect-video bg-surface shadow-xs transition-all ${
                  isCover ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-border-hover"
                }`}
              >
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover Badge */}
                {isCover && (
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold font-mono shadow-xs flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Cover</span>
                  </div>
                )}

                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                  {onSetCover && !isCover && (
                    <button
                      type="button"
                      onClick={() => onSetCover(url)}
                      title="Set as Primary Cover Image"
                      className="p-1.5 rounded-lg bg-surface text-foreground hover:bg-primary hover:text-white transition-colors text-[10px] font-bold flex items-center gap-1"
                    >
                      <Star className="w-3 h-3" />
                      <span className="hidden sm:inline">Set Cover</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    title="Remove Image"
                    className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
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
