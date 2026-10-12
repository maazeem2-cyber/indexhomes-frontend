"use client";

import type { SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: Option[];
  className?: string;
};

export function Select({ options, className = "", ...rest }: Props) {
  return (
    <div className={`select-shell ${className}`.trim()}>
      <select className="select-control" {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="select-chevron" aria-hidden>
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
