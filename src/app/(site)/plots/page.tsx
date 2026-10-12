"use client";

import { useEffect, useMemo, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Pagination } from "@/components/Pagination";
import { PlotCard } from "@/components/PlotCard";
import { Select } from "@/components/Select";
import { PageLoader, Spinner } from "@/components/Spinner";
import { api, type PaginationMeta, type PlatformIndex, type Plot } from "@/lib/api";

const PAGE_SIZE = 24;

export default function PlotsPage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [index, setIndex] = useState<PlatformIndex | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("available");
  const [page, setPage] = useState(1);
  const [debouncedQ, setDebouncedQ] = useState("");
  const [ready, setReady] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, location, status]);

  useEffect(() => {
    api
      .getPlotLocations()
      .then((data) => setLocations(data.locations))
      .catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    setError(null);

    (async () => {
      try {
        const data = await api.getPlots({
          status,
          q: debouncedQ || undefined,
          location: location || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (cancelled) return;
        setPlots(data.plots);
        setIndex(data.index);
        setPagination(data.pagination);
      } catch (err) {
        if (cancelled) return;
        setPlots([]);
        setPagination(null);
        setError(err instanceof Error ? err.message : "Could not load plots");
      } finally {
        if (!cancelled) {
          setFetching(false);
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQ, location, status, page]);

  const indexLabel = useMemo(() => {
    if (!index) return null;
    return `Live index ${Number(index.current_index).toFixed(1)}`;
  }, [index]);

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Browse <span className="text-aurora">plots</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-mist">
          Search and filter live inventory. Display price = Base × (Current Index ÷ Starting Index).
          {indexLabel ? ` ${indexLabel}.` : ""} Pages load in small batches for speed.
        </p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="glass grid gap-3 rounded-2xl p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
          <input
            className="glass-input min-w-0"
            placeholder="Search name or description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search plots"
          />
          <Select
            aria-label="Filter by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            options={[
              { value: "", label: "All locations" },
              ...locations.map((loc) => ({ value: loc, label: loc })),
            ]}
          />
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "available", label: "Available" },
              { value: "reserved", label: "Reserved" },
              { value: "sold", label: "Sold" },
              { value: "all", label: "All statuses" },
            ]}
          />
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-mist">
            {fetching ? <Spinner size="sm" label="Refreshing plots" /> : null}
            {ready
              ? `${pagination?.total?.toLocaleString("en-GB") ?? plots.length} plots`
              : "…"}
          </div>
        </div>
      </FadeIn>

      {!ready ? (
        <PageLoader label="Loading plots…" />
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="font-display text-lg font-semibold text-white">Unable to load plots</p>
          <p className="mt-2 text-sm text-mist">{error}</p>
        </div>
      ) : plots.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="font-display text-lg font-semibold text-white">No plots found</p>
          <p className="mt-2 text-sm text-mist">
            Try another search, or ask an admin to publish inventory with photos and details.
          </p>
        </div>
      ) : (
        <>
          <div className="plot-grid">
            {plots.map((plot, i) => (
              <PlotCard key={plot.id} plot={plot} delay={Math.min(i * 0.03, 0.2)} />
            ))}
          </div>
          <Pagination meta={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
