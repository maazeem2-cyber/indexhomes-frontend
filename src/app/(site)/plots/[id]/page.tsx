"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRightIcon } from "@/components/icons";
import { PageLoader } from "@/components/Spinner";
import {
  api,
  formatGbp,
  plotImageSrc,
  type PlatformIndex,
  type Plot,
} from "@/lib/api";
import { getProfile } from "@/lib/auth";

export default function PlotDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [plot, setPlot] = useState<Plot | null>(null);
  const [index, setIndex] = useState<PlatformIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<ReturnType<typeof getProfile>>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getPlot(id);
        if (cancelled) return;
        setPlot(data.plot);
        setIndex(data.index);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load plot");
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!ready) return <PageLoader label="Loading plot…" />;

  if (error || !plot) {
    return (
      <FadeIn>
        <div className="glass mx-auto max-w-lg rounded-3xl p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Plot not found</h1>
          <p className="mt-2 text-sm text-mist">{error || "This listing is unavailable."}</p>
          <ButtonLink href="/plots" className="mt-6" icon={<ArrowRightIcon />}>
            Back to plots
          </ButtonLink>
        </div>
      </FadeIn>
    );
  }

  const imageSrc = plotImageSrc(plot);
  const display = plot.display_price ?? plot.base_price;
  const starting = Number(index?.starting_index ?? 10);
  const current = Number(index?.current_index ?? 10);

  return (
    <div className="space-y-8">
      <FadeIn>
        <Link href="/plots" className="text-sm text-teal-soft transition hover:text-white">
          ← All plots
        </Link>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <FadeIn>
          <div className="glass overflow-hidden rounded-[1.75rem]">
            <div className="relative aspect-[16/11] bg-[#0a1628]">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={plot.name}
                  fill
                  priority
                  unoptimized={imageSrc.startsWith("http")}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-mist">
                  No image uploaded
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge capitalize">{plot.status}</span>
              {plot.just_added ? <span className="badge badge-new">Just Added</span> : null}
              <span className="text-sm text-mist">{plot.location}</span>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {plot.name}
            </h1>
            <p className="text-base leading-relaxed text-mist">{plot.description}</p>

            <div className="glass rounded-2xl p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-mist">Display price</p>
                  <p className="mt-1 font-display text-3xl font-semibold text-teal-soft">
                    {formatGbp(Number(display))}
                  </p>
                  <p className="mt-1 text-sm text-mist">
                    Base {formatGbp(Number(plot.base_price))} × (Index {current.toFixed(1)} ÷{" "}
                    {starting.toFixed(1)})
                  </p>
                </div>
              </div>
            </div>

            {plot.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {plot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-mist"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              {plot.status === "available" ? (
                profile ? (
                  <ButtonLink href="/dashboard" icon={<ArrowRightIcon />}>
                    {profile.role === "buyer"
                      ? "Go to buyer dashboard"
                      : profile.role === "admin"
                        ? "Manage in admin"
                        : "Go to dashboard"}
                  </ButtonLink>
                ) : (
                  <ButtonLink href="/signup" icon={<ArrowRightIcon />}>
                    Create account to buy
                  </ButtonLink>
                )
              ) : (
                <ButtonLink href="/plots" variant="ghost" icon={<ArrowRightIcon />}>
                  Browse available plots
                </ButtonLink>
              )}
              {profile?.role === "admin" ? (
                <ButtonLink href="/dashboard/plots" variant="ghost" icon={<ArrowRightIcon />}>
                  Edit inventory
                </ButtonLink>
              ) : null}
            </div>

            <p className="text-xs leading-relaxed text-white/45">
              Purchases and ownership certificates unlock in Milestone 3 via Stripe. Display prices
              always follow the live platform index from completed paid sales only.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
