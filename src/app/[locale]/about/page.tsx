import React from "react";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  Award,
  Factory,
  Compass,
  CheckCircle2,
  Users,
  Target,
  ArrowRight,
  Printer,
  Sparkles,
} from "lucide-react";
import { StatusBadge, TiltCard } from "@/components/ui";

export default function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const achievements = [
    {
      title: "100% In-House Execution",
      desc: "Complete elimination of third-party outsourcing across printing, cutting, binding, and structural metal/acrylic fabrication.",
    },
    {
      title: "Tier-1 Institutional Track Record",
      desc: "Contracted visual branding partner for major commercial banks, international diplomatic missions, and leading telecom operators.",
    },
    {
      title: "Same-Working-Day Rapid Estimates",
      desc: "Every inquiry analyzed by real production technicians for material suitability and speed.",
    },
    {
      title: "Mandatory Hard-Proof Protocol",
      desc: "Strict calibrated physical proofs for all color-critical commercial offset and packaging runs.",
    },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      {/* Background Glow */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">
        {/* Header Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="Established 2000 E.C. • Addis Ababa" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Engineering Precision Print & 3D Signage Under One Roof
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            GT Printing Press (Advanced Digital Production Printing Plc) was founded to end the costly fragmentation between separate creative agencies, offset presses, and sign fabrication workshops.
          </p>
        </div>

        {/* Origin Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-primary">
              <Factory className="w-4 h-4" />
              <span>Our Evolution & Footprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              From High-Speed Digital Engines to an Industrial Fabrication Powerhouse
            </h2>
            <div className="space-y-4 text-sm text-foreground-muted leading-relaxed">
              <p>
                Established in 2000 E.C. (approx. 2007/2008 G.C.), GT Printing began with an early strategic investment in high-throughput digital production printing on Africa Avenue (Bole Road), catering to rapid-turnaround corporate collateral.
              </p>
              <p>
                Recognizing our clients' frustration with managing external vendors for store signage and structural packaging, we expanded with an industrial fabrication workshop in Addis Ababa, adding heavy CNC routers, UV flatbed printing beds, and laser cutters.
              </p>
              <p>
                Today, GT Printing operates as a unified partner: from high-volume corporate financial reports and luxury packaging cartons to illuminated 3D storefront letters.
              </p>
            </div>
          </div>

          <div className="relative">
            <TiltCard className="p-2 overflow-hidden">
              <div className="w-full h-[380px] rounded-2xl overflow-hidden bg-[#d3332c] flex items-center justify-center p-6 sm:p-8">
                <Image
                  src="/gt-logo.png"
                  alt="GT Printing Press Logo"
                  width={520}
                  height={450}
                  priority
                  className="w-full h-full max-h-[320px] object-contain"
                />
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="p-8 rounded-3xl bg-surface border border-border/80 shadow-card-glass space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              To provide a unified, cost-effective, and technically reliable print and architectural signage production line that saves our clients time and money while preserving uncompromising brand standards.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surface border border-border/80 shadow-card-glass space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              To be Ethiopia's foremost technology-driven commercial print and structural fabrication partner, setting regional standards for speed, material quality, and turnkey delivery.
            </p>
          </div>
        </div>

        {/* Key Achievements Grid */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Proven Reliability
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Why Corporate Ethiopia Relies on GT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {achievements.map((ach, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface border border-border shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{ach.title}</span>
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed pl-7">
                  {ach.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-surface-secondary/40 border border-border text-center max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Experience the GT In-House Difference
          </h3>
          <p className="text-sm text-foreground-muted max-w-xl mx-auto">
            Schedule a visit to our Africa Avenue corporate office or book an in-person facility inspection of our fabrication floor.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm transition-all flex items-center gap-2"
            >
              <span>Visit Our Facility</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/capabilities"
              className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-secondary text-foreground font-semibold text-sm border border-border transition-colors"
            >
              <span>Inspect Machinery List</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
