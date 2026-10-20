# GT Printing Press — Website Project Document

**Version:** 1.0 (Draft) | **Date:** October 20, 2026

---

## 1. Project Overview

**Client:** GT Printing Press (legal name: Advanced Digital Production Printing Plc / GT Printing Plc)
**Established:** 2000 E.C. (Ethiopian Calendar), roughly 2007/2008 G.C.
**Head office:** 2nd Floor, Behind Dembel City Centre, Africa Avenue (Bole Road), Addis Ababa, Ethiopia
**Map:** https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8
**Operating footprint:** Corporate design office on Africa Avenue plus an industrial fabrication workshop in Addis Ababa.

GT Printing is an indigenous commercial printing, packaging and architectural signage company. It offers turnkey visual branding by unifying design, print production, structural fabrication and finishing under one roof.

### 1.1 Website Purpose

A trilingual (English, Amharic, Afaan Oromo) corporate website that converts business visitors into quote requests, proves GT's in-house capability and credibility, and gives GT's team an admin panel to manage content without a developer.

### 1.2 Core Goals

| # | Goal | How the site delivers it |
|---|------|--------------------------|
| 1 | **Facilitate instant online inquiries** | A quote/order form reachable from every page, feeding straight into Telegram so the team can quote the same working day. |
| 2 | **Showcase in-house production capability** | A dedicated Capabilities page and machine list showing digital, offset, UV flatbed, laser cutting, CNC and large-format work are all done internally (no outsourcing). |
| 3 | **Display a verified portfolio** | A Portfolio page with real corporate branding and signage projects completed across Ethiopia. |
| 4 | **Provide industry insights and technical guidance** | The GT Printing Blog: artwork preparation, production trends, AI's impact on design workflows. |

---

## 2. Brand & Design Direction

- **Brand colors:** Red, Black, White (use the client's existing logo and brand guidelines).
- **Suggested usage:** White as the dominant background, black for text and footer, red reserved for CTAs, highlights and key accents. This keeps the site clean and professional and makes the "Request a Quote" button stand out.
- **Tone:** Professional, technical, confident, fast and reliable.
- **Imagery:** Real photos of the machines, workshop, finished jobs and installed signage. Avoid generic stock photos wherever possible.
- **Typography:** Must support Latin and Ethiopic (Ge'ez) scripts well (e.g. Noto Sans / Noto Sans Ethiopic). Test Amharic text rendering and line height carefully.
- **Responsive:** Mobile-first. A large share of Ethiopian traffic is on mobile and on slower connections, so optimize images and keep pages light.

---

## 3. Languages (i18n)

| Language | Code | Notes |
|----------|------|-------|
| English | `en` | Default |
| Amharic (አማርኛ) | `am` | Ethiopic script |
| Afaan Oromo (Oromiffa) | `om` | Latin script (Qubee) |

Requirements:

- Language switcher in the header, remembered per visitor.
- URL structure by locale, e.g. `/en/...`, `/am/...`, `/om/...` (good for SEO).
- All static UI text is stored in translation files.
- Dynamic content (blog posts, portfolio items, testimonials) supports a per-language version in the admin panel. If a translation is missing, fall back to English.
- Professional human translation is recommended for Amharic and Afaan Oromo, especially for technical printing terms.

---

## 4. Sitemap

```
Home
├── About Us (Company, History, Mission & Vision, Key Achievements)
├── Services
│   ├── Offset & Digital Printing
│   ├── Publishing & Binding
│   ├── Packaging Solutions
│   ├── Large Format & Signage
│   ├── Graphic Design & Pre-Press
│   └── Corporate & Promotional Items
├── Capabilities (In-house production & machinery)
├── Industries We Serve
├── Portfolio
│   └── Project detail page
├── Clients & Testimonials
├── Blog
│   └── Blog post detail page
├── Request a Quote (Order form)
└── Contact
```

---

## 5. Page-by-Page Content

### 5.1 Home
- Hero: headline emphasizing "Design, print, fabricate and install, all under one roof", with a primary **Request a Quote** button and a secondary **View Portfolio** button.
- Quick trust strip: "Same-day quotes", "100% in-house production", "Since 2000 E.C.".
- Services overview (6 cards).
- "Why GT" differentiators (see 5.2).
- Featured portfolio items (3 to 6).
- Client logo strip.
- Testimonials slider.
- Latest blog posts (3).
- Closing quote CTA.

### 5.2 About Us
- Business introduction and company profile.
- Story: GT was created to remove the friction of coordinating separate design agencies, print presses and finishing shops. It invested early in high-speed digital engines, then expanded into an industrial fabrication facility (CNC routers, UV flatbeds) to build 3D signs and large-format media in-house.
- **Mission:** To provide a unified, cost-effective and technically reliable print and signage production line that saves clients time and money while preserving brand standards.
- **Vision:** To be Ethiopia's foremost technology-driven commercial print and fabrication partner, setting regional standards for speed, material quality and turnkey delivery.
- **Key achievements:**
  - Integrated in-house model with no third-party outsourcing.
  - Institutional client trust through recurring contracts with leading financial institutions, diplomatic missions and humanitarian agencies.
  - Same-working-day quoting and fast digital proof-to-print execution.
- **Key differentiators:**
  1. Complete in-house execution (no outsourcing).
  2. Hybrid paper-to-structural scope: stationery and 3D architectural signage under one supplier.
  3. Rigorous proofing: soft-proof validation plus mandatory hard-copy proofs for color-critical work.
  4. Human-driven estimates: every job reviewed by a production technician who advises on paper, finishes and methods.

### 5.3 Services
One overview page plus one detail page per service. Each detail page includes a description, typical products, available finishes and options, a photo gallery, related portfolio items, and a "Request a quote for this service" button that pre-selects the service in the form.

| Service | Includes |
|---------|----------|
| **Offset & Digital Printing** | High-volume commercial offset; fast digital printing for short runs; variable-data printing. Business cards, brochures, flyers, folded leaflets, certificates, diplomas, menus, takeaway sleeves, presentation folders. |
| **Publishing & Binding** | Books, magazines, brochures, annual reports, company profiles, catalogs, newsletters; saddle-stitching, perfect binding and other binding options. |
| **Packaging Solutions** | Custom product boxes, industrial packaging, paper bags, labels, packaging cartons; die-cutting and kiss-cutting. |
| **Large Format & Signage** | Banners, billboards, 3D channel-lit shopfront signs, lightboxes, acrylic directional displays, rigid foam boards, roll-up banners, posters, vehicle wraps and branding. |
| **Graphic Design & Pre-Press** | Creative layout, typesetting, plate-making, prepress file vetting, digital branding support. |
| **Corporate & Promotional Items** | Business cards, letterheads, folders, calendars, promotional t-shirts, gift items. |

### 5.4 Capabilities (In-House Production)
Purpose: prove GT does not outsource.

- **Processes:** digital production printing, commercial offset, UV flatbed printing, laser cutting, CNC routing, large-format printing, thermal lamination, kiss/die-cutting, saddle-stitching, perfect binding.
- **Machinery:**

| Category | Equipment |
|----------|-----------|
| Offset presses | Heidelberg Speedmaster, Komori Lithrone, Manroland ROLAND Series |
| Cutting | Polar Mohr Guillotines |
| Folding | MBO / Horizon Folding Machines |
| Binding | Horizon / Müller Martini Perfect Binders; Duplo Bookletmakers |
| Finishing | Autobond / Komfi Laminators |

- Workflow diagram: Design → Pre-press and proofing → Print → Finishing / Fabrication → Delivery / Installation.
- Proofing process explanation (soft proof, hard-copy proof for color-critical work).
- Photo and video tour of the facility.

### 5.5 Industries We Serve
- **Schools & Educational Institutions:** textbooks, exams, catalogs, certificates.
- **Medical Facilities:** sensitive corporate stationery, reports, administrative forms.
- **Corporate & Event Branding:** business cards, exhibition displays, 3D shopfront signs, roll-up banners, rapid-turnaround regional campaign materials.
- **Also served:** financial institutions, diplomatic missions, NGOs, telecom and airlines.

### 5.6 Portfolio
- Filterable grid by service and industry (e.g. Signage, Packaging, Publishing, Corporate Branding).
- Project detail page: title, client (if permitted), description, services used, materials and finishes, location, year, image gallery and optional video.
- Content is managed by the admin (see section 8). "Verified" means only real GT-completed projects are listed.

### 5.7 Clients & Testimonials
- Client logo wall and testimonials, both managed by the admin.
- Clients listed by the client:
  - **Aviation & Telecom:** Ethiopian Airlines, ethio telecom, Safaricom Ethiopia
  - **Banking & Finance:** Awash Bank, Oromia Bank (and other regional institutions)
  - **Consumer brands & hospitality:** Coca-Cola, Marriott
  - **Diplomatic & aid missions:** The British Embassy, UNHCR
- Testimonial fields: quote, person name, role, company, photo or logo (optional), language.

### 5.8 Blog (GT Printing Blog)
- Post list with categories and tags, search, and pagination.
- Post page: title, author, date, cover image, rich content, related posts, and a quote CTA at the end.
- Suggested topics: preparing print-ready artwork (bleed, color modes, resolution, fonts), paper and finish guidance, packaging tips, how AI affects design workflows, signage materials, case studies.
- SEO fields per post (meta title, description, slug) and share buttons.

### 5.9 Request a Quote (Order Form)
The primary conversion point. See section 6.

### 5.10 Contact
- Address, embedded map (link to the Google Maps location), working hours, phone numbers, email.
- Social links and Telegram chat/group/channel links (see section 9).
- A short general contact form (optional, can reuse the Telegram pipeline).

---

## 6. Quote / Order Form Specification

The form appears on a dedicated page and as a quick modal or section accessible from every page. It is built to be short enough to finish on a phone.

### 6.1 Fields

**Step 1: Service type** (required, select)
- Offset & Digital Printing
- Publishing & Binding
- Packaging Solutions
- Large Format & Signage
- Graphic Design & Pre-Press
- Corporate & Promotional Items
- Other / Not sure

**Step 2: Name and contact information**
| Field | Required | Validation |
|-------|----------|------------|
| Full name | Yes | 2 to 100 characters |
| Company / organization | No | |
| Phone number | Yes | Ethiopian formats (+251 / 09 / 07) |
| Email | Optional or required (client to decide) | Valid email |
| Preferred contact method | No | Phone / Telegram / Email |

**Step 3: Specification**
| Field | Required | Notes |
|-------|----------|-------|
| Project description / specifications | Yes | Free text: size, quantity, paper or material, colors, finishes, binding, etc. |
| Quantity | No | |
| Needed-by date | No | Helps with timelines |
| Artwork status | No | I have artwork / I need design help |
| File attachments | No | Limit size and types (PDF, AI, PSD, JPG, PNG, ZIP) |

Plus a hidden honeypot field and a consent note about contacting the person.

### 6.2 Behavior
- Inline validation in the visitor's selected language.
- On submit: success message such as "Thank you, our team will respond with a quote on the same working day", with a reference number.
- The service pre-fills when the visitor arrives from a service page.
- The submission is **saved in the database** (so no inquiry is lost if Telegram is down) **and** sent to Telegram.
- Spam protection: honeypot, rate limiting per IP, and CAPTCHA (e.g. Cloudflare Turnstile or reCAPTCHA) if abuse appears.

---

## 7. Telegram Notification Integration

Each form submission triggers an instant notification to GT's Telegram.

- **Library:** the request mentions "neogram"; the standard Node.js Telegram bot packages are **Telegraf** and **node-telegram-bot-api**. Please confirm which one is intended. This document assumes **Telegraf**, which is well maintained and TypeScript-friendly.
- **Setup:**
  1. Create the bot via **@BotFather** and store the token as an environment variable (`TELEGRAM_BOT_TOKEN`).
  2. Add the bot to GT's internal Telegram group (or direct chat) and store the target chat ID (`TELEGRAM_CHAT_ID`).
  3. The server sends the message after saving the submission. Failures are logged and retried; the admin dashboard shows the delivery status.
- **Sample message format:**

```
🆕 New Quote Request  #GT-2026-0142

🛠 Service: Large Format & Signage
👤 Name: Abebe Kebede
🏢 Company: Example PLC
📞 Phone: +251 9XX XXX XXX
✉️ Email: abebe@example.com

📝 Specification:
3D channel-lit sign, 4m x 1m, red acrylic...

📅 Needed by: 2026-11-05
📎 Files: 2 attached
🌐 Language: Amharic
🕒 Submitted: 2026-10-20 16:42
```

- Optional: inline buttons such as "Mark as contacted", and sending uploaded files to the chat.
- **Security:** the bot token is never exposed to the browser. All Telegram calls happen on the server.

---

## 8. Admin Panel (Content Management)

A secure, login-protected admin area so GT staff can manage content without a developer.

### 8.1 Managed Content
| Module | Fields / abilities |
|--------|--------------------|
| **Blog posts** | Title, slug, cover image, rich-text body, category/tags, language versions, SEO fields, draft / scheduled / published status |
| **Portfolio projects** | Title, description, client (optional), service, industry, year, images / video, language versions, featured flag, order |
| **Testimonials** | Quote, name, role, company, photo/logo, language versions, published flag |
| **Clients (logos)** | Name, logo, display order |
| **Quote requests** | List, search, filter by status (New / Contacted / Quoted / Won / Lost), notes, CSV export |
| **Site settings** | Phone numbers, email, address, social links, Telegram links, working hours |
| **Users** | Admin and Editor roles, password reset |

### 8.2 Requirements
- Rich-text editor with image upload (and image optimization and resizing on upload).
- Multi-language editing with tabs for EN / AM / OM.
- Preview before publishing.
- Role-based access: **Admin** (full access) and **Editor** (blog, portfolio, testimonials only).
- Secure authentication (hashed passwords, session or JWT, optional 2FA for admins).
- Activity log for key actions.

---

## 9. Contact & Social Media

Placeholders below, to be filled in with GT's actual details.

| Channel | Link / Value |
|---------|--------------|
| Phone numbers | `+251 …` (to be provided) |
| Email | `…@…` (to be provided) |
| LinkedIn | (to be provided) |
| Instagram | (to be provided) |
| TikTok | (to be provided) |
| YouTube | (to be provided) |
| Telegram: chat | (to be provided) |
| Telegram: group | (to be provided) |
| Telegram: channel | (to be provided) |
| Location | https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8 |

Placement: header (phone and quote button), footer (all links), contact page, and a floating Telegram/phone quick-contact button on mobile.

---

## 10. Non-Functional Requirements

- **Performance:** Target Lighthouse 90+; lazy-loaded, compressed WebP/AVIF images; lightweight pages for slow mobile networks.
- **SEO:** Per-language meta tags and `hreflang`, clean URLs, sitemap.xml, robots.txt, structured data (`LocalBusiness`, `Article`), Open Graph images. Register with Google Search Console and Google Business Profile.
- **Accessibility:** WCAG 2.1 AA basics: contrast, keyboard navigation, alt text, form labels.
- **Security:** HTTPS everywhere, input validation and sanitization, rate limiting, secure headers, protection against XSS / CSRF / SQL injection, secrets in environment variables, file upload scanning and limits.
- **Reliability:** Daily database and media backups, uptime monitoring, error logging.
- **Privacy:** Privacy policy page, a clear note on how submitted data is used, and the ability to delete a submission on request.
- **Analytics:** Privacy-friendly analytics (e.g. Plausible) or Google Analytics, tracking quote-form submissions as the main conversion.

---

## 11. Suggested Technical Stack

This is a recommendation; adjust to your team's skills.

| Layer | Suggestion |
|-------|------------|
| Frontend | **Next.js** and Tailwind CSS |
| i18n | `next-intl` (or `next-i18next`) with `en`, `am`, `om` locales |
| Backend / API | Next.js API routes |
| Database | MongoDB |
| CMS / Admin | Custom admin built into the app |
| Telegram | **Neogram** |
| File storage | base64 url and store in mongodb as string |
| Hosting | Vercel + Mongo Atlas |

---

## 12. Data Model (High Level)

- **User**: id, name, email, passwordHash, role
- **QuoteRequest**: id, reference, serviceType, name, company, phone, email, preferredContact, specification, quantity, neededBy, artworkStatus, locale, status, notes, telegramStatus, createdAt
- **Attachment**: id, quoteRequestId, fileUrl, fileName, size
- **BlogPost**: id, slug, coverImage, categoryId, status, publishedAt; **BlogPostTranslation**: postId, locale, title, excerpt, body, seoTitle, seoDescription
- **PortfolioProject**: id, slug, serviceType, industry, year, featured, order; **PortfolioTranslation**: projectId, locale, title, description; **ProjectImage**: projectId, url, order
- **Testimonial** + **TestimonialTranslation**
- **Client**: id, name, logoUrl, order
- **SiteSetting**: key, value
- for Spec models: BlogPost, BlogPostTranslation, PortfolioProject, PortfolioTranslation Better Mongo Pattern (Embedded Localization) like:
```json
{
  "slug": "offset-printing-guide",
  "coverImage": "https://...",
  "category": "Pre-press",
  "translations": {
    "en": { "title": "...", "excerpt": "...", "body": "..." },
    "am": { "title": "...", "excerpt": "...", "body": "..." },
    "om": { "title": "...", "excerpt": "...", "body": "..." }
  },
  "status": "published",
  "publishedAt": "2026-10-20T16:00:00Z"
}
```
