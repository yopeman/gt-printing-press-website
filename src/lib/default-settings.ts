export const DEFAULT_SETTINGS = {
  companyName: "GT Printing Press (Advanced Digital Production Printing Plc)",
  turnaroundGuarantee: "Same-Working-Day Estimation Guarantee",
  // 1. Dynamic Contact Endpoints
  contactEndpoints: [
    {
      id: "ep-1",
      title: "Direct Sales Desk & Estimations",
      type: "phone",
      value: "+251 91 123 4567",
    },
    {
      id: "ep-2",
      title: "PBX Corporate Switchboard",
      type: "phone",
      value: "+251 11 550 5050",
    },
    {
      id: "ep-3",
      title: "1-Tap Sales Telegram Desk",
      type: "telegram",
      value: "@gtprintadmin",
    },
    {
      id: "ep-4",
      title: "Corporate Procurement Email",
      type: "email",
      value: "info@gtprinting.et",
    },
    {
      id: "ep-5",
      title: "Direct Quotations Email",
      type: "email",
      value: "sales@gtprinting.et",
    },
    {
      id: "ep-6",
      title: "WhatsApp Sales Channel",
      type: "whatsapp",
      value: "+251 91 123 4567",
    },
  ],
  // 2. Dynamic Social Media Links
  socialLinks: [
    {
      id: "soc-1",
      platform: "telegram",
      title: "Telegram Channel",
      url: "https://t.me/gtprintingpress",
    },
    {
      id: "soc-2",
      platform: "linkedin",
      title: "LinkedIn",
      url: "https://linkedin.com/company/gtprinting",
    },
    {
      id: "soc-3",
      platform: "instagram",
      title: "Instagram",
      url: "https://instagram.com/gtprinting_et",
    },
    {
      id: "soc-4",
      platform: "facebook",
      title: "Facebook",
      url: "https://facebook.com/gtprintingethiopia",
    },
    {
      id: "soc-5",
      platform: "youtube",
      title: "YouTube Channel",
      url: "https://youtube.com/@gtprinting",
    },
    {
      id: "soc-6",
      platform: "tiktok",
      title: "TikTok",
      url: "https://tiktok.com/@gtprinting",
    },
  ],
  // 3. Dynamic Company Locations & Operating Hours
  locations: [
    {
      id: "loc-1",
      label: "Head Office",
      name: "Africa Avenue (Bole Road) Corporate Facility",
      address: "2nd Floor, Behind Dembel City Centre, Africa Avenue, Kirkos Sub-City, Addis Ababa, Ethiopia",
      phone: "+251 11 550 5050",
      mapUrl: "https://maps.app.goo.gl/AZBm7RVfoex7ZR6M8",
      latitude: 8.9954,
      longitude: 38.7885,
      operatingHours: {
        weekday: "Monday – Friday: 8:00 AM – 7:30 PM",
        saturday: "Saturday: 8:30 AM – 5:00 PM",
        sunday: "Sunday: Closed (Online quote inquiries accepted 24/7)",
      },
      isPrimary: true,
    },
    {
      id: "loc-2",
      label: "Production Workshop",
      name: "Industrial Printing & Large Format Fabrication Plant",
      address: "Industrial Zone, Kality Industrial Sub-City, Addis Ababa, Ethiopia",
      phone: "+251 91 123 4567",
      mapUrl: "https://maps.google.com",
      latitude: 8.9214,
      longitude: 38.7422,
      operatingHours: {
        weekday: "Monday – Saturday: 24-Hour Production Shifts",
        saturday: "Saturday: Active Press Shifts",
        sunday: "Sunday: Scheduled Volume Production",
      },
      isPrimary: false,
    },
  ],
  // Telegram Bot Alert Credentials (stored in DB instead of only .env.local)
  telegramBotToken: "8794816879:AAG6ddrnVUo_hG4EDq4Nu7yKGkwA13g1tcg",
  telegramChatId: "@post_timir_content",
  // Legacy compatibility fallbacks
  phonePrimary: "+251 91 123 4567",
  phoneSecondary: "+251 11 550 5050",
  emailGeneral: "info@gtprinting.et",
  emailQuotes: "sales@gtprinting.et",
  telegramChannel: "https://t.me/gtprintingpress",
  telegramAdminDesk: "@gtprintadmin",
  addressBole: "2nd Floor, Behind Dembel City Centre, Africa Avenue, Addis Ababa, Ethiopia",
  latitude: 8.9954,
  longitude: 38.7885,
  workingHoursWeekday: "Monday – Friday: 8:00 AM – 7:30 PM",
  workingHoursSaturday: "Saturday: 8:30 AM – 5:00 PM",
  workingHoursSunday: "Sunday: Closed (Online quote inquiries accepted 24/7)",
};
