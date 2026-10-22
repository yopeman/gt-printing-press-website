"use client";

import React, { useState } from "react";
import { Hash, Plus, X, Tag } from "lucide-react";

interface HashtagsEditorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  label?: string;
  description?: string;
}

const DEFAULT_SUGGESTIONS = [
  "packaging",
  "signage",
  "offset",
  "digital",
  "branding",
  "prepress",
  "finishing",
  "foil-stamping",
  "embossing",
  "cmyk",
  "luxury",
];

export function HashtagsEditor({
  tags,
  onChange,
  suggestions = DEFAULT_SUGGESTIONS,
  label = "Hashtags & Filtering Tags (#)",
  description = "Add hashtags for instant discovery and category filtering on the frontend. Clicking a hashtag will navigate and filter with URL hash (e.g. #packaging).",
}: HashtagsEditorProps) {
  const [inputVal, setInputVal] = useState("");

  const cleanTag = (str: string) => {
    return str
      .replace(/^#+/, "") // strip leading hashes
      .trim()
      .replace(/\s+/g, "-") // replace spaces with dash
      .toLowerCase();
  };

  const addTag = (raw: string) => {
    const cleaned = cleanTag(raw);
    if (!cleaned) return;
    if (!tags.map((t) => t.toLowerCase()).includes(cleaned)) {
      onChange([...tags, cleaned]);
    }
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-surface-secondary/60 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-primary" />
            <span>{label}</span>
          </label>
          <p className="text-[11px] text-foreground-muted">{description}</p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-foreground-muted self-start sm:self-auto">
          {tags.length} {tags.length === 1 ? "Tag" : "Tags"}
        </span>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary font-bold font-mono text-sm">
            #
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tag and press Enter (e.g. packaging, offset, 3d-signage)..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
          />
        </div>
        <button
          type="button"
          onClick={() => addTag(inputVal)}
          disabled={!inputVal.trim()}
          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-glow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add #Tag</span>
        </button>
      </div>

      {/* Current Tags Chips */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono font-bold transition-all hover:bg-primary/15"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition-colors p-0.5"
                title="Remove tag"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-foreground-muted italic pt-1">
          No hashtags assigned yet. Add tags for easy filtering.
        </p>
      )}

      {/* Suggested Tags */}
      {suggestions.length > 0 && (
        <div className="pt-2 border-t border-border/50 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase font-mono tracking-wider text-foreground-muted mr-1">
            Suggestions:
          </span>
          {suggestions
            .filter((s) => !tags.includes(s))
            .slice(0, 8)
            .map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => addTag(sug)}
                className="px-2 py-0.5 rounded-lg bg-surface hover:bg-surface-secondary border border-border text-[11px] font-mono text-foreground-muted hover:text-foreground transition-colors flex items-center gap-0.5"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>#{sug}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
