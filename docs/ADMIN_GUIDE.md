# GT Printing Press — Administrator & Staff Operations Manual

Welcome to the internal administration and content management guide for **GT Printing Press** (*Advanced Digital Production Printing Plc*).

---

## 1. Accessing the Admin Console

- **Console URL:** `https://your-domain.com/admin` (or `http://localhost:3000/admin/login` in development)
- **Initial Default Credentials:**
  - **Email:** `admin@gtprintingpress.com`
  - **Password:** `gtadmin2026!`
  *(You can configure custom staff credentials via environment variables `ADMIN_DEFAULT_EMAIL` and `ADMIN_DEFAULT_PASSWORD`)*

---

## 2. Lead Management & Quote Pipeline (`/admin/quotes`)

When prospective clients submit inquiries via the website or mobile quick dock, they immediately arrive here and trigger a synchronized notification into the GT Telegram desk.

### Pipeline Workflow:
1. **New:** Fresh submission awaiting staff review. An actionable amber indicator highlights incoming inquiries.
2. **Contacted:** A sales technician has initiated contact via phone call (`tel:+251...`) or direct Telegram chat (`t.me/+251...`).
3. **Quoted:** Official price estimate and paper/finishing options have been issued to the client.
4. **Won:** The client has accepted the quotation, deposit has been settled, and the job is sent to prepress/plate-making.
5. **Lost:** Inquiries where client project was postponed or canceled.

### Features:
- **Lead Inspection:** Click **Details** or any table row to view full job specifications, quantity brackets, needed-by timeline, attached artwork, and cloud Drive links.
- **Internal Staff Notes:** Record quote pricing sent (e.g. `ETB 45,000 for 2,000 booklets, 150gsm art paper`) directly in the notes drawer and click **Save Note**.
- **CSV Export:** Click **Export All Leads (CSV)** in the top right to download a spreadsheet compatible with Microsoft Excel and Google Sheets.

---

## 3. Trilingual Content Management

GT Printing Press supports three official languages:
- **English (`EN`)**
- **Amharic (`AM`)** — አማርኛ
- **Afaan Oromoo (`OM`)**

### 3.1 Publishing Blog Articles (`/admin/blog`)
1. Click **Create Article**.
2. Set the URL slug (e.g. `print-ready-artwork-preparation-guide`).
3. Select the technical category (Commercial Printing, Pre-Press, Materials & Luxury Finishes, Large Format, Packaging Technology).
4. Provide a cover image URL (1200x630 or 16:9 ratio recommended).
5. Switch between the **English**, **አማርኛ**, and **Afaan Oromoo** tabs to input localized titles, excerpts, and markdown body copy.
6. Toggle status between **Published** (immediately visible on site) or **Draft**.

### 3.2 Showcasing Portfolio Projects (`/admin/portfolio`)
1. Click **Add Project**.
2. Specify the URL slug, service category (Offset, Packaging, 3D Signage, etc.), and industry (Banking, Aviation, Diplomatic, FMCG, Corporate).
3. Check **Feature on Home Showcase** to display the project on the homepage's verified work reel.
4. Enter high-resolution image URLs (one per line).
5. Fill in localized titles, descriptions, client name, and materials used across the **EN**, **AM**, and **OM** tabs.

### 3.3 Managing Testimonials (`/admin/testimonials`)
1. Add client feedback from institutional partners (banks, airlines, NGOs).
2. Input client name, position, company, and localized quote text.
3. Toggle between **Live** and **Draft**.

---

## 4. Managing Site Settings (`/admin/settings`)

*(Restricted to users with the `admin` role)*

Update business endpoints without editing code:
- **Phones:** Primary mobile / Telegram phone and workshop landlines.
- **Emails:** General information and sales quotes dispatch addresses.
- **Telegram Channels:** Public channel handle and sales desk handle.
- **Bole Road Location:** Physical facility address, GPS latitude, and longitude for Google Maps routing.
- **Operating Hours:** Weekday, Saturday, and Sunday workshop schedules.

---

## 5. Technical Support & In-House Production

GT Printing Press Production Facility:
- **Address:** Africa Avenue (Bole Road), Behind Edna Mall / Tele Medhanialem, Addis Ababa, Ethiopia.
- **Direct Workshop Line:** `+251 11 550 5050`
