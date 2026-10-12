"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PlatformIndex } from "@/lib/api";

const FALLBACK_INDEX: PlatformIndex = {
  starting_index: 10,
  current_index: 10,
  total_platform_value: 0,
  total_units_issued: 0,
  updated_at: new Date(0).toISOString(),
};

export function HeroVisual({ index }: { index?: PlatformIndex | null }) {
  const live = index ?? FALLBACK_INDEX;
  const rising = Number(live.current_index) >= Number(live.starting_index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="animate-aurora absolute inset-0 -z-10 rounded-[2.5rem] bg-aurora-band bg-[length:200%_200%] opacity-35 blur-2xl" />

      <div className="animate-float-slow rounded-[2.25rem] glass p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#0a1628]">
          <Image
            src="/images/hero-property.jpg"
            alt="IndexHomes virtual property — premium UK home"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 480px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111f]/55 via-transparent to-transparent" />
        </div>
      </div>

      <div className="absolute -bottom-7 -left-3 hidden animate-float sm:block md:-left-5">
        <div className="relative overflow-hidden rounded-2xl glass px-5 py-4 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)]">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/70 to-transparent" />
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 rotate-12 text-teal/10"
            aria-hidden="true"
          >
            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" />
          </svg>
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-teal/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Live index
              </span>
            </div>
            <p className="mt-2 font-display text-base font-semibold leading-none text-white">
              {Number(live.current_index).toFixed(1)}
            </p>
            <p className="mt-2 text-[11px] font-medium tracking-wide text-white/45">
              {index
                ? rising
                  ? "Steady · tracking paid sales"
                  : "Below start · building"
                : "Starting index · 10.0"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
