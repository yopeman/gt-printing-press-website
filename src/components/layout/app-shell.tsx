"use client";

import React, { useState } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { MobileQuickDock } from "./mobile-quick-dock";
import { QuickQuoteModal } from "@/components/quote/quick-quote-modal";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => {
    setQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setQuoteModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Main Page Body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Mobile Quick-Contact Floating Dock */}
      <MobileQuickDock onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Global Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuoteModal}
      />
    </div>
  );
}
