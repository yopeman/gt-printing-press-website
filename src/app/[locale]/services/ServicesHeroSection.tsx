'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CircularCarousel, { type CarouselItem } from '@/components/ui/CircularCarousel';
import { StatusBadge } from '@/components/ui';
import { ArrowRight, MoveHorizontal, CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { type Locale } from '@/types/database';
import { PORTFOLIO_DATA, type PortfolioItem } from '@/data/portfolio';

interface ServicesHeroSectionProps {
  locale: Locale;
}

interface PortfolioCarouselItem extends CarouselItem {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  slug: string;
  clientName: string;
  category: string;
  desc: string;
}

// Convert PORTFOLIO_DATA into CarouselItems matching the user's color brand and CMS images
const buildItemsFromPortfolio = (
  items: PortfolioItem[],
  loc: Locale
): PortfolioCarouselItem[] => {
  return items.map((p) => ({
    src: p.coverImage,
    alt: p.title[loc] || p.title.en,
    title: p.title[loc] || p.title.en,
    subtitle: `${p.clientName} • ${p.categoryLabel[loc] || p.categoryLabel.en}`,
    slug: p.slug,
    clientName: p.clientName,
    category: p.category,
    desc: p.summary[loc] || p.summary.en,
  }));
};

export function ServicesHeroSection({ locale }: ServicesHeroSectionProps) {
  // Initial items populated directly from the portfolio CMS data
  const initialItems = useMemo(
    () => buildItemsFromPortfolio(PORTFOLIO_DATA, locale),
    [locale]
  );

  const [items, setItems] = useState<PortfolioCarouselItem[]>(initialItems);
  const [activeIndex, setActiveIndex] = useState(0);

  // Synchronize dynamically with Admin Portfolio CMS API
  useEffect(() => {
    let isMounted = true;
    async function loadCmsPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          if (data.projects && data.projects.length > 0 && isMounted) {
            const mapped: PortfolioCarouselItem[] = data.projects.map((proj: any) => {
              const trans = proj.translations?.[locale] || proj.translations?.en || {};
              const imageSrc =
                (proj.galleryUrls && proj.galleryUrls[0]) ||
                proj.coverImage ||
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
              return {
                src: imageSrc,
                alt: trans.title || proj.slug,
                title: trans.title || proj.slug,
                subtitle: `${trans.clientName || 'GT Production'} • ${(proj.serviceType || '').replace(/-/g, ' ')}`,
                slug: proj.slug,
                clientName: trans.clientName || 'GT Client',
                category: proj.serviceType || 'commercial-print',
                desc: trans.description || '',
              };
            });
            setItems(mapped);
          }
        }
      } catch (err) {
        // Fallback to static PORTFOLIO_DATA
      }
    }

    loadCmsPortfolio();
    return () => {
      isMounted = false;
    };
  }, [locale]);

  const activeService = items[activeIndex] || items[0] || initialItems[0];

  const handleSlideChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleItemClick = useCallback((item: CarouselItem) => {
    const slug = (item as any).slug;
    if (slug) {
      // If there is a matching service card on this page, scroll to it
      const targetElement =
        document.getElementById(`service-${slug}`) ||
        document.getElementById('services-grid');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const scrollToServices = () => {
    const grid = document.getElementById('services-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
      {/* Background brand ambient glows */}
      <div
        className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-red/15 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-10 left-1/4 -translate-x-1/2 w-[400px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Side: Brand Story, Value Props & CTAs */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6 text-left">
          {/* Status Badge */}
          <div className="inline-flex">
            <StatusBadge
              label="Industrial Print & Signage Plant • 100% In-House"
              variant="express"
              pulsingDot
              shimmer
            />
          </div>

          {/* Heading with Brand Red Accent */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
              Precision Printing &{' '}
              <span className="bg-gradient-to-r from-brand-red via-brand-ruby to-brand-darkred bg-clip-text text-transparent">
                Fabrication Services
              </span>
            </h1>
            <p className="text-sm sm:text-base text-foreground-muted leading-relaxed max-w-xl">
              From high-volume color-critical corporate publications and structural retail packaging to heavy 3D illuminated architectural storefronts, explore our specialized in-house divisions powered by German Heidelberg and Komori machinery.
            </p>
          </div>

          {/* Key capability pills */}
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-border/80 shadow-sm text-[11px] sm:text-xs font-medium text-foreground">
              <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
              <span>Multi-Unit Offset & Digital</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-border/80 shadow-sm text-[11px] sm:text-xs font-medium text-foreground">
              <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
              <span>3D Illuminated Signage</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-border/80 shadow-sm text-[11px] sm:text-xs font-medium text-foreground">
              <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
              <span>Custom Luxury Packaging</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-border/80 shadow-sm text-[11px] sm:text-xs font-medium text-foreground">
              <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
              <span>Same-Day Fast Turnaround</span>
            </div>
          </div>

          {/* Active slide quick preview pill from the Portfolio CMS */}
          {activeService && (
            <div className="p-3.5 rounded-2xl bg-surface-secondary/70 border border-brand-red/25 backdrop-blur-md flex items-center justify-between gap-3 shadow-sm transition-all duration-300">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-ping shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red block">
                    Portfolio Showcase {activeIndex + 1} of {items.length}
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {activeService.title} —{' '}
                    <span className="text-foreground-muted font-normal">
                      {activeService.subtitle}
                    </span>
                  </p>
                </div>
              </div>

              <Link
                href={`/portfolio/${activeService.slug}`}
                className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-brand-red hover:text-white border border-border text-[11px] font-bold text-foreground transition-all shrink-0 flex items-center gap-1 shadow-sm"
              >
                <span>View Project</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/quote"
              className="px-6 py-3.5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-sm shadow-glow-md hover:shadow-glow-lg transition-all flex items-center gap-2"
            >
              <span>Request Instant Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={scrollToServices}
              className="px-5 py-3.5 rounded-xl bg-surface hover:bg-surface-secondary text-foreground font-semibold text-sm border border-border transition-colors flex items-center gap-2 group"
            >
              <span>Explore All 6 Divisions</span>
              <ChevronDown className="w-4 h-4 text-foreground-muted group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Interactive Hint */}
          <div className="flex items-center gap-2 text-[11px] text-foreground-muted pt-1">
            <MoveHorizontal className="w-3.5 h-3.5 text-brand-red animate-pulse" />
            <span>Interactive 3D Carousel: Drag horizontally to spin cylinder or click any slide.</span>
          </div>
        </div>

        {/* Right Side: Circular Carousel with Portfolio CMS images */}
        <div className="lg:col-span-6 xl:col-span-7 flex justify-center items-center">
          <div className="w-full relative rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-b from-surface/50 to-surface-secondary/80 backdrop-blur-md shadow-2xl p-2 sm:p-4 min-h-[340px] sm:min-h-[460px] lg:min-h-[560px]">
            {/* Ambient vignette background glow */}
            <div
              className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 -z-10"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.14) 0%, rgba(10, 10, 10, 0.45) 100%)',
              }}
            />

            {/* Exact CircularCarousel configuration requested */}
            <div className="relative w-full h-[320px] sm:h-[430px] lg:h-[560px]">
              <CircularCarousel
                items={items}
                preset="cylinder"
                intro="rise"
                cardWidth={190}
                aspectRatio={1}
                speed={14}
                captions={false}
                gap={25}
                tilt={-5}
                curve={1}
                perspective={2500}
                autoplay="drift"
                interval={3}
                direction="left"
                momentum={0.6}
                snap
                pauseOnHover
                focusOnClick
                draggable
                parallax={0.3}
                stretch={0.5}
                fadeColor="#000000"
                depthFade={0.55}
                innerShade={0.6}
                cornerRadius={12}
                onChange={handleSlideChange}
                onItemClick={handleItemClick}
              />
            </div>

            {/* Bottom floating brand badge */}
            <div className="absolute bottom-3 left-4 right-4 sm:left-6 sm:right-6 pointer-events-none flex items-center justify-between text-xs text-foreground-muted">
              <span className="bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-border/80 font-mono text-[11px] text-foreground/80">
                GT Portfolio CMS
              </span>
              <span className="bg-brand-red/10 text-brand-red border border-brand-red/20 px-3 py-1 rounded-full font-semibold text-[11px]">
                3D Cylinder Showcase
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesHeroSection;
