import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { type Locale } from "@/types/database";
import { routing } from "@/i18n/routing";
import { dbConnect } from "@/lib/db";
import PortfolioProject from "@/models/PortfolioProject";
import { ProjectDetailView } from "@/components/portfolio/project-detail-view";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    for (const item of PORTFOLIO_DATA) {
      params.push({
        locale,
        slug: item.slug,
      });
    }
  }

  return params;
}

export default async function PortfolioDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  let project: any = PORTFOLIO_DATA.find((p) => p.slug === slug);

  // If not found in static seed, check MongoDB
  if (!project) {
    try {
      await dbConnect();
      const dbProj = await PortfolioProject.findOne({ slug }).lean();
      if (dbProj) {
        const cover = (dbProj as any).galleryUrls?.[0] || "";
        project = {
          slug: (dbProj as any).slug,
          category: (dbProj as any).serviceType || "signage",
          categoryLabel: {
            en: ((dbProj as any).serviceType || "Signage").replace(/-/g, " "),
            am: ((dbProj as any).serviceType || "ሳይኔጅ").replace(/-/g, " "),
            om: ((dbProj as any).serviceType || "Mallattoo").replace(/-/g, " "),
          },
          title: {
            en: (dbProj as any).translations?.en?.title || (dbProj as any).slug,
            am: (dbProj as any).translations?.am?.title || (dbProj as any).translations?.en?.title || (dbProj as any).slug,
            om: (dbProj as any).translations?.om?.title || (dbProj as any).translations?.en?.title || (dbProj as any).slug,
          },
          clientName: (dbProj as any).translations?.en?.clientName || "Corporate Client",
          year: (dbProj as any).year || 2026,
          location: (dbProj as any).translations?.en?.location || "Addis Ababa, Ethiopia",
          summary: {
            en: (dbProj as any).translations?.en?.description || "",
            am: (dbProj as any).translations?.am?.description || (dbProj as any).translations?.en?.description || "",
            om: (dbProj as any).translations?.om?.description || (dbProj as any).translations?.en?.description || "",
          },
          fullDescription: {
            en: (dbProj as any).translations?.en?.description || "",
            am: (dbProj as any).translations?.am?.description || (dbProj as any).translations?.en?.description || "",
            om: (dbProj as any).translations?.om?.description || (dbProj as any).translations?.en?.description || "",
          },
          materialsUsed: (dbProj as any).translations?.en?.materials
            ? (dbProj as any).translations.en.materials.split(",").map((m: string) => m.trim())
            : ["Industrial Offset", "Custom Finishing"],
          coverImage: cover,
          galleryImages: (dbProj as any).galleryUrls && (dbProj as any).galleryUrls.length > 0 ? (dbProj as any).galleryUrls : [cover],
          featured: Boolean((dbProj as any).featured),
          tags: (dbProj as any).tags || [],
          mediaLinks: (dbProj as any).mediaLinks || [],
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <ProjectDetailView project={project} locale={loc} />
    </div>
  );
}
