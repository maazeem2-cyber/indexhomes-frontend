"use client";

import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "./GlassCard";
import { formatGbp, plotImageSrc, type Plot } from "@/lib/api";

export function PlotCard({ plot, delay = 0 }: { plot: Plot; delay?: number }) {
  const price = plot.display_price ?? plot.base_price;
  const imageSrc = plotImageSrc(plot);

  return (
    <Link href={`/plots/${plot.id}`} className="block h-full">
      <GlassCard delay={delay} className="h-full overflow-hidden p-0">
        <div className="relative h-40 bg-[#0a1628] sm:h-44">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={plot.name}
              fill
              unoptimized={imageSrc.startsWith("http")}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal/20 via-[#0c1a2e] to-gold/10 px-4 text-center text-sm text-mist">
              Image coming soon
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/70 via-[#07111f]/15 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-between p-4">
            <span className="rounded-lg bg-black/40 px-2.5 py-1 text-xs backdrop-blur-md">
              {plot.location}
            </span>
            {plot.just_added ? <span className="badge badge-new">Just Added</span> : null}
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <h3 className="font-display text-lg font-semibold">{plot.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-mist">{plot.description}</p>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-mist">Display price</p>
              <p className="font-display text-xl font-semibold text-teal-soft">{formatGbp(price)}</p>
              <p className="text-xs text-mist">Base {formatGbp(Number(plot.base_price))}</p>
            </div>
            <span className="badge capitalize">{plot.status}</span>
          </div>
          {plot.tags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {plot.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-mist"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </GlassCard>
    </Link>
  );
}
