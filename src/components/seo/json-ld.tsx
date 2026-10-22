import React from "react";

interface LocalBusinessJsonLdProps {
  locale?: string;
}

export function LocalBusinessJsonLd({ locale = "en" }: LocalBusinessJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PrintShop"],
    name: "GT Printing Press (Advanced Digital Production Printing Plc)",
    alternateName: "ጂቲ ማተሚያ ቤት",
    description:
      "Turnkey commercial printing, publishing, folding carton packaging, UV flatbed printing, and 3D architectural signage fabrication in Addis Ababa, Ethiopia.",
    url: "https://gtprintingpress.com",
    logo: "https://gtprintingpress.com/logo.png",
    image:
      "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
    telephone: "+251911234567",
    email: "info@gtprintingpress.com",
    priceRange: "$$",
    currenciesAccepted: "ETB, USD",
    paymentAccepted: "Cash, Bank Transfer, Telebirr, CBE Birr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Africa Avenue (Bole Road), Behind Edna Mall / Tele Medhanialem",
      addressLocality: "Addis Ababa",
      addressRegion: "Addis Ababa",
      postalCode: "1000",
      addressCountry: "ET",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 8.9954,
      longitude: 38.7885,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "19:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:30",
        closes: "17:00",
      },
    ],
    sameAs: [
      "https://t.me/gtprintingethiopia",
      "https://facebook.com/gtprintingethiopia",
      "https://linkedin.com/company/gt-printing-press-ethiopia",
    ],
    areaServed: [
      {
        "@type": "Country",
        name: "Ethiopia",
      },
      {
        "@type": "City",
        name: "Addis Ababa",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Commercial Printing & Fabrication Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Offset & High-Speed Digital Printing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Publishing, Softcover & Hardcover Book Binding",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Rigid Box, Folding Carton & Food-Grade Packaging",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "3D Illuminated Channel Letter Signage & CNC Laser Fabrication",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  coverImage: string;
  author: string;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  publishedDate,
  coverImage,
  author,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: coverImage,
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://gtprintingpress.com/en/blog/${slug}`,
    },
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "GT Printing Press",
      logo: {
        "@type": "ImageObject",
        url: "https://gtprintingpress.com/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
