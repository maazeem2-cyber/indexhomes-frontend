"use client";

import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";

type Tone = "default" | "danger";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      elevated
      title={title}
      description={description}
      onClose={loading ? () => undefined : onCancel}
    >
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" disabled={loading} onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          loading={loading}
          onClick={onConfirm}
          className={
            tone === "danger"
              ? "!bg-gradient-to-b !from-rose-300 !to-rose-500 !text-[#2a0a0f] shadow-[0_10px_28px_-8px_rgba(244,63,94,0.55)]"
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
