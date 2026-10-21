"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
  maxWidth = "lg",
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync open/close state with HTMLDialogElement
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle native cancel (Esc key) and light-dismiss fallback for browsers lacking closedby support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    // Fallback for browsers without native closedby support
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInside) {
        onClose();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleBackdropClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  const maxWidthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <dialog
      ref={dialogRef}
      // Declarative light-dismiss (Baseline Newly Available)
      {...({ closedby: "any" } as any)}
      aria-labelledby={title ? "modal-dialog-title" : undefined}
      aria-describedby={description ? "modal-dialog-desc" : undefined}
      className={`fixed inset-0 m-auto p-0 rounded-3xl bg-surface border border-border shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm backdrop:overflow-hidden backdrop:overscroll-contain overscroll-contain w-full ${maxWidthMap[maxWidth]} ${className}`}
    >
      <div className="p-6 sm:p-8 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            {title && (
              <h3
                id="modal-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                id="modal-dialog-desc"
                className="text-xs text-foreground-muted mt-0.5"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative">{children}</div>
      </div>
    </dialog>
  );
}
