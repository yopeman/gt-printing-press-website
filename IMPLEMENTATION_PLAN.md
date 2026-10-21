# GT Printing Press Website — Implementation Plan

**Project:** Trilingual Corporate Website, Quote Engine & Custom CMS  
**Specification Reference:** [`gt-printing-website-spec.md`](./gt-printing-website-spec.md)  
**Version:** 1.0  
**Target Architecture:** Next.js (App Router), Tailwind CSS (4-state theme system), `framer-motion`, `lucide-react`, `next-intl` (EN, AM, OM), MongoDB (Embedded Localization), Neogram Telegram Bot Integration.

---

## Architecture & System Overview

```
                                ┌──────────────────────────────────────────────┐
                                │             Next.js 14/15 App                │
                                │  • next-intl (en / am / om)                  │
                                │  • next-themes (light, dark, night, system)  │
                                │  • framer-motion & lucide-react              │
                                └──────────────────────┬───────────────────────┘
                                                       │
                 ┌─────────────────────────────────────┴─────────────────────────────────────┐
                 │                                                                           │
                 ▼                                                                           ▼
   ┌───────────────────────────┐                                               ┌───────────────────────────┐
   │    Public Web Surface     │                                               │    Custom Admin Panel     │
   │  • Hero & Trust Strip     │                                               │  • Role-based Access      │
   │  • Interactive Machinery  │                                               │  • Multi-language Editor  │
   │  • 6 Service Deep-Dives   │                                               │  • Quote Pipeline Manager │
   │  • Filterable Portfolio   │                                               │  • Content CRUD (Blog,    │
   │  • Multi-step Quote Form  │                                               │    Portfolio, Clients)    │
   └─────────────┬─────────────┘                                               └─────────────┬─────────────┘
                 │                                                                           │
                 ▼                                                                           ▼
   ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │                                Server Actions & Route Handlers                                        │
   │  • Ethiopian Phone & Input Validation  • Honeypot & Rate Limiter  • File Upload Handling              │
   └──────────────────────┬────────────────────────────────────────────────────┬───────────────────────────┘
                          │                                                    │
                          ▼                                                    ▼
   ┌───────────────────────────────────────────────┐  ┌────────────────────────────────────────────────────┐
   │              MongoDB Database                 │  │             Neogram Telegram Service               │
   │  • Embedded Localization ({ en, am, om })     │  │  • Real-time Bot Instant Dispatch                  │
   │  • Quotes, Blog, Portfolio, Settings, Users   │  │  • Formatted Alert with Direct Action Buttons     │
   └───────────────────────────────────────────────┘  └────────────────────────────────────────────────────┘
```

---

## Phase Breakdown & Milestone Schedule

```
Phase 1: Foundation, Themes, i18n & Data Models  ──┐
                                                  ├──► Phase 3: Public Pages & Motion Showcase
Phase 2: Design System, Layouts & Micro-UI        ──┘        │
                                                             ▼
Phase 4: Quote Engine & Neogram Integration       ───────────┼──► Phase 6: QA, SEO & Performance
                                                             │          │
Phase 5: Secure Custom Admin Panel (CMS)          ───────────┘          ▼
                                                                  Phase 7: Launch & Production
```

---

## Phase 1: Project Foundation, Core Architecture & Data Models

> **Goal:** Set up the Next.js App Router codebase, configure the 4-state theme engine, configure trilingual routing (`en`, `am`, `om`), and initialize MongoDB schemas with embedded localization.

- [x] **Task 1.1: Project Scaffolding & Dependency Setup**
  - Initialize Next.js project with TypeScript, ESLint, PostCSS, and Tailwind CSS.
  - Install dependencies: `next-intl`, `next-themes`, `framer-motion`, `lucide-react`, `mongoose` (or native MongoDB driver), `bcryptjs`, `jose` / `next-auth`, and `zod`.
  - Configure path aliases (`@/*`) and project directory structure.

- [x] **Task 1.2: 4-State Theme Engine Configuration**
  - Configure CSS custom property tokens in `globals.css` for:
    - **Light:** Studio Clean (`#FFFFFF` bg, `#F8FAFC` cards, `#0F172A` text, `#DC2626` red).
    - **Dark:** Sleek Slate (`#0F172A` bg, `#1E293B` cards, `#94A3B8` borders, `#F43F5E` ruby).
    - **Night:** OLED Midnight (`#000000` pitch black, `#0A0A0A` obsidian cards, `#FF2E56` neon ruby).
    - **System:** Automatic sync with `prefers-color-scheme`.
  - Wrap application in `ThemeProvider` with `attribute="data-theme"` or `class` and `themes={['light', 'dark', 'night', 'system']}`.
  - Implement zero-FOUC (Flash of Unstyled Content) script to prevent theme flickering.

- [x] **Task 1.3: Trilingual Internationalization (i18n) Engine**
  - Configure `next-intl` with locale prefixing (`/en`, `/am`, `/om`).
  - Create base translation JSON dictionaries for common UI strings, navigation, footer, and errors.
  - Configure typography in `next/font`:
    - Latin: `Inter` or `Plus Jakarta Sans`.
    - Ethiopic: `Noto Sans Ethiopic` with tailored line-height and letter-spacing for Ge'ez script.
  - Implement language negotiation middleware and locale-aware redirection.

- [x] **Task 1.4: Database Schema & Connection Management**
  - Establish cached MongoDB connection utility for serverless execution.
  - Implement Mongoose models utilizing the **Embedded Localization Pattern**:
    - `QuoteRequest`: reference (`#GT-2026-XXXX`), serviceType, contact info (name, company, phone, email, contactMethod), specs (description, quantity, neededBy, artworkStatus), attachments, status (`New` | `Contacted` | `Quoted` | `Won` | `Lost`), notes, telegramDeliveryStatus.
    - `BlogPost`: slug, coverImage, category, status, publishedAt, `translations: { en: {...}, am: {...}, om: {...} }`.
    - `PortfolioProject`: slug, serviceType, industry, year, featured, order, galleryUrls, `translations: { en: {...}, am: {...}, om: {...} }`.
    - `Testimonial`: clientName, role, company, avatarUrl, order, `translations: { en: {...}, am: {...}, om: {...} }`.
    - `ClientLogo`: name, logoUrl, category, order.
    - `SiteSetting`: key-value settings (contact phones, emails, office coordinates, Telegram handles).
    - `User`: admin/editor credentials, hashed password, role.

---

## Phase 2: Design System, Layouts & Micro-UI Components

> **Goal:** Build the visual identity system, navigation headers, glassmorphism layers, micro-interactions, and mobile touch docks.

- [x] **Task 2.1: Navigation Bar & Locale/Theme Switchers**
  - Responsive header with high-performance backdrop blur (`backdrop-blur-md`).
  - Interactive multi-state Theme Segmented Switcher (☀️ Light → 🌙 Dark → 🌌 Night → 💻 System) with icon transitions.
  - Trilingual Language Switcher (EN | አማ | OM) with smooth spring layout indicator (`layoutId`).
  - Desktop navigation links with animated hover underlines and direct "Request a Quote" CTA button.
  - Mobile full-screen slide-in drawer menu with staggered entrance animations.

- [x] **Task 2.2: Mobile Quick-Contact Floating Dock**
  - Persistent bottom touch dock on mobile viewports:
    - 1-tap Telegram quick direct chat link.
    - 1-tap phone dialer (`tel:+251...`).
    - Quick "Instant Quote" trigger opening the quote drawer/modal.
  - Auto-hides on rapid scroll down, reappears smoothly on scroll up.

- [x] **Task 2.3: Reusable Modern Component Kit**
  - **Magnetic Buttons:** Primary CTAs gently snap to cursor position on desktop hover.
  - **3D Tilt Cards:** Glassmorphism cards with mouse-tracking radial gradient light and tilt perspective for portfolio & service highlights.
  - **Icon Container System:** Standardized glowing icon boxes with theme-reactive fills using `lucide-react` and custom printing equipment glyphs.
  - **Animated Counter:** Viewport-triggered scroll counter for metrics ("Since 2000 E.C.", "100% In-House", "Same-Day Quote").
  - **Status & Express Badges:** Glowing pill indicators with shimmer wave animations.

- [x] **Task 2.4: Footer & Trust Anchors**
  - Comprehensive footer containing legal company name (`Advanced Digital Production Printing Plc / GT Printing Plc`).
  - Africa Avenue (Bole Road) location link, interactive working hours, trilingual sitemap links, and social channel links.
  - Live Ethiopian local time display (East Africa Time, UTC+3) and current workshop operating status (Open / Closed).

---

## Phase 3: Public Website Pages & Interactive Experiences

> **Goal:** Develop the complete trilingual public website with high-performance animations, machinery diagrams, and filterable showcases.

- [x] **Task 3.1: High-Impact Home Page**
  - **Hero Section:** Bold headline ("Design, print, fabricate and install, all under one roof"), magnetic primary quote CTA, secondary portfolio button, and dynamic background mesh/ambient glow.
  - **Quick Trust Strip:** Icon-driven key proof points ("Same-Day Turnaround", "100% In-House Production", "Est. 2000 E.C.").
  - **Services Grid:** 6 interactive cards with custom industrial icons and direct quote pre-fill links.
  - **"Why GT" Differentiators:** Architectural signage capabilities, paper-to-structural scope, and mandatory proofing process.
  - **Interactive Workflow Diagram:** Animated 5-stage production line (Design ➔ Pre-press ➔ Production ➔ Fabrication ➔ Delivery) with glowing signal paths.
  - **Featured Portfolio Reel:** Selected top tier branding and 3D architectural signage projects.
  - **Client Wall & Testimonials Slider:** Animated client logo carousel (Marriott, Ethiopian Airlines, ethio telecom, Awash Bank, etc.) and responsive quote cards.
  - **Latest Blog Insights:** 3 featured articles with reading time and tag badges.

- [x] **Task 3.2: About Us & Company Profile**
  - GT Printing origin story (transition from high-speed digital engines to full-scale fabrication workshop behind Dembel).
  - Mission, Vision, and Institutional Trust credentials (financial, diplomatic, and NGO client track record).
  - Production Philosophy: Soft-proof validation + mandatory hard-copy proofs for color-critical work.

- [x] **Task 3.3: Services Architecture (Overview + 6 Detail Pages)**
  - Dynamic routing for services:
    1. `offset-digital-printing`
    2. `publishing-binding`
    3. `packaging-solutions`
    4. `large-format-signage`
    5. `graphic-design-prepress`
    6. `corporate-promotional-items`
  - Each detail page features: technical specs, available paper stocks & finishing techniques, high-res sample gallery, and a direct "Request a Quote for this Service" button that pre-selects the service in the quote form.

- [x] **Task 3.4: Capabilities & In-House Machinery Showcase**
  - Machinery inventory cards with specs and manufacturer logos:
    - Offset: *Heidelberg Speedmaster*, *Komori Lithrone*, *Manroland ROLAND*.
    - Cutting & Finishing: *Polar Mohr Guillotines*, *Autobond / Komfi Laminators*.
    - Folding & Binding: *MBO / Horizon Folders*, *Müller Martini Perfect Binders*, *Duplo Bookletmakers*.
    - Large Format & Signage: UV flatbeds, Laser cutters, heavy CNC routers.
  - Quality assurance workflow breakdown (Color calibration, hard proofs, structural mockups).

- [x] **Task 3.5: Industries We Serve Page**
  - Tailored solution breakdowns for:
    - Schools & Universities (Exams, certificates, yearbooks).
    - Medical & Healthcare Facilities (Sensitive stationery, prescription pads, forms).
    - Corporate & Event Branding (Exhibition stands, 3D shopfront signage, rollups).
    - Financial Institutions & Telecoms (High-security print, massive campaign rollouts).

- [x] **Task 3.6: Filterable Portfolio System**
  - Portfolio grid with animated category filters (`All`, `Signage & 3D`, `Packaging`, `Publishing`, `Corporate Branding`).
  - Project detail pages with client credits, materials used, production techniques, location, and expandable image gallery.

- [x] **Task 3.7: GT Printing Blog**
  - Blog post listing with search, category filtering, and pagination.
  - Article reading view with rich markdown/HTML formatting, print-prep guidelines (bleeds, CMYK vs RGB, vector prep), social share buttons, and an inline quote CTA card.

- [x] **Task 3.8: Contact Page & Interactive Location**
  - Google Maps location embed for Africa Avenue (Behind Dembel City Centre).
  - Direct telephone links for fast sales inquiries.
  - Working hours schedule and general contact inquiry form.

---

## Phase 4: Quote Engine & Neogram Telegram Pipeline

> **Goal:** Implement the primary business conversion funnel with Ethiopian phone validation, file attachment handling, spam mitigation, and instant Telegram alerts via Neogram.

- [x] **Task 4.1: Interactive Multi-Step Quote / Order Form**
  - **Step 1: Service Selection:** Interactive grid of visual cards with icons; pre-selects service if arriving from a specific service page.
  - **Step 2: Contact Details:**
    - Full Name (required).
    - Company / Organization (optional).
    - Phone Number (required, validated for Ethiopian formats: `+251 9...`, `+251 7...`, `09...`, `07...`).
    - Email address (optional).
    - Preferred contact channel (Phone, Telegram, Email).
  - **Step 3: Technical Specifications:**
    - Free-text job description (dimensions, paper/material preferences, finishing).
    - Quantity bracket selector (e.g., `100–500`, `1,000–5,000`, `10,000+`, or custom).
    - Needed-by timeline selector (e.g., "Urgent / 24-48 hrs", "Within 1 week", "Specific Date").
    - Artwork readiness toggle ("I have print-ready artwork" vs "I need graphic design assistance").
  - **Step 4: Attachments & External Links:**
    - File upload dropzone with client-side file size and type validation (PDF, AI, PSD, ZIP, images).
    - Large file alternative: External file share link field (Google Drive, WeTransfer, Telegram).
  - Directional slide animations between steps and progress indicator.

- [x] **Task 4.2: Spam Protection & Form Security**
  - Hidden honeypot field to trap automated bots.
  - IP-based rate limiting on quote submission endpoints.
  - Server-side Zod validation for all form fields.

- [x] **Task 4.3: Neogram Telegram Bot Integration**
  - Initialize Neogram bot instance with secure environment credentials (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
  - Build formatted Markdown/HTML message template:
    - Unique Quote ID (`#GT-2026-XXXX`).
    - Service name, customer name, company, phone, email.
    - Detailed specs, quantity, needed-by date, artwork status.
    - Language in which inquiry was made.
  - Add **Telegram Inline Action Buttons**:
    - `[📞 Call Customer]` (`tel:+251...`)
    - `[💬 Open Telegram Chat]` (`tg://resolve?domain=...`)
    - `[📂 View in Admin Dashboard]` (Deep link to quote management)
  - Resilient execution: Guarantee quote is saved to MongoDB first; if Telegram API encounters network issues, log error and queue retry without failing the user's submission.

- [x] **Task 4.4: User Confirmation & UX Feedback**
  - Animated submission success state with green checkmark and copyable Reference Number.
  - Friendly confirmation message matching visitor's language: "Thank you! Our production team will contact you with a quote on the same working day."

---

## Phase 5: Secure Custom Admin Panel (Content Management System)

> **Goal:** Deliver an intuitive, role-protected dashboard for GT staff to manage quote leads, update portfolio projects, publish blog posts, and modify site settings in all three languages.

- [x] **Task 5.1: Authentication & Role-Based Authorization**
  - Secure login screen with email/password authentication.
  - Password hashing using `bcryptjs` and session handling via secure HTTP-only cookies.
  - Two user roles:
    - **Admin:** Full access (Quote management, user administration, site settings, content).
    - **Editor:** Content management (Blog, portfolio, testimonials, client logos).

- [x] **Task 5.2: Quote Pipeline & Lead Management Dashboard**
  - Summary metrics: New inquiries today, pending quotes, total monthly submissions.
  - Filterable quote table with status filters: `New` ➔ `Contacted` ➔ `Quoted` ➔ `Won` ➔ `Lost`.
  - Quote details modal with internal notes area for sales staff.
  - One-click CSV export of inquiries for accounting and follow-up.

- [x] **Task 5.3: Trilingual Content Managers (Tabs for EN / AM / OM)**
  - **Blog Post Manager:** Rich text editor, cover image uploader, category/tagging, publication status (`Draft`, `Published`), SEO meta title & description.
  - **Portfolio Manager:** Project title and description tabs, client name, service tag, industry tag, image gallery uploader with drag-and-drop reordering.
  - **Testimonials & Clients Manager:** Logo uploader, client quote text, position, display order.

- [x] **Task 5.4: Site Settings Manager**
  - Key-value editor for global contact phone numbers, emails, office address, working hours, and social media handles.
  - Instant cache invalidation upon settings update.

---

## Phase 6: Non-Functional Requirements, SEO & Performance

> **Goal:** Ensure top-tier performance on Ethiopian mobile connections, complete search engine indexing, and accessibility.

- [ ] **Task 6.1: Core Web Vitals & Performance Optimization**
  - Target 90+ Lighthouse score across Desktop and Mobile.
  - Image optimization: Automated conversion to WebP/AVIF format with responsive `sizes` attributes.
  - Dynamic code splitting and font optimization for Ethiopic glyphs to prevent layout shifts (CLS < 0.1).
  - Zero-blocking third-party scripts.

- [ ] **Task 6.2: Trilingual SEO & Structured Data**
  - Dynamic `hreflang` tags on all pages for `en`, `am`, and `om`.
  - Canonical URL management preventing duplicate content penalties across locales.
  - Schema.org JSON-LD structured data:
    - `LocalBusiness` / `PrintShop` schema (address, coordinates, opening hours, phone).
    - `Article` schema for blog posts.
  - Dynamic generation of `sitemap.xml` and `robots.txt`.

- [ ] **Task 6.3: Accessibility (WCAG 2.1 AA) & Cross-Browser Verification**
  - Keyboard navigability across all modals, drawers, and form fields.
  - Color contrast ratio compliance across all 4 theme states (`light`, `dark`, `night`, `system`).
  - Screen reader accessible `aria-*` labels on icon buttons and theme switchers.

---

## Phase 7: Deployment, Handover & Launch

> **Goal:** Ship the production environment, verify integrations, and provide documentation for the GT team.

- [ ] **Task 7.1: Production Deployment Configuration**
  - Production build verification (`npm run build`).
  - Environment variables provisioning on hosting platform:
    - `MONGODB_URI`
    - `NEOGRAM_BOT_TOKEN`
    - `TELEGRAM_CHAT_ID`
    - `NEXTAUTH_SECRET` / `AUTH_SECRET`
    - `NEXT_PUBLIC_SITE_URL`
  - MongoDB Atlas production cluster configuration with automated daily snapshots.

- [ ] **Task 7.2: End-to-End Integration Testing**
  - Test quote form submission on real mobile device with Ethiopian phone number.
  - Verify instant Neogram Telegram notification delivery in target Telegram group.
  - Verify database record creation and admin dashboard synchronization.
  - Verify language switching, theme switching persistence, and contact link triggers.

- [ ] **Task 7.3: Admin Documentation & User Manual**
  - Step-by-step user guide for GT Printing staff:
    - How to add new portfolio items and blog posts with Amharic and Afaan Oromo text.
    - How to manage quote inquiries and mark them as contacted/quoted.
    - How to update contact numbers and working hours.

---

## Deliverables Summary

| Deliverable | Description | Location |
|-------------|-------------|----------|
| **Specification** | Complete technical and business PRD | [`gt-printing-website-spec.md`](./gt-printing-website-spec.md) |
| **Implementation Plan** | Phased task roadmap and architectural plan | [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) |
| **Source Code** | Next.js trilingual application with custom admin & theme system | Root workspace |
| **Database Schemas** | Mongoose embedded localization models | `/src/models/*` |
| **Telegram Service** | Neogram alert dispatch module | `/src/lib/neogram.ts` |
| **Admin Manual** | Non-technical staff guide for content updates | `/docs/ADMIN_GUIDE.md` |
