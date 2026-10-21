import { MetadataRoute } from "next";
import { SERVICES_DATA } from "@/data/services";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { BLOG_DATA } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtprintingpress.com";
  const now = new Date();

  // Core static pages
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/capabilities", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/quote", priority: 0.95, changeFrequency: "weekly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}/en${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        en: `${baseUrl}/en${route.path}`,
        am: `${baseUrl}/am${route.path}`,
        om: `${baseUrl}/om${route.path}`,
      },
    },
  }));

  // Service Detail Pages
  const serviceEntries: MetadataRoute.Sitemap = SERVICES_DATA.map((s) => ({
    url: `${baseUrl}/en/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
    alternates: {
      languages: {
        en: `${baseUrl}/en/services/${s.slug}`,
        am: `${baseUrl}/am/services/${s.slug}`,
        om: `${baseUrl}/om/services/${s.slug}`,
      },
    },
  }));

  // Portfolio Detail Pages
  const portfolioEntries: MetadataRoute.Sitemap = PORTFOLIO_DATA.map((p) => ({
    url: `${baseUrl}/en/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
    alternates: {
      languages: {
        en: `${baseUrl}/en/portfolio/${p.slug}`,
        am: `${baseUrl}/am/portfolio/${p.slug}`,
        om: `${baseUrl}/om/portfolio/${p.slug}`,
      },
    },
  }));

  // Blog Detail Pages
  const blogEntries: MetadataRoute.Sitemap = BLOG_DATA.map((b) => ({
    url: `${baseUrl}/en/blog/${b.slug}`,
    lastModified: new Date(b.publishedDate || now),
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: {
      languages: {
        en: `${baseUrl}/en/blog/${b.slug}`,
        am: `${baseUrl}/am/blog/${b.slug}`,
        om: `${baseUrl}/om/blog/${b.slug}`,
      },
    },
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...portfolioEntries,
    ...blogEntries,
  ];
}
