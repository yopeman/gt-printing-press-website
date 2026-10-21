import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { MACHINERY_DATA } from "@/data/machinery";
import { type Locale } from "@/types/database";
import { WorkflowPipeline } from "@/components/home/workflow-pipeline";
import { StatusBadge, TiltCard, IconBox } from "@/components/ui";
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Factory,
  Gauge,
  Sparkles,
} from "lucide-react";

export default function CapabilitiesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  const categories = [
    { key: "offset", label: "Commercial Offset & Digital Presses" },
    { key: "cutting", label: "Precision Cutting & Trimming" },
    { key: "binding", label: "Automated Book Folding & Binding" },
    { key: "finishing", label: "High-Speed Thermal Lamination" },
    { key: "signage", label: "Heavy CNC Routing & UV Flatbed Fabrication" },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="100% In-House Plant • No Outsourcing" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            In-House Capabilities & Machinery Inventory
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            GT Printing owns and operates every link of the manufacturing chain: from multi-color German and Japanese offset presses to industrial Swiss binders, British laminators, and high-precision CNC routers.
          </p>
        </div>

        {/* Proofing Protocol Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-primary/30 shadow-card-glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>COLOR QUALITY ASSURANCE GUARANTEE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Mandatory Calibrated Hard-Proofing Protocol
            </h2>
            <p className="text-sm text-foreground-muted leading-relaxed">
              For color-critical institutional publications, bank collateral, and luxury packaging, soft on-screen proofs are insufficient due to ambient monitor variance. We require physical signed contract proofs printed on the exact target paper stock before release to the press room.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                FOGRA39 / ISO 12647-2 Standard
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Physical Substrate Validation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero Color Drift Tolerance
              </span>
            </div>
          </div>
        </div>

        {/* Machinery Inventory Cards by Division */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-primary font-mono">
              Heavy Equipment Lineup
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground">
              Industrial Plant Machinery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MACHINERY_DATA.map((machine, idx) => (
              <TiltCard key={idx} className="p-6 flex flex-col justify-between group">
                <div className="space-y-4">
                  {/* Image */}
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-secondary">
                    <img
                      src={machine.image}
                      alt={machine.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-[10px] font-bold font-mono text-foreground">
                        {machine.origin}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary block">
                      {machine.manufacturer}
                    </span>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mt-0.5">
                      {machine.name}
                    </h3>
                    <p className="text-xs text-foreground-muted leading-relaxed mt-2">
                      {machine.description[loc] || machine.description.en}
                    </p>
                  </div>

                  {/* Specs List */}
                  <div className="p-4 rounded-xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-foreground-muted block">
                      Engineering Specifications
                    </span>
                    <ul className="space-y-1 text-xs text-foreground font-mono">
                      {machine.keySpecs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Manufacturing Pipeline Section */}
        <div className="space-y-8 pt-8 border-t border-border">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-primary font-mono">
              Turnkey Production
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Our 5-Stage Production Protocol
            </h2>
          </div>
          <WorkflowPipeline />
        </div>

        {/* CTA Strip */}
        <div className="p-8 rounded-3xl bg-surface border border-border text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Need Custom Technical Consultation?
          </h3>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-xl mx-auto">
            Our production technicians can advise you on paper weights, grain direction, foil block feasibility, and structural packaging dielines.
          </p>
          <div className="pt-2">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm transition-all"
            >
              <span>Submit Technical Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
