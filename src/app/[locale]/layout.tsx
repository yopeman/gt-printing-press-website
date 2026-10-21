import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { sansFont, ethiopicFont } from "@/app/fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "GT Printing Press | Turnkey Commercial Print, Packaging & 3D Signage",
  description:
    "Design, print, fabricate, and install all under one roof in Addis Ababa, Ethiopia. High-speed digital, commercial offset, UV flatbed, laser cutting, CNC, and architectural 3D signage.",
  keywords: [
    "Printing Press Ethiopia",
    "Commercial Printing Addis Ababa",
    "Signage Ethiopia",
    "3D Channel Letter Signage",
    "Packaging Boxes Addis Ababa",
    "Offset Printing",
    "Digital Printing Bole",
    "GT Printing Press",
  ],
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
