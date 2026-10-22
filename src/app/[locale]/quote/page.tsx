"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MultiStepQuoteForm } from "@/components/quote/multi-step-quote-form";

function QuotePageContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "offset-digital-printing";

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <MultiStepQuoteForm initialService={initialService} />
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <QuotePageContent />
    </Suspense>
  );
}
