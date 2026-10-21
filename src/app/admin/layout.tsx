import type { Metadata } from "next";
import { sansFont } from "@/app/fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "GT Admin Console | Turnkey Commercial Print Management",
  description: "Secure CMS and Lead Management Dashboard for GT Printing Press.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={sansFont.variable}>
      <head>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
