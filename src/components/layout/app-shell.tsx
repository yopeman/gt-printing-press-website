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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenQuoteModal = () => {
    setQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setQuoteModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Accessible Skip Link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Navbar */}
      <Navbar
        onOpenQuoteModal={handleOpenQuoteModal}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />

      {/* Main Page Body (offset for fixed top header: h-16 sm:h-20) */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none pt-16 sm:pt-20">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Quick-Contact Floating Dock (hidden when mobile drawer or modal is open) */}
      {!mobileMenuOpen && !quoteModalOpen && (
        <MobileQuickDock onOpenQuoteModal={handleOpenQuoteModal} />
      )}

      {/* Global Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuoteModal}
      />
    </div>
  );
}
