"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/Button";
import { XIcon } from "@/components/icons";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  elevated?: boolean;
};

const MODAL_ROOT_ATTR = "data-ih-modal-root";

/** Removes leaked modal portals and unlocks body scroll (safe after route changes). */
export function cleanupModalArtifacts() {
  if (typeof document === "undefined") return;
  document.querySelectorAll(`[${MODAL_ROOT_ATTR}]`).forEach((node) => node.remove());
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  wide,
  elevated,
}: ModalProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      // Wait a frame so this portal can unmount before we decide.
      requestAnimationFrame(() => {
        const stillOpen = document.querySelector(`[${MODAL_ROOT_ATTR}]`);
        document.body.style.overflow = stillOpen ? "hidden" : prevOverflow || "";
      });
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  // Instant mount/unmount (no AnimatePresence). Exit animations on body portals
  // commonly leak after Next.js client navigations and leave a stuck blur overlay.
  return createPortal(
    <div
      {...{ [MODAL_ROOT_ATTR]: "" }}
      className={`fixed inset-0 flex items-end justify-center p-3 sm:items-center sm:p-6 ${
        elevated ? "z-[90]" : "z-[80]"
      }`}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#040a14]/80"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-[1] max-h-[90vh] w-full overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#0c1a2e] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="font-display text-xl font-semibold tracking-tight">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-mist">{description}</p> : null}
          </div>
          <IconButton label="Close" onClick={onClose} className="!h-9 !w-9 shrink-0">
            <XIcon className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
