"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export type IndustrialGlyph =
  | "offset-roller"
  | "uv-flatbed"
  | "laser-beam"
  | "cnc-router"
  | "guillotine-blade"
  | "foil-emboss"
  | "thermal-laminate"
  | "saddle-stitch";

interface IconBoxProps {
  icon?: LucideIcon;
  glyph?: IndustrialGlyph;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "surface" | "glow" | "outline";
  className?: string;
  hoverSpin?: boolean;
  hoverPulse?: boolean;
}

export function IconBox({
  icon: IconComponent,
  glyph,
  size = "md",
  variant = "primary",
  className = "",
  hoverSpin = false,
  hoverPulse = false,
}: IconBoxProps) {
  const sizeMap = {
    sm: "w-8 h-8 rounded-lg text-xs p-1.5",
    md: "w-11 h-11 rounded-xl text-sm p-2.5",
    lg: "w-14 h-14 rounded-2xl text-base p-3.5",
    xl: "w-18 h-18 rounded-3xl text-xl p-4",
  };

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-9 h-9",
  };

  const variantMap = {
    primary: "bg-primary/10 border border-primary/25 text-primary shadow-sm",
    surface: "bg-surface border border-border text-foreground shadow-sm",
    glow: "bg-primary text-white shadow-glow-sm border border-primary/40",
    outline: "bg-transparent border border-border text-foreground-muted hover:text-foreground",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-all duration-300 group ${
        sizeMap[size]
      } ${variantMap[variant]} ${
        hoverPulse ? "hover:scale-105 hover:shadow-glow-md" : ""
      } ${className}`}
    >
      <div
        className={`flex items-center justify-center transition-transform duration-500 ${
          hoverSpin ? "group-hover:rotate-180" : ""
        }`}
      >
        {glyph ? (
          <IndustrialSvgGlyph type={glyph} className={iconSizeMap[size]} />
        ) : IconComponent ? (
          <IconComponent className={iconSizeMap[size]} />
        ) : null}
      </div>
    </div>
  );
}

function IndustrialSvgGlyph({
  type,
  className = "w-5 h-5",
}: {
  type: IndustrialGlyph;
  className?: string;
}) {
  switch (type) {
    case "offset-roller":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Offset Printing Cylinders */}
          <circle cx="12" cy="7" r="4" />
          <circle cx="7" cy="16" r="4" />
          <circle cx="17" cy="16" r="4" />
          <path d="M12 11v2" />
          <circle cx="12" cy="7" r="1.5" fill="currentColor" />
          <circle cx="7" cy="16" r="1.5" fill="currentColor" />
          <circle cx="17" cy="16" r="1.5" fill="currentColor" />
        </svg>
      );
    case "uv-flatbed":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* UV Flatbed Print Carriage with Curing Light Rays */}
          <rect x="2" y="14" width="20" height="7" rx="2" />
          <path d="M6 14V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" />
          <path d="M12 7v3" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
          <path d="M9 10l-1.5 2" />
          <path d="M15 10l1.5 2" />
        </svg>
      );
    case "laser-beam":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Laser Head Emitting Focused Beam */}
          <path d="M12 2v6" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M10 8h4l1 3H9l1-3z" />
          <path d="M12 11v8" strokeDasharray="2 1" />
          <circle cx="12" cy="21" r="2" fill="currentColor" />
          <path d="M8 21h8" />
        </svg>
      );
    case "cnc-router":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* CNC Router Bit and Precision Axis */}
          <path d="M12 3v7" />
          <path d="M9 3h6" />
          <path d="M10 10h4l-2 5-2-5z" fill="currentColor" />
          <path d="M4 18h16" />
          <path d="M7 18v3" />
          <path d="M17 18v3" />
        </svg>
      );
    case "guillotine-blade":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Polar Mohr Precision Cutting Guillotine */}
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M4 8v12h16V8" />
          <path d="M4 14l16-4" strokeWidth="2.5" />
          <line x1="7" y1="18" x2="17" y2="18" strokeDasharray="2 2" />
        </svg>
      );
    case "foil-emboss":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Emboss / Foil Stamping Stamp Matrix */}
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 9h6v6H9z" />
          <path d="M12 6v3" />
          <path d="M12 15v3" />
          <path d="M6 12h3" />
          <path d="M15 12h3" />
        </svg>
      );
    case "thermal-laminate":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Laminating Roller Press */}
          <rect x="3" y="5" width="18" height="4" rx="2" />
          <rect x="3" y="15" width="18" height="4" rx="2" />
          <path d="M2 11.5h20" strokeWidth="3" />
        </svg>
      );
    case "saddle-stitch":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Book Spine with Wire Saddle Stitching */}
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="4" y1="7" x2="4" y2="9" strokeWidth="3" />
          <line x1="4" y1="13" x2="4" y2="15" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
}
