"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { PlotCard } from "@/components/PlotCard";
import { PageLoader, Spinner } from "@/components/Spinner";
import { api, type Plot } from "@/lib/api";

export default function PlotsPage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [ready, setReady] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setDebouncedLocation(location.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [q, location]);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    setError(null);

    (async () => {
      try {
        const data = await api.getPlots({
          status: "available",
          q: debouncedQ || undefined,
          location: debouncedLocation || undefined,
        });
        if (cancelled) return;
        setPlots(data.plots);
      } catch (err) {
        if (cancelled) return;
        setPlots([]);
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
  }, [debouncedQ, debouncedLocation]);

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Browse <span className="text-aurora">plots</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-mist">
          Search and filter available inventory. Display prices follow the live platform index.
        </p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="glass grid gap-3 rounded-2xl p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[1fr_1fr_auto]">
          <input
            className="glass-input min-w-0"
            placeholder="Search name or description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className="glass-input min-w-0"
            placeholder="Location / district"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-mist sm:col-span-2 lg:col-span-1 lg:py-0">
            {fetching ? <Spinner size="sm" label="Refreshing plots" /> : null}
            {ready ? `${plots.length} plots` : "…"}
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
          <p className="mt-2 text-sm text-mist">Try a different search or check back soon.</p>
        </div>
      ) : (
        <div className="plot-grid">
          {plots.map((plot) => (
            <PlotCard key={plot.id} plot={plot} delay={0} />
          ))}
        </div>
      )}
    </div>
  );
}
