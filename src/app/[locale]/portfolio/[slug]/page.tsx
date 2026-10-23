import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/types/database";
import { routing } from "@/i18n/routing";
import { getDbPortfolioProjectBySlug, getDbPortfolioProjects } from "@/lib/data-service";
import { ProjectDetailView } from "@/components/portfolio/project-detail-view";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  try {
    const projects = await getDbPortfolioProjects();
    for (const locale of routing.locales) {
      for (const item of projects) {
        params.push({
          locale,
          slug: item.slug,
        });
      }
    }
  } catch (err) {
    console.error("Error in generateStaticParams for portfolio:", err);
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

  // Query database first
  const project = await getDbPortfolioProjectBySlug(slug);

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
