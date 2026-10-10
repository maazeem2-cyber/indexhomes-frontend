"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRightIcon, LogInIcon, UserPlusIcon } from "@/components/icons";
import { PageLoader } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { api, type PlatformIndex, type Profile } from "@/lib/api";
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
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setReady(true);
    if (!p) return;

    setLoadingData(true);
    (async () => {
      try {
        const idx = await api.getIndex();
        setIndex(idx);
        const token = getAccessToken();
        if (p.role === "admin" && token) {
          const m = await api.adminMetrics(token);
          setMetrics(m);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load dashboard");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [toast]);

  if (!ready || (profile && loadingData && !index)) {
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-soft">
          {profile.role} dashboard
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Welcome, {profile.display_name}
        </h1>
        <p className="mt-2 text-sm text-mist">{profile.email}</p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Current index" value={index ? Number(index.current_index).toFixed(1) : "—"} />
        <Stat
          title="Platform value"
          value={index ? `£${Number(index.total_platform_value).toFixed(2)}` : "—"}
        />
        <Stat title="Units issued" value={index ? String(index.total_units_issued) : "—"} />
        <Stat title="Role" value={profile.role} />
      </div>

      {profile.role === "admin" && metrics ? (
        <FadeIn delay={0.1}>
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Admin metrics</h2>
            <div className="mt-4 grid gap-3 grid-cols-2 lg:grid-cols-4">
              <Mini label="Users" value={metrics.users} />
              <Mini label="Available" value={metrics.plots_available} />
              <Mini label="Sold" value={metrics.plots_sold} />
              <Mini label="Sales" value={metrics.sales} />
            </div>
          </div>
        </FadeIn>
      ) : null}

      {profile.role === "buyer" ? (
        <FadeIn delay={0.1}>
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Buyer workspace</h2>
            <p className="mt-2 text-sm text-mist">
              Browse available plots and purchase in Milestone 3. Portfolio and ownership certificates
              land after paid sales.
            </p>
            <ButtonLink href="/plots" className="mt-5" icon={<ArrowRightIcon />}>
              Browse plots
            </ButtonLink>
          </div>
        </FadeIn>
      ) : null}

      {profile.role === "seller" ? (
        <FadeIn delay={0.1}>
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Seller workspace</h2>
            <p className="mt-2 text-sm text-mist">
              v1 listings are admin-seeded only. Seller-created listings come after launch.
            </p>
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <FadeIn>
      <div className="glass rounded-2xl p-4">
        <p className="text-[11px] uppercase tracking-wider text-mist">{title}</p>
        <p className="mt-2 font-display text-2xl font-semibold capitalize">{value}</p>
      </div>
    </FadeIn>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
      <p className="text-[11px] uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}
