"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/Button";
import { FaqSection } from "@/components/FaqSection";
import { HeroVisual } from "@/components/HeroVisual";
import { IndexPanel } from "@/components/IndexPanel";
import { PlotCard } from "@/components/PlotCard";
import { GlassCard } from "@/components/GlassCard";
import { FadeIn } from "@/components/FadeIn";
import {
  ArrowRightIcon,
  CertificateIcon,
  ChartUpIcon,
  CheckCircleIcon,
  RefreshIcon,
  SparkleIcon,
  TagIcon,
} from "@/components/icons";
import { PageLoader } from "@/components/Spinner";
import { api, type PlatformIndex, type Plot } from "@/lib/api";

const TRUST_POINTS = [
  "One live shared index",
  "Verified ownership certificates",
  "Buy and list when ready",
] as const;

const PLATFORM_POINTS = [
  "Every purchase supports all owners",
  "Sold plots are auto-replenished",
  "Clear ownership records",
  "List anytime you choose",
  "Secure Stripe payments",
  "Built for web, ready for mobile",
] as const;

const FEEDBACK = [
  {
    quote:
      "Buying felt simple and clear. Watching the shared index move made ownership feel meaningful from day one.",
    name: "Jessica M.",
    role: "Early buyer",
    avatar: "/images/avatars/jessica.jpg",
  },
  {
    quote:
      "I like that every plot ties to one live index. Certificates and ownership records gave me confidence to buy again.",
    name: "Daniel R.",
    role: "Portfolio holder",
    avatar: "/images/avatars/daniel.jpg",
  },
  {
    quote:
      "Listing when I choose is a big plus. The marketplace is easy to follow — no wallets, just card payments.",
    name: "Amelia K.",
    role: "Marketplace seller",
    avatar: "/images/avatars/amelia.jpg",
  },
] as const;

const HOW_STEPS: {
  title: string;
  body: string;
  icon: ReactNode;
  tone: string;
}[] = [
  {
    title: "Live shared index",
    body: "As more plots are purchased, the platform index rises — and held property values move with it.",
    icon: <ChartUpIcon className="h-5 w-5" />,
    tone: "from-teal/30 to-teal/10 text-teal-soft ring-teal/30",
  },
  {
    title: "Marketplace replenished",
    body: "When a plot sells, a new matching-priced plot is automatically added for the next buyer.",
    icon: <RefreshIcon className="h-5 w-5" />,
    tone: "from-gold/30 to-gold/10 text-gold ring-gold/30",
  },
  {
    title: "Verified ownership",
    body: "Every purchase includes a verified ownership certificate recorded on the platform.",
    icon: <CertificateIcon className="h-5 w-5" />,
    tone: "from-sky-300/25 to-indigo-400/10 text-sky-200 ring-sky-300/25",
  },
  {
    title: "List when you choose",
    body: "Offer your plot for sale whenever you like. Timing and demand follow marketplace activity.",
    icon: <TagIcon className="h-5 w-5" />,
    tone: "from-violet-300/25 to-fuchsia-400/10 text-violet-200 ring-violet-300/25",
  },
];

export default function HomePage() {
  const [index, setIndex] = useState<PlatformIndex | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [idxResult, plotResult] = await Promise.allSettled([
        api.getIndex(),
        api.getPlots({ status: "available" }),
      ]);
      if (cancelled) return;

      if (idxResult.status === "fulfilled") setIndex(idxResult.value);
      if (plotResult.status === "fulfilled") setPlots(plotResult.value.plots);

      const firstError =
        (idxResult.status === "rejected" && idxResult.reason) ||
        (plotResult.status === "rejected" && plotResult.reason) ||
        null;
      setError(
        firstError
          ? firstError instanceof Error
            ? firstError.message
            : "Could not load platform data"
          : null
      );
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <PageLoader label="Loading IndexHomes…" />;
  }

  return (
    <div className="space-y-16 lg:space-y-24">
      <section
        id="index"
        className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16"
      >
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
            Virtual property trading
          </p>
          <h1 className="mt-3 font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            Trade virtual plots with{" "}
            <span className="text-aurora">live market warmth</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
            An online digital property marketplace where every purchase helps grow value for all
            owners — powered by one live platform index.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/signup" icon={<ArrowRightIcon />}>
              Get started
            </ButtonLink>
            <ButtonLink href="/plots" variant="ghost" icon={<ArrowRightIcon />}>
              Browse plots
            </ButtonLink>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium text-white/55 transition hover:text-white sm:justify-start"
            >
              See how it works
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <span key={point} className="inline-flex items-center gap-2 text-sm text-mist">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                </span>
                {point}
              </span>
            ))}
          </div>

          {error ? (
            <p className="mt-4 text-xs text-white/45">
              Live index data is temporarily unavailable. Showing the starting index of 10.0.
            </p>
          ) : null}

          {index ? (
            <div className="mt-8 max-w-xl">
              <IndexPanel index={index} />
            </div>
          ) : null}
        </FadeIn>

        <div className="pb-10 sm:pb-8 lg:pb-4">
          <HeroVisual index={index} />
        </div>
      </section>

      <div className="full-bleed border-y border-white/10 bg-white/[0.03] py-4">
        <FadeIn>
          <div className="site-shell">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {PLATFORM_POINTS.map((point) => (
                <div
                  key={point}
                  className="flex items-center justify-center gap-2 px-2 py-1 text-center text-sm text-white/70"
                >
                  <SparkleIcon className="h-3.5 w-3.5 shrink-0 text-teal-soft" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <section id="how-it-works" className="space-y-10">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
            How it works
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Every purchase helps grow value for{" "}
            <span className="text-aurora">all owners</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
            IndexHomes is a digital property marketplace. As more people buy available plots, the
            live index rises — so every property held by customers can increase in value over time.
          </p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {HOW_STEPS.map((item, i) => (
            <GlassCard
              key={item.title}
              delay={0.06 * i}
              glow={false}
              className="p-5 text-center sm:p-6"
            >
              <span
                className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ${item.tone}`}
              >
                {item.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
            </GlassCard>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <div className="glass mx-auto max-w-3xl rounded-[1.75rem] px-6 py-8 text-center sm:px-10 sm:py-10">
            <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Good to know
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
              Markets move with activity
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
              Plot values can rise or fall as marketplace activity changes. When you list a plot,
              sale timing depends on demand — there is no promise of an immediate buyer.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/plots" icon={<ArrowRightIcon />}>
                Explore available plots
              </ButtonLink>
              <Link
                href="/signup"
                className="text-sm font-medium text-white/60 transition hover:text-white"
              >
                Create an account →
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="plots" className="space-y-5">
        <FadeIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Available <span className="text-aurora">plots</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-mist">
                Browse live inventory priced against the shared platform index.
              </p>
            </div>
            <ButtonLink href="/plots" variant="ghost" icon={<ArrowRightIcon />} className="!px-4 !py-2.5">
              View all
            </ButtonLink>
          </div>
        </FadeIn>

        {plots.length ? (
          <>
            <div className="plot-grid">
              {plots.slice(0, 4).map((plot, i) => (
                <PlotCard key={plot.id} plot={plot} delay={i * 0.05} />
              ))}
            </div>
            {plots.length > 4 ? (
              <div className="flex justify-center pt-2">
                <ButtonLink href="/plots" icon={<ArrowRightIcon />}>
                  View all plots
                </ButtonLink>
              </div>
            ) : null}
          </>
        ) : (
          <div className="glass rounded-2xl p-6 text-sm text-mist">
            {error
              ? "Plot listings are temporarily unavailable. Please try again shortly."
              : "No available plots yet."}
          </div>
        )}
      </section>

      <FaqSection />

      <section id="feedback" className="full-bleed relative overflow-hidden border-y border-white/10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_20%_10%,rgba(56,189,180,0.16),transparent_55%),radial-gradient(ellipse_60%_70%_at_85%_80%,rgba(212,180,131,0.12),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(255,255,255,0.02))]"
          aria-hidden
        />
        <div className="site-shell relative space-y-10 py-14 sm:py-16 lg:py-20">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Owner stories
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Loved by early <span className="text-aurora">owners</span>
            </h2>
            <p className="mt-3 text-base text-mist sm:text-lg">
              Real feedback from people exploring IndexHomes as the marketplace grows.
            </p>
          </FadeIn>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEEDBACK.map((item, i) => (
              <GlassCard
                key={item.name}
                delay={0.08 * i}
                glow
                strong
                className="relative flex h-full flex-col overflow-hidden p-6 sm:p-7"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-teal/15 blur-2xl"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-3">
                  <span
                    className="font-display text-6xl leading-none text-teal-soft/70"
                    aria-hidden="true"
                  >
                    “
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-gold" aria-label="5 out of 5">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <svg
                        key={star}
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5 fill-current"
                        aria-hidden
                      >
                        <path d="M10 1.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.8 5.2 16.4l.9-5.4L2.2 7.2l5.4-.8L10 1.5z" />
                      </svg>
                    ))}
                  </span>
                </div>
                <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-white/85">
                  {item.quote}
                </p>
                <div className="relative mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="relative inline-flex h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-teal/40 ring-offset-2 ring-offset-[#0c1a2e]">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-teal-soft/80">{item.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "One live index",
            body: "All plots move with a single platform index — no external price feeds required.",
          },
          {
            title: "Secure ownership",
            body: "Purchases are recorded with verified certificates so your holding stays clear and traceable.",
          },
          {
            title: "Buy and resell",
            body: "Start with available plots, then list for sale when you choose — subject to marketplace demand.",
          },
        ].map((item, i) => (
          <GlassCard
            key={item.title}
            delay={0.1 + i * 0.12}
            glow={false}
            shellClassName={i === 2 ? "sm:col-span-2 xl:col-span-1" : ""}
            className="p-5 text-center sm:p-6"
          >
            <h3 className="font-display text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
