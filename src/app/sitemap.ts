import { MetadataRoute } from "next";
import {
  getDbServices,
  getDbPortfolioProjects,
  getDbBlogPosts,
} from "@/lib/data-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch real services, portfolio and blog items from database
  const [services, portfolioProjects, blogPosts] = await Promise.all([
    getDbServices(),
    getDbPortfolioProjects(),
    getDbBlogPosts(),
  ]);

  // Service Detail Pages
  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
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

  // Portfolio Detail Pages (Database-backed)
  const portfolioEntries: MetadataRoute.Sitemap = portfolioProjects.map((p) => ({
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

  // Blog Detail Pages (Database-backed)
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${baseUrl}/en/blog/${b.slug}`,
    lastModified: now,
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
