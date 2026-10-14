"use client";

import type { ReactNode } from "react";
import { SearchIcon } from "@/components/icons";
import { Select } from "@/components/Select";
import { Spinner } from "@/components/Spinner";

type FilterOption = { value: string; label: string };

type FilterField = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
};

type FilterToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  filters?: FilterField[];
  resultLabel?: string;
  loading?: boolean;
  trailing?: ReactNode;
  compact?: boolean;
};

export function FilterToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  searchLabel = "Search",
  filters = [],
  resultLabel,
  loading = false,
  trailing,
  compact = false,
}: FilterToolbarProps) {
  if (compact) {
    return (
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/35">
              <SearchIcon className="h-3.5 w-3.5" />
            </span>
            <input
              className="w-full rounded-lg border border-white/12 bg-white/[0.05] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-teal/45 focus:ring-2 focus:ring-teal/15"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label={searchLabel}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <Select
                key={filter.id}
                aria-label={filter.label}
                className={`!w-auto min-w-[8.5rem] ${filter.className || ""}`}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                options={filter.options}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 self-start lg:self-auto">
          {resultLabel !== undefined ? (
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-white/70">
              {loading ? <Spinner size="sm" /> : null}
              {resultLabel}
            </span>
          ) : null}
          {trailing}
        </div>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Find & filter
          </p>
          <p className="mt-0.5 text-xs text-mist">
            Results update as you type. Use filters to narrow the list.
          </p>
        </div>
        {resultLabel !== undefined ? (
          <div className="inline-flex items-center gap-2 self-start rounded-lg border border-teal/25 bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal-soft sm:self-auto">
            {loading ? <Spinner size="sm" /> : null}
            <span>{resultLabel}</span>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1.4fr)_repeat(auto-fit,minmax(10rem,0.7fr))] sm:items-end sm:p-4">
        <label className="block min-w-0 space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {searchLabel}
          </span>
          <span className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/40">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              className="glass-input !pl-10"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label={searchLabel}
            />
          </span>
        </label>

        {filters.map((filter) => (
          <label key={filter.id} className={`block min-w-0 space-y-1.5 ${filter.className || ""}`}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              {filter.label}
            </span>
            <Select
              aria-label={filter.label}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              options={filter.options}
            />
          </label>
        ))}

        {trailing}
      </div>
    </div>
  );
}
