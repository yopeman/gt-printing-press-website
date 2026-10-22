'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { StatusBadge } from '@/components/ui/status-badge';
import CircularCarousel, { type CarouselItem } from '@/components/ui/CircularCarousel';
import bgDesignImage from '@/assets/image.png';
import bgCircuitImage from '@/assets/image copy.png';
import bgWaveImage from '@/assets/image copy 2.png';
import bgBrandImage from '@/assets/image copy 3.png';
import bgRedBrandImage from '@/assets/image copy 4.png';
import bgShowcaseImage from '@/assets/image copy 5.png';

const HERO_BACKGROUNDS = [
  bgDesignImage,
  bgCircuitImage,
  bgWaveImage,
  bgBrandImage,
  bgRedBrandImage,
  bgShowcaseImage,
] as const;

const HERO_GALLERY: CarouselItem[] = [
  { src: bgDesignImage.src, alt: 'Creative design showcase', title: 'Creative Design' },
  { src: bgCircuitImage.src, alt: 'Digital precision artwork', title: 'Digital Precision' },
  { src: bgWaveImage.src, alt: 'Premium wave finishing', title: 'Premium Finishing' },
  { src: bgBrandImage.src, alt: 'Global tech printing showcase', title: 'Global Tech Printing' },
  { src: bgRedBrandImage.src, alt: 'GT Printing brand artwork', title: 'GT Printing Brand' },
  { src: bgShowcaseImage.src, alt: 'Production capabilities showcase', title: 'Production Showcase' },
];

const HERO_CAROUSEL_ITEMS: CarouselItem[] = HERO_GALLERY;
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MapPin,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface BackgroundSlide {
  id: string;
  divisionNum: string;
  category: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  tagline: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export const SLIDES: BackgroundSlide[] = [
  {
    id: 'signage',
    divisionNum: '01',
    category: '3D Architectural Signage',
    badge: 'State-of-the-Art In-House Fabrication',
    title: 'Design, Print, Fabricate & Install —',
    highlightText: 'All Under One Roof',
    subtitle:
      "Ethiopia's premier commercial printing, precision structural packaging, and 3D architectural signage partner behind Dembel City Centre.",
    tagline: '3D Channel Letters • Samsung IP67 LEDs • Outdoor Billboards • CNC Acrylic',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=85',
    ctaText: 'Explore Signage Specs',
    ctaLink: '/services/large-format-signage',
  },
  {
    id: 'offset',
    divisionNum: '02',
    category: 'Industrial Pressroom',
    badge: 'High-Volume Commercial Offset',
    title: 'High-Speed Heidelberg & Komori',
    highlightText: 'Offset Production',
    subtitle:
      'Spectrophotometer-calibrated multi-color offset and fast digital printing with zero banding and flawless color fidelity.',
    tagline: '15,000 Sheets/Hour • ISO 12647-2 Standard • Same-Day Digital Runs',
    image:
      'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=2000&q=85',
    ctaText: 'Explore Offset Press',
    ctaLink: '/services/offset-digital-printing',
  },
  {
    id: 'packaging',
    divisionNum: '03',
    category: 'Structural Papercraft',
    badge: 'Luxury Rigid Cartons & Boxes',
    title: 'Precision CAD Dielines & Custom',
    highlightText: 'Retail Packaging',
    subtitle:
      'Turnkey luxury gift cartons, magnetic closure boxes, coffee export packaging, and tactile metallic gold foil stamping.',
    tagline: '2.0mm Rigid Greyboard • Neodymium Magnets • Food-Grade Barrier Boards',
    image:
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=2000&q=85',
    ctaText: 'Explore Packaging',
    ctaLink: '/services/packaging-solutions',
  },
  {
    id: 'publishing',
    divisionNum: '04',
    category: 'Publication Finishing',
    badge: 'Turnkey Publishing & Binding',
    title: 'Müller Martini Automated PUR',
    highlightText: 'Book & Magazine Binding',
    subtitle:
      'Robust square spines, lay-flat page spreads, and section-sewn hardcover binding built for institutional durability.',
    tagline: 'Annual Reports • Diplomatic Documents • In-Flight Magazines • Textbooks',
    image:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=2000&q=85',
    ctaText: 'Explore Publishing',
    ctaLink: '/services/publishing-binding',
  },
  {
    id: 'merchandise',
    divisionNum: '05',
    category: 'Executive Branding',
    badge: 'Fiber Laser & Corporate Gifts',
    title: 'Laser-Engraved VIP Gifts &',
    highlightText: 'Institutional Merchandise',
    subtitle:
      'High-touch executive leather organizers, micron fiber laser-engraved metal pens, and rotary UV cylindrical drinkware.',
    tagline: '0.01mm Laser Annealing • Debossed Gold Foil • VIP Executive Gift Sets',
    image:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=2000&q=85',
    ctaText: 'Explore Promotional',
    ctaLink: '/services/corporate-promotional-items',
  },
];

interface HeroBackgroundSliderProps {
  onOpenQuoteModal: () => void;
}

export function HeroBackgroundSlider({ onOpenQuoteModal }: HeroBackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const CYCLE_MS = 3000; // Changes every 3 seconds as requested
  const STEP_MS = 30;

  const currentSlide = SLIDES[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // 3-second cycle ticker
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (STEP_MS / CYCLE_MS) * 100;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, handleNext]);

  // Independent 3-second animated asset background cross-fade
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, CYCLE_MS);

    return () => clearInterval(bgInterval);
  }, [isPlaying, isHovered, CYCLE_MS]);

  return (
    <div
      className="relative w-full min-h-[640px] md:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated slow-motion dissolving background — every image in /assets */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-black">
        {HERO_BACKGROUNDS.map((bg, idx) => {
          const isActive = idx === bgIndex;
          return (
            <motion.div
              key={idx}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{
                opacity: isActive
                  ? { duration: 2.6, ease: [0.44, 0, 0.56, 1] }
                  : { duration: 1.4, delay: 1.6, ease: [0.44, 0, 0.56, 1] },
              }}
              style={{ zIndex: isActive ? 2 : 1 }}
            >
              {/* Slow cinematic Ken Burns pan & zoom */}
              <motion.div
                className="w-full h-full"
                animate={{ scale: [1.06, 1.16], x: ['0%', idx % 2 === 0 ? '-2%' : '2%'] }}
                transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              >
                <img
                  src={bg.src}
                  alt="GT Printing Press background showcase"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Sophisticated brand dark overlays for crystal-clear readability & cinematic atmosphere */}
        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black via-black/75 to-black/60" />
        <div
          className="absolute inset-0 z-[5] mix-blend-multiply opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(220, 38, 38, 0.35) 0%, rgba(10, 10, 10, 0.95) 75%)',
          }}
        />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 z-[5] opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Main Hero Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left: dynamic brand content */}
          <div className="space-y-6 text-center sm:space-y-8 lg:col-span-7 lg:text-left xl:col-span-6">
            {/* Top Badge with Active Division Indicator */}
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <StatusBadge
                label={currentSlide.badge}
                variant="express"
                pulsingDot
                shimmer
              />
              <span className="text-[11px] font-mono font-bold text-white/80 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                <span className="text-brand-red font-extrabold">{currentSlide.divisionNum}</span> / 05 • 3s Cycle
              </span>
            </div>

            {/* Dynamic Headline with Cross-Fade */}
            <div className="flex min-h-[120px] items-center justify-center sm:min-h-[140px] lg:justify-start">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.12]"
                >
                  {currentSlide.title}{' '}
                  <span className="bg-gradient-to-r from-red-500 via-rose-400 to-red-500 bg-clip-text text-transparent">
                    {currentSlide.highlightText}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Subtitle & Tagline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + '-sub'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mx-auto max-w-2xl space-y-3 lg:mx-0"
              >
                <p className="text-base font-medium leading-relaxed text-slate-200 drop-shadow-md sm:text-lg">
                  {currentSlide.subtitle}
                </p>
                <p className="inline-block rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-xs tracking-wide text-white/70 backdrop-blur-md sm:text-sm">
                  {currentSlide.tagline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action Button Suite */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="flex items-center gap-2 rounded-2xl bg-brand-red px-8 py-4 text-base font-bold text-white shadow-glow-md transition-all hover:bg-brand-darkred hover:shadow-glow-lg group"
              >
                <span>Request Same-Day Quote</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                href={currentSlide.ctaLink}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/25"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="h-4 w-4 text-brand-red" />
              </Link>

              <a
                href="#plant-map"
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/50 px-5 py-4 text-xs font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 sm:text-sm"
              >
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Visit Plant (Bole Road)</span>
              </a>
            </div>

            {/* Bottom 5 Capability Switcher Tabs with 3-Second Progress Indicators */}
            <div className="mx-auto max-w-xl pt-8 lg:mx-0">
              <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/60 p-2 shadow-2xl backdrop-blur-xl sm:flex-row">
                {/* 5 Slide Tabs with Individual 3s Progress Fillers */}
                <div className="grid w-full flex-1 grid-cols-5 gap-1.5">
                  {SLIDES.map((slide, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => handleSelect(idx)}
                        className={`relative overflow-hidden rounded-xl p-2 text-center transition-all ${
                          isActive
                            ? 'border border-brand-red/50 bg-white/20 text-white shadow-inner'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {/* Active 3-second Progress Filler Bar */}
                        {isActive && (
                          <div
                            className="absolute bottom-0 left-0 h-[2.5px] bg-brand-red transition-all duration-75"
                            style={{ width: `${progress}%` }}
                          />
                        )}
                        <span className="block font-mono text-[10px] font-bold text-brand-red">
                          {slide.divisionNum}
                        </span>
                        <span className="block truncate text-[11px] font-bold">
                          {slide.category.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Play / Pause / Prev / Next Mini Controls */}
                <div className="flex shrink-0 items-center gap-1.5 px-1">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause 3s rotation' : 'Resume 3s rotation'}
                    className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                    title={isPlaying ? 'Pause 3s background change' : 'Resume 3s background change'}
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-brand-red" />}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous background"
                    className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next background"
                    className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: circular 3D carousel built from the asset images */}
          <div className="lg:col-span-5 xl:col-span-6">
            <div className="relative h-[340px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md sm:h-[420px] lg:h-[560px]">
              {/* Ambient glow behind the orbit */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(220, 38, 38, 0.18) 0%, rgba(0, 0, 0, 0.55) 72%)',
                }}
                aria-hidden="true"
              />

              <div className="relative h-full w-full">
                <CircularCarousel
                  items={HERO_CAROUSEL_ITEMS}
                  preset="cylinder"
                  intro="rise"
                  cardWidth={190}
                  aspectRatio={1}
                  gap={20}
                  curve={1}
                  tilt={-6}
                  perspective={2200}
                  autoplay="drift"
                  speed={18}
                  direction="left"
                  momentum={0.6}
                  snap
                  pauseOnHover
                  focusOnClick={false}
                  draggable
                  parallax={0.3}
                  stretch={0.5}
                  fadeColor="#000000"
                  depthFade={0.55}
                  innerShade={0.5}
                  cornerRadius={14}
                  captions={false}
                />
              </div>

              <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between gap-2 text-[10px] sm:text-[11px]">
                <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-white/80 backdrop-blur-md">
                  3D Asset Orbit
                </span>
                <span className="rounded-full border border-brand-red/25 bg-brand-red/15 px-3 py-1 font-semibold text-brand-red backdrop-blur-md">
                  Drag to rotate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBackgroundSlider;
