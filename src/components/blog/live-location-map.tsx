"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  ExternalLink,
  Radio,
  Compass,
  X,
} from "lucide-react";

export const LIVE_LOCATION = {
  lat: 9.031194,
  lng: 38.832306,
  formatted: `9°01'52.3"N, 38°49'56.3"E`,
  address: "Africa Avenue (Bole Road), Behind Dembel City Centre, Addis Ababa",
  shortUrl: "https://maps.app.goo.gl/rWk273Lmd5dZ5u448",
  mapsUrl: "https://www.google.com/maps/search/9.031194,+38.832306",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=9.031194,38.832306",
};

const EMBED_SRC = `https://maps.google.com/maps?q=${LIVE_LOCATION.lat},${LIVE_LOCATION.lng}&hl=en&z=17&t=m&output=embed`;

function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Addis_Ababa",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono tabular-nums">{time ?? "--:--:--"}</span>;
}

function MapSurface() {
  return (
    <>
      <iframe
        title="GT Printing Press live location on Google Maps"
        src={EMBED_SRC}
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Floating live coordinate card */}
      <div className="pointer-events-none absolute left-4 top-4 max-w-[250px] rounded-2xl border border-white/15 bg-black/70 p-3 text-white shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-red">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
          </span>
          Live Location
        </div>
        <p className="mt-1.5 text-xs font-semibold leading-snug">GT Printing Press Plant</p>
        <p className="mt-0.5 font-mono text-[10px] text-white/70">{LIVE_LOCATION.formatted}</p>
      </div>
    </>
  );
}

export function LiveLocationMap() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  return (
    <section className="relative">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border bg-gradient-to-r from-brand-red/10 via-transparent to-primary/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-red">
              <Radio className="h-3 w-3 animate-pulse" />
              Live Map View
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Find GT Printing Press in Real Time
            </h2>
            <p className="text-xs text-foreground-muted sm:text-sm">
              {LIVE_LOCATION.address} • <LiveClock /> EAT
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={LIVE_LOCATION.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-4 py-2.5 text-xs font-bold text-white shadow-glow-sm transition-all hover:bg-brand-darkred hover:shadow-glow-md sm:text-sm"
            >
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </a>

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-surface-tertiary sm:text-sm"
            >
              <Maximize2 className="h-4 w-4 text-brand-red" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="relative min-h-[380px] w-full bg-slate-950 sm:min-h-[480px]">
          <MapSurface />

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Open map in fullscreen"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/70 px-3 py-2 text-[11px] font-bold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/85"
          >
            <Maximize2 className="h-3.5 w-3.5 text-brand-red" />
            <span>Expand Fullscreen</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-border p-4 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 font-mono">
            <Compass className="h-4 w-4 text-brand-red" />
            {LIVE_LOCATION.formatted}
          </span>

          <a
            href={LIVE_LOCATION.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open live in Google Maps</span>
          </a>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key="live-map-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 p-3 backdrop-blur-xl sm:p-6"
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 text-brand-red" />
                <span>GT Printing Press • Live Location</span>
                <span className="hidden font-mono text-[11px] font-normal text-white/60 sm:inline">
                  {LIVE_LOCATION.formatted}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                aria-label="Exit fullscreen map"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Exit</span>
                <X className="h-3.5 w-3.5 opacity-60" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full flex-1 overflow-hidden rounded-2xl border border-white/15 bg-slate-950"
            >
              <MapSurface />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default LiveLocationMap;
