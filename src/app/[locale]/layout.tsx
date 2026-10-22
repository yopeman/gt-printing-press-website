import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { sansFont, ethiopicFont } from "@/app/fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import "@/app/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtprintingpress.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GT Printing Press | Commercial Print, Packaging & 3D Signage Addis Ababa",
    template: "%s | GT Printing Press",
  },
  description:
    "Design, print, fabricate, and install all under one roof in Addis Ababa, Ethiopia. High-speed digital, commercial offset, UV flatbed, laser cutting, CNC, and architectural 3D signage.",
  keywords: [
    "Printing Press Ethiopia",
    "Commercial Printing Addis Ababa",
    "Signage Ethiopia",
    "3D Channel Letter Signage",
    "Packaging Boxes Addis Ababa",
    "Offset Printing Bole Road",
    "Digital Printing Ethiopia",
    "GT Printing Press",
    "Advanced Digital Production Printing Plc",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      am: "/am",
      om: "/om",
    },
  },
  openGraph: {
    title: "GT Printing Press | Commercial Print, Packaging & 3D Signage",
    description: "Design, print, fabricate, and install under one roof on Bole Road, Addis Ababa.",
    url: siteUrl,
    siteName: "GT Printing Press",
    images: [
      {
        url: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "GT Printing Press Industrial Equipment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GT Printing Press | Commercial Print & Signage",
    description: "Commercial offset, packaging, and 3D architectural signage in Addis Ababa.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming locale is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${sansFont.variable} ${ethiopicFont.variable}`}
    >
      <head>
        {/* Schema.org LocalBusiness & PrintShop Structured Data */}
        <LocalBusinessJsonLd locale={locale} />

        {/* Anti-FOUC script for instant theme rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = stored || (supportDark ? 'dark' : 'light');
                  if (theme === 'system') {
                    document.documentElement.setAttribute('data-theme', supportDark ? 'dark' : 'light');
                  } else {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AppShell>{children}</AppShell>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
