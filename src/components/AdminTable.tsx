"use client";

import type { ReactNode } from "react";

export function AdminTable({
  columns,
  children,
  empty,
}: {
  columns: string[];
  children: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <div className="glass overflow-hidden rounded-[1.25rem]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:px-5"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {empty}
    </div>
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
    <td className={`border-b border-white/[0.06] px-4 py-3.5 align-middle sm:px-5 ${className}`}>
      {children}
    </td>
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
    neutral: "border-white/15 bg-white/[0.05] text-white/70",
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    warn: "border-gold/30 bg-gold/10 text-gold",
    danger: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    info: "border-teal/30 bg-teal/10 text-teal-soft",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-wide ${tones[tone]}`}
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
  children,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  tone?: "default" | "danger" | "accent";
  children: ReactNode;
}) {
  const tones = {
    default: "text-white/70 hover:bg-white/10 hover:text-white",
    accent: "text-teal-soft hover:bg-teal/15 hover:text-teal-soft",
    danger: "text-rose-300/90 hover:bg-rose-400/15 hover:text-rose-200",
  };
  const className = `inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition ${tones[tone]}`;

  if (href) {
    return (
      <a href={href} aria-label={label} title={label} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
