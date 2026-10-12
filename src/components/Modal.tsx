"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@/components/Button";
import { XIcon } from "@/components/icons";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function Modal({ open, title, description, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-[#040a14]/72 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-[1] max-h-[90vh] w-full overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#0c1a2e]/95 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl ${
              wide ? "max-w-3xl" : "max-w-xl"
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <h2 id="modal-title" className="font-display text-xl font-semibold tracking-tight">
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
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
