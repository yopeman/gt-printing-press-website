'use client';

import React, { useState } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Compass,
  ExternalLink,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Share2,
  Copy,
  Check,
} from 'lucide-react';

export const PLANT_COORDINATES = {
  lat: 9.031194,
  lng: 38.832306,
  formatted: `9°01'52.3"N, 38°49'56.3"E`,
  address: '2nd Floor, Behind Dembel City Centre, Africa Avenue (Bole Road), Addis Ababa, Ethiopia',
  googleMapsUrl: 'https://www.google.com/maps?q=9.031194,38.832306&z=17',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=9.031194,38.832306',
};

export function AddisPlantMap() {
  const [copied, setCopied] = useState(false);

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText?.(`${PLANT_COORDINATES.lat}, ${PLANT_COORDINATES.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="plant-map" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-red/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <StatusBadge
            label="In-House Manufacturing Plant • Addis Ababa"
            variant="express"
            pulsingDot
            shimmer
          />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Visit Our Production Facility on{' '}
            <span className="bg-gradient-to-r from-brand-red to-brand-ruby bg-clip-text text-transparent">
              Bole Road
            </span>
          </h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Conveniently located behind Dembel City Centre in Addis Ababa. Visit our production floor, inspect physical sample proofs, and meet our senior print engineers.
          </p>
        </div>

        {/* Map & Facility Info Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Interactive Plant Location HUD & Contact Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xl space-y-6">
            <div className="space-y-4">
              {/* Plant Status Indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    Active In-House Production
                  </span>
                </div>

                <span className="text-[11px] font-mono font-bold text-foreground-muted bg-surface-secondary px-2.5 py-1 rounded-full border border-border">
                  Addis Ababa (EAT)
                </span>
              </div>

              {/* Exact Location & Pin */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-wider font-mono">
                  <MapPin className="w-4 h-4" />
                  <span>Verified Coordinates</span>
                </div>
                <h3 className="text-xl font-extrabold text-foreground leading-snug">
                  GT Printing Press Headquarters
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                  {PLANT_COORDINATES.address}
                </p>
              </div>

              {/* GPS Coordinates Chip with Copy Button */}
              <div className="p-3 rounded-2xl bg-surface-secondary/80 border border-brand-red/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                  <Compass className="w-4 h-4 text-brand-red" />
                  <span>{PLANT_COORDINATES.formatted}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-secondary border border-border text-[11px] font-semibold text-foreground flex items-center gap-1 transition-colors"
                  title="Copy GPS Coordinates"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-foreground-muted" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* In-House Production Divisions Available on Site */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block">
                  On-Site Manufacturing Divisions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-foreground/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>Offset SM 74 & Digital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>3D LED Signage Workshop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>Structural Box CAD Plotter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>PUR Bookbinding Line</span>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="p-3.5 rounded-2xl bg-surface-secondary border border-border text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Clock className="w-3.5 h-3.5 text-brand-red" />
                  <span>Plant Operating Hours</span>
                </div>
                <p className="text-foreground-muted pl-5.5">
                  Monday – Saturday: <span className="font-semibold text-foreground">8:30 AM – 6:00 PM (EAT)</span>
                </p>
                <p className="text-[11px] text-foreground-muted/80 pl-5.5">
                  Sunday: Closed (Online quote desk operating 24/7)
                </p>
              </div>
            </div>

            {/* Direct Map Action Buttons */}
            <div className="pt-4 border-t border-border flex flex-wrap items-center gap-3">
              <a
                href={PLANT_COORDINATES.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[170px] px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-xs sm:text-sm text-center shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href="tel:+251115505050"
                className="px-4 py-3 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-foreground font-semibold text-xs sm:text-sm border border-border transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>+251 11 550 5050</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Embedded Google Map pointing to 9.0311144, 38.8324246 */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-border shadow-2xl relative min-h-[420px] lg:min-h-[500px] bg-slate-950 flex flex-col">
            {/* Map Top Bar */}
            <div className="px-5 py-3 bg-surface/90 backdrop-blur-md border-b border-border flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-2 font-mono">
                <MapPin className="w-4 h-4 text-brand-red animate-bounce" />
                <span className="font-bold text-foreground">
                  Addis Ababa: 9.031194, 38.832306
                </span>
              </div>

              <a
                href={PLANT_COORDINATES.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Fullscreen Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* High-Accuracy Google Maps Iframe */}
            <div className="relative flex-1 w-full h-full min-h-[380px]">
              <iframe
                title="GT Printing Press Location Addis Ababa"
                src={`https://maps.google.com/maps?q=${PLANT_COORDINATES.lat},${PLANT_COORDINATES.lng}&hl=en&z=17&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[15%] contrast-[1.05]"
              />

              {/* Floating Plant Pin Card inside map */}
              <div className="absolute top-4 left-4 p-3.5 rounded-2xl bg-surface/95 backdrop-blur-md border border-border shadow-xl max-w-[260px] pointer-events-none hidden sm:block">
                <div className="flex items-center gap-2 text-brand-red font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                  <span>GT Printing Plant</span>
                </div>
                <p className="text-[11px] text-foreground-muted mt-1 leading-snug">
                  Africa Avenue, Behind Dembel City Centre
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-emerald-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Customer Parking Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddisPlantMap;
