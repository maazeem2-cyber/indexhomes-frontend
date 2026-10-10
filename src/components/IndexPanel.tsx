"use client";

import { motion } from "framer-motion";
import type { PlatformIndex } from "@/lib/api";

export function IndexPanel({ index }: { index: PlatformIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong relative overflow-hidden rounded-3xl p-5 sm:p-6"
    >
      <div className="orb pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-teal/15 blur-3xl" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-soft">Platform index</p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {Number(index.current_index).toFixed(1)}
        </h2>
        <span className="mb-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-soft">
          Start 10.0
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        Display price = Base × (Current ÷ 10.0). Paid sales only.
      </p>
      <div className="mt-5 grid grid-cols-3 gap-1.5 sm:gap-3">
        <Stat label="Value" value={`£${Number(index.total_platform_value).toFixed(0)}`} />
        <Stat label="Units" value={String(index.total_units_issued)} />
        <Stat
          label="Updated"
          value={new Date(index.updated_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          })}
        />
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 sm:px-3">
      <p className="text-[10px] uppercase tracking-wider text-mist sm:text-[11px]">{label}</p>
      <p className="mt-1 truncate font-display text-[11px] font-semibold text-white sm:text-sm">
        {value}
      </p>
    </div>
  );
}
