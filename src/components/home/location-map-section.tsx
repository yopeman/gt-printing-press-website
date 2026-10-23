"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from "@/lib/default-settings";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Building,
  Compass,
  Navigation,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Layers,
  X,
} from "lucide-react";

export function LocationMapSection() {
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapEngine, setMapEngine] = useState<"google" | "osm">("osm");

  useEffect(() => {
    // ESC key closes fullscreen modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.settings) {
            setSiteSettings(data.settings);
          }
        }
      } catch (e) {
        // Fallback gracefully to default settings
      }
    }
    loadSettings();
  }, []);

  const locations =
    siteSettings?.locations && siteSettings.locations.length > 0
      ? siteSettings.locations
      : DEFAULT_SETTINGS.locations;

  const total = locations.length;
  const safeIndex = ((activeMapIndex % total) + total) % total;
  const currentLoc = locations[safeIndex] || locations[0];

  const getEmbedUrl = (loc: any, engine: "google" | "osm" = mapEngine) => {
    const lat = loc.latitude || 8.9954;
    const lon = loc.longitude || 38.7885;

    if (engine === "osm") {
      const delta = 0.008;
      const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
    }

    if (loc.latitude && loc.longitude) {
      return `https://maps.google.com/maps?q=${loc.latitude},${loc.longitude}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }
    if (loc.address) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }
    return "https://maps.google.com/maps?q=Behind+Dembel+City+Centre,+Africa+Avenue,+Addis+Ababa,+Ethiopia&t=&z=16&ie=UTF8&iwloc=&output=embed";
  };

  const handlePrev = () => {
    setActiveMapIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveMapIndex((prev) => (prev + 1) % total);
  };

  const handleCopyCoordinates = () => {
    if (currentLoc.latitude && currentLoc.longitude) {
      navigator.clipboard?.writeText?.(
        `${currentLoc.latitude}, ${currentLoc.longitude}`
      );
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  const directionsUrl =
    currentLoc.latitude && currentLoc.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${currentLoc.latitude},${currentLoc.longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(currentLoc.address)}`;

  return (
    <div className="rounded-3xl border border-border shadow-card-glass bg-surface p-4 sm:p-7 space-y-6 relative overflow-hidden">
      {/* Subtle ambient card lighting */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[90px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header & Slide Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-base text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Company Facilities & Interactive Location Map</span>
          </div>
          <p className="text-xs text-foreground-muted">
            Explore our corporate headquarters and industrial fabrication plants. Showing 1 facility map at a time.
          </p>
        </div>

        {/* Slider Controls (Prev Map | Next Map) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-foreground">
            Facility {safeIndex + 1} of {total}
          </span>
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-secondary hover:bg-primary hover:text-white border border-border text-foreground transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
            title="Previous Location (<-)"
            aria-label="Previous Location"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-secondary hover:bg-primary hover:text-white border border-border text-foreground transition-all flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
            title="Next Location (->)"
            aria-label="Next Location"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Location Selector Tabs (Jump directly to any map) */}
      <div className="flex flex-wrap items-center gap-2">
        {locations.map((loc: any, idx: number) => {
          const isSelected = safeIndex === idx;
          const displayLabel =
            loc.label === "other"
              ? loc.customLabel || "Facility"
              : loc.label || "Facility";

          return (
            <button
              key={loc.id || idx}
              type="button"
              onClick={() => setActiveMapIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? "bg-primary text-white border-primary shadow-glow-sm"
                  : "bg-surface-secondary hover:bg-surface border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>
                Map {idx + 1}: {displayLabel} – {loc.name}
              </span>
              {loc.isPrimary && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md uppercase font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  HQ
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Facility Metadata Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-secondary/70 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-xs">
              MAP {String(safeIndex + 1).padStart(2, "0")}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-foreground-muted text-[11px] font-semibold uppercase font-mono">
              {currentLoc.label === "other"
                ? currentLoc.customLabel || "Facility"
                : currentLoc.label || "Facility"}
            </span>
            {currentLoc.isPrimary && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase font-mono">
                Primary HQ
              </span>
            )}
            {currentLoc.latitude && currentLoc.longitude && (
              <button
                type="button"
                onClick={handleCopyCoordinates}
                className="text-[10px] font-mono text-foreground-muted hover:text-primary transition-colors flex items-center gap-1 ml-1 px-2 py-0.5 rounded-md bg-surface border border-border cursor-pointer"
                title="Click to copy GPS coordinates"
              >
                <Compass className="w-3 h-3 text-primary" />
                <span>
                  {currentLoc.latitude.toFixed(4)}° N,{" "}
                  {currentLoc.longitude.toFixed(4)}° E
                </span>
                {copiedCoords ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 text-foreground-muted" />
                )}
              </button>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {currentLoc.name}
          </h3>

          <p className="text-xs text-foreground-muted flex items-start gap-1.5 leading-relaxed">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>{currentLoc.address}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {currentLoc.phone && (
            <a
              href={`tel:${currentLoc.phone}`}
              className="px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground hover:text-primary transition-colors font-mono font-semibold text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>{currentLoc.phone}</span>
            </a>
          )}

          {currentLoc.operatingHours?.weekday && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-border text-foreground-muted font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{currentLoc.operatingHours.weekday}</span>
            </div>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-foreground transition-colors font-semibold text-xs flex items-center gap-1.5"
            title="Get Driving Directions"
          >
            <Navigation className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Directions</span>
          </a>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-foreground hover:text-primary transition-colors font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            title="Open Map Full Screen inside the website"
          >
            <Maximize2 className="w-3.5 h-3.5 text-primary" />
            <span>Full Screen</span>
          </button>

          <a
            href={
              currentLoc.mapUrl ||
              `https://maps.google.com/?q=${encodeURIComponent(currentLoc.address)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Responsive Single Map Viewport with Left/Right Slide Arrows */}
      <div className="rounded-2xl overflow-hidden aspect-[21/9] min-h-[380px] sm:min-h-[460px] bg-surface-secondary border border-border/90 relative group shadow-inner">
        <iframe
          key={`${mapEngine}-${currentLoc.id || safeIndex}`}
          title={`${currentLoc.name} Location Map`}
          src={getEmbedUrl(currentLoc, mapEngine)}
          className="w-full h-full border-0 filter contrast-105"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Top-Right Controls: Map Provider & Fullscreen Overlay Button */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <div className="flex items-center rounded-xl bg-black/80 backdrop-blur-md p-1 border border-white/20 text-white text-[11px] shadow-lg">
            <button
              type="button"
              onClick={() => setMapEngine("osm")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                mapEngine === "osm"
                  ? "bg-primary text-white font-bold"
                  : "text-white/70 hover:text-white"
              }`}
              title="OpenStreetMap layer"
            >
              OSM Map
            </button>
            <button
              type="button"
              onClick={() => setMapEngine("google")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                mapEngine === "google"
                  ? "bg-primary text-white font-bold"
                  : "text-white/70 hover:text-white"
              }`}
              title="Google Maps layer"
            >
              Google Map
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-black/80 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Expand to Full Screen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Full Screen</span>
          </button>
        </div>

        {/* Left Floating Slide Button (<-) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 shadow-xl transition-all hover:scale-110 flex items-center justify-center backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-white/40 z-10 cursor-pointer"
            title="Previous Facility Map (<-)"
            aria-label="Previous Facility Map (<-)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Floating Slide Button (->) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 shadow-xl transition-all hover:scale-110 flex items-center justify-center backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-white/40 z-10 cursor-pointer"
            title="Next Facility Map (->)"
            aria-label="Next Facility Map (->)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Slide Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {locations.map((loc: any, idx: number) => {
          const isCurrent = safeIndex === idx;
          return (
            <button
              key={loc.id || idx}
              type="button"
              onClick={() => setActiveMapIndex(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                isCurrent
                  ? "w-8 h-2.5 bg-primary shadow-glow-xs"
                  : "w-2.5 h-2.5 bg-border hover:bg-foreground-muted"
              }`}
              title={`Go to Map ${idx + 1}: ${loc.name}`}
              aria-label={`Go to Map ${idx + 1}: ${loc.name}`}
            />
          );
        })}
      </div>

      {/* In-Website Full Screen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          {/* Fullscreen Header */}
          <div className="bg-surface/95 border-b border-border/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                  {currentLoc.name}
                </h3>
                <p className="text-xs text-foreground-muted truncate">
                  {currentLoc.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center rounded-xl bg-surface-secondary p-1 border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setMapEngine("osm")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    mapEngine === "osm"
                      ? "bg-primary text-white font-bold"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  OSM
                </button>
                <button
                  type="button"
                  onClick={() => setMapEngine("google")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    mapEngine === "google"
                      ? "bg-primary text-white font-bold"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  Google
                </button>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-surface-secondary text-foreground text-xs font-semibold items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <span>Directions</span>
              </a>

              <a
                href={
                  currentLoc.mapUrl ||
                  `https://maps.google.com/?q=${encodeURIComponent(currentLoc.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span className="hidden sm:inline">Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-foreground transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Close Full Screen (ESC)"
                aria-label="Close Full Screen"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Facility Tabs */}
          <div className="bg-surface/85 border-b border-border/60 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
            {locations.map((loc: any, idx: number) => {
              const isSelected = safeIndex === idx;
              return (
                <button
                  key={loc.id || idx}
                  type="button"
                  onClick={() => setActiveMapIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-secondary border-border text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <Building className="w-3 h-3" />
                  <span>
                    Facility {idx + 1}: {loc.label === "other" ? loc.customLabel || "Facility" : loc.label || "Facility"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fullscreen Map Canvas */}
          <div className="relative flex-1 w-full h-full bg-surface-secondary">
            <iframe
              key={`fs-${mapEngine}-${currentLoc.id || safeIndex}`}
              title={`${currentLoc.name} Full Screen Map`}
              src={getEmbedUrl(currentLoc, mapEngine)}
              className="w-full h-full border-0 filter contrast-105"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Slider arrows in fullscreen */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-2xl transition-all hover:scale-110 flex items-center justify-center cursor-pointer z-10"
                  title="Previous Facility"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-2xl transition-all hover:scale-110 flex items-center justify-center cursor-pointer z-10"
                  title="Next Facility"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
