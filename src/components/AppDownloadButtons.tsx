"use client";

import { useToast } from "@/components/Toast";

function AppleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.83ZM13 3.5c.72-.83 1.2-1.98 1.07-3.13-1.03.04-2.28.69-3.02 1.55-.66.76-1.23 1.98-1.08 3.15 1.14.09 2.31-.58 3.03-1.57Z" />
    </svg>
  );
}

/** Google Play mark (Ionicons geometry) */
function PlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <path
        fill="#00F076"
        d="M48 59.49v393a4.33 4.33 0 0 0 7.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0 0 48 59.49z"
      />
      <path
        fill="#FF3A44"
        d="M345.8 174 89.22 32.64l-.16-.09c-19.14-11.13-33.34-5.24-33.34 13v.13l211.55 130.2z"
      />
      <path
        fill="#00D3FF"
        d="m364.84 253.6-53.34-53.34 53.39-53.4c19.15-11.11 33.34-5.22 33.34 13v80.74c0 18.22-14.19 24.12-33.39 13z"
      />
      <path
        fill="#F0B501"
        d="m48 452.65.17.14c19.15 11.12 33.34 5.23 33.34-13.01v-.13L293 309.45z"
      />
    </svg>
  );
}

const storeBtnClass =
  "inline-flex w-[10.25rem] shrink-0 items-center gap-2.5 rounded-xl bg-black px-3 py-2 text-left ring-1 ring-white/20 transition hover:bg-white/10";

export function AppDownloadButtons({ className = "" }: { className?: string }) {
  const toast = useToast();

  function comingSoon() {
    toast.info("Coming soon!");
  }

  return (
    <div className={`flex w-max max-w-full flex-col gap-2 ${className}`.trim()}>
      <button type="button" onClick={comingSoon} className={storeBtnClass}>
        <AppleIcon className="h-6 w-6 shrink-0 text-white" />
        <span className="min-w-0 leading-tight">
          <span className="block text-[9px] uppercase tracking-wide text-white/60">
            Download on the
          </span>
          <span className="block text-[13px] font-semibold text-white">App Store</span>
        </span>
      </button>
      <button type="button" onClick={comingSoon} className={storeBtnClass}>
        <PlayIcon className="h-6 w-6 shrink-0" />
        <span className="min-w-0 leading-tight">
          <span className="block text-[9px] uppercase tracking-wide text-white/60">Get it on</span>
          <span className="block text-[13px] font-semibold text-white">Google Play</span>
        </span>
      </button>
    </div>
  );
}
