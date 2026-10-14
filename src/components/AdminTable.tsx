"use client";

import type { ReactNode } from "react";

export function AdminTable({
  columns,
  children,
  empty,
  toolbar,
}: {
  columns: string[];
  children: ReactNode;
  empty?: ReactNode;
  toolbar?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070f1c] shadow-[0_20px_60px_-28px_rgba(0,0,0,0.75)]">
      {toolbar ? (
        <div className="border-b border-white/[0.06] bg-[#050b14]/90 px-3 py-2.5 sm:px-4">
          {toolbar}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#03070f]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40 sm:px-4"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">{children}</tbody>
        </table>
      </div>
      {empty}
    </div>
  );
}

export function AdminTr({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr className={`bg-[#0a1424]/70 transition hover:bg-[#0f1c30] ${className}`}>{children}</tr>
  );
}

export function AdminTd({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-3 py-3 align-middle sm:px-4 ${className}`}>{children}</td>
  );
}

export function MetaGrid({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="mt-1.5 grid gap-x-4 gap-y-0.5 text-[11px] leading-relaxed text-white/45 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 truncate">
          <span className="text-white/30">{item.label}: </span>
          <span className="text-white/70">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function StatusPill({
  value,
  tone = "neutral",
}: {
  value: string;
  tone?: "neutral" | "success" | "warn" | "danger" | "info";
}) {
  const tones = {
    neutral: "bg-white/10 text-white/75 ring-white/10",
    success: "bg-emerald-500 text-white ring-emerald-300/30",
    warn: "bg-amber-500/90 text-[#1a1408] ring-amber-200/25",
    danger: "bg-rose-500 text-white ring-rose-300/30",
    info: "bg-teal text-[#04201c] ring-teal-soft/30",
  };
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize tracking-wide ring-1 ring-inset ${tones[tone]}`}
    >
      {value}
    </span>
  );
}

export function ActionIconButton({
  label,
  onClick,
  href,
  tone = "default",
  disabled = false,
  children,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  tone?: "default" | "danger" | "accent";
  disabled?: boolean;
  children: ReactNode;
}) {
  const tones = {
    default: "text-white/55 hover:bg-white/[0.08] hover:text-white",
    accent: "text-teal-soft hover:bg-teal/15 hover:text-teal-soft",
    danger: "text-rose-300/85 hover:bg-rose-400/15 hover:text-rose-200",
  };
  const className = `inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#07111f]/60 transition ${tones[tone]} disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-[#07111f]/60`;

  if (href && !disabled) {
    return (
      <a href={href} aria-label={label} title={label} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}
