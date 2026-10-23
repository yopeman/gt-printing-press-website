"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Image as ImageIcon,
} from "lucide-react";

interface SingleImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  shape?: "avatar" | "square";
}

export function SingleImageUploader({
  value,
  onChange,
  label = "Avatar / Profile Photo",
  description = "Upload a photo from your computer (JPG, PNG, WebP up to 15MB).",
  shape = "avatar",
}: SingleImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Please upload a valid image file (JPEG, PNG, WebP, GIF, or SVG)");
      return;
    }

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 15MB limit");
      return;
    }

    setErrorMsg(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      const uploadedUrl = data.url || (data.urls && data.urls[0]);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-foreground">
          {label}
        </label>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Preview with Replace / Remove Actions */
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-surface-secondary/70 border border-border">
          <div className="relative shrink-0">
            <img
              src={value}
              alt="Uploaded avatar"
              className={`object-cover border-2 border-primary/20 shadow-sm ${
                shape === "avatar"
                  ? "w-16 h-16 rounded-full"
                  : "w-16 h-16 rounded-2xl"
              }`}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <span className="text-xs font-bold text-foreground block truncate">
              Photo uploaded successfully
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5 text-primary" />
                <span>Change Photo</span>
              </button>

              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 bg-surface-secondary/40 hover:bg-surface-secondary/70"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">
                {uploading ? "Uploading image..." : "Click to upload photo or drag & drop"}
              </span>
              <span className="text-[10px] text-foreground-muted mt-0.5 block">
                JPEG, PNG, WebP or SVG up to 15MB
              </span>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {description && !errorMsg && !value && (
        <span className="text-[10px] text-foreground-muted block">
          {description}
        </span>
      )}
    </div>
  );
}
