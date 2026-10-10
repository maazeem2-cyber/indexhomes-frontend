"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  shellClassName?: string;
  strong?: boolean;
  delay?: number;
  glow?: boolean;
};

export function GlassCard({
  children,
  className = "",
  shellClassName = "",
  strong,
  delay = 0,
  glow = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px", amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      // Keep layout stable when parent list refreshes with the same content
      layout={false}
      className={`${glow ? "glow-shell" : ""} ${shellClassName}`.trim()}
    >
      <div className={`group ${strong ? "glass-strong" : "glass"} h-full rounded-2xl ${className}`}>
        {children}
      </div>
    </motion.div>
  );
}
