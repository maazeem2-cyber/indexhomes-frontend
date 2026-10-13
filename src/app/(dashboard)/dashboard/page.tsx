"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import {
  ArrowRightIcon,
  ChartUpIcon,
  LogInIcon,
  PlusIcon,
  TagIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons";
import { MetricGridSkeleton } from "@/components/Skeleton";
import { PageLoader } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { api, formatGbp, type PlatformIndex, type Plot, type Profile } from "@/lib/api";
import { getAccessToken, getProfile } from "@/lib/auth";

export default function DashboardPage() {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [index, setIndex] = useState<PlatformIndex | null>(null);
  const [metrics, setMetrics] = useState<{
    users: number;
    plots_available: number;
    plots_sold: number;
    sales: number;
  } | null>(null);
  const [ownedPlots, setOwnedPlots] = useState<Plot[]>([]);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setReady(true);
    if (!p) return;

    const token = getAccessToken();
    setLoadingIndex(true);
    if (p.role === "admin" && token) setLoadingMetrics(true);

    (async () => {
      try {
        const indexPromise = api.getIndex();
        const metricsPromise =
          p.role === "admin" && token
            ? api.adminMetrics(token)
            : Promise.resolve(null);
        const ownedPromise =
          p.role === "buyer"
            ? api.getPlots({ status: "sold" })
            : Promise.resolve(null);

        const [idx, m, owned] = await Promise.all([
          indexPromise,
          metricsPromise,
          ownedPromise,
        ]);

        setIndex(idx);
        if (m) setMetrics(m);
        if (owned && p.role === "buyer") {
          setOwnedPlots(owned.plots.filter((plot) => plot.owner_id === p.id));
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load dashboard");
      } finally {
        setLoadingIndex(false);
        setLoadingMetrics(false);
      }
    })();
  }, [toast]);

  if (!ready) {
    return <PageLoader label="Loading dashboard…" />;
  }

  if (!profile) {
    return (
      <FadeIn>
        <div className="glass-strong mx-auto max-w-lg rounded-3xl p-6 text-center sm:p-8">
          <h1 className="font-display text-2xl font-semibold">Sign in required</h1>
          <p className="mt-2 text-sm text-mist">Your role dashboard unlocks after authentication.</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/login" icon={<LogInIcon />} iconPosition="left">
              Sign in
            </ButtonLink>
            <ButtonLink href="/signup" variant="ghost" icon={<UserPlusIcon />} iconPosition="left">
              Join
            </ButtonLink>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
              {profile.role} overview
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {profile.display_name}
            </h1>
            <p className="mt-2 text-sm text-mist">
              Platform health, inventory, and account tools in one place.
            </p>
          </div>
          {profile.role === "admin" ? (
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/dashboard/plots" icon={<PlusIcon />} iconPosition="left">
                Manage plots
              </ButtonLink>
              <ButtonLink
                href="/dashboard/users"
                variant="ghost"
                icon={<UsersIcon />}
                iconPosition="left"
              >
                Manage users
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </FadeIn>

      {loadingIndex && !index ? (
        <MetricGridSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Current index"
            value={index ? Number(index.current_index).toFixed(1) : "—"}
            subtitle="Starts at 10.0"
            icon={<ChartUpIcon className="h-4 w-4" />}
            tone="teal"
          />
          <MetricCard
            title="Platform value"
            value={index ? formatGbp(Number(index.total_platform_value)) : "—"}
            subtitle="Completed paid sales only"
            icon={<TagIcon className="h-4 w-4" />}
            tone="gold"
          />
          <MetricCard
            title="Units issued"
            value={index ? String(index.total_units_issued) : "—"}
            subtitle="Owned plots after purchase"
            icon={<UsersIcon className="h-4 w-4" />}
            tone="sky"
          />
          <MetricCard
            title="Your role"
            value={profile.role}
            subtitle={profile.email}
            icon={<UserPlusIcon className="h-4 w-4" />}
            tone="violet"
          />
        </div>
      )}

      {profile.role === "admin" ? (
        loadingMetrics && !metrics ? (
          <MetricGridSkeleton />
        ) : metrics ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Registered users"
              value={String(metrics.users)}
              subtitle="All roles"
              tone="teal"
            />
            <MetricCard
              title="Available plots"
              value={String(metrics.plots_available)}
              subtitle="Live inventory"
              tone="gold"
            />
            <MetricCard
              title="Sold plots"
              value={String(metrics.plots_sold)}
              subtitle="Owned units"
              tone="sky"
            />
            <MetricCard
              title="Completed sales"
              value={String(metrics.sales)}
              subtitle="Paid transactions"
              tone="violet"
            />
          </div>
        ) : null
      ) : null}

      {profile.role === "admin" ? (
        <FadeIn delay={0.08}>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Plot inventory"
              body="Add, edit, and delete listings from a table view. Upload images and keep display prices linked to the live index."
              href="/dashboard/plots"
              cta="Open plots"
            />
            <Panel
              title="User management"
              body="Review buyers, sellers, and admins. Update display names and roles from a clean management table."
              href="/dashboard/users"
              cta="Open users"
            />
          </div>
        </FadeIn>
      ) : null}

      {profile.role === "buyer" ? (
        <FadeIn delay={0.08}>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Browse & buy readiness"
              body="Search and filter live plots, open details, and track display prices from the shared index. Stripe checkout and ownership certificates unlock in Milestone 3."
              href="/plots"
              cta="Browse plots"
            />
            <Panel
              title="Your profile"
              body="Update your display name and password anytime. After purchases go live, your owned plots and certificates will appear here too."
              href="/dashboard/profile"
              cta="Open profile"
            />
          </div>
          <div className="glass mt-4 rounded-2xl p-5 text-sm text-mist">
            {ownedPlots.length
              ? `You currently own ${ownedPlots.length} plot${ownedPlots.length === 1 ? "" : "s"}.`
              : "No owned plots yet — purchases unlock in Milestone 3."}
          </div>
        </FadeIn>
      ) : null}

      {profile.role === "seller" ? (
        <FadeIn delay={0.08}>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Marketplace access"
              body="Browse live inventory and follow the shared index. In v1 only admins publish new plots. Seller-created listings are planned after launch."
              href="/plots"
              cta="Browse marketplace"
            />
            <Panel
              title="Your profile"
              body="Keep your seller account details and password up to date so you are ready when listing tools open."
              href="/dashboard/profile"
              cta="Open profile"
            />
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon?: ReactNode;
  tone: "teal" | "gold" | "sky" | "violet";
}) {
  const tones = {
    teal: "from-teal/25 to-teal/5 text-teal-soft",
    gold: "from-gold/25 to-gold/5 text-gold",
    sky: "from-sky-300/25 to-sky-300/5 text-sky-200",
    violet: "from-violet-300/25 to-violet-300/5 text-violet-200",
  };

  return (
    <FadeIn>
      <div className="glass relative overflow-hidden rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
            {title}
          </p>
          {icon ? (
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]}`}
            >
              {icon}
            </span>
          ) : null}
        </div>
        <p className="mt-4 font-display text-2xl font-semibold capitalize tracking-tight sm:text-3xl">
          {value}
        </p>
        <p className="mt-1 truncate text-xs text-mist">{subtitle}</p>
      </div>
    </FadeIn>
  );
}

function Panel({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="glass flex h-full flex-col rounded-2xl p-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{body}</p>
      <ButtonLink href={href} className="mt-5" icon={<ArrowRightIcon />}>
        {cta}
      </ButtonLink>
    </div>
  );
}
