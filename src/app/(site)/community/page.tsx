"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/icons";

const BENEFITS = [
  {
    title: "Founder updates",
    body: "Hear directly from the IndexHomes team on index performance, new inventory, and platform improvements.",
  },
  {
    title: "Owner seminars",
    body: "Practical sessions on how the shared index works, ownership certificates, and buying with confidence.",
  },
  {
    title: "Community sessions",
    body: "Meet other owners, ask questions live, and get early visibility on limited plot releases.",
  },
] as const;

const EVENTS = [
  {
    featured: true,
    category: "Owner seminar",
    title: "How the IndexHomes index really works",
    summary:
      "A clear, practical walkthrough of the unified platform index — how completed sales move the number, how display prices are calculated, and what that means for your portfolio.",
    month: "OCT",
    day: "28",
    weekday: "Tuesday",
    time: "18:30 – 19:15 BST",
    format: "Live online",
    seats: "Free for registered owners",
    host: "IndexHomes team",
    agenda: [
      "Index formula in plain English",
      "Display price vs base price",
      "Ownership certificates explained",
      "Live Q&A",
    ],
  },
  {
    featured: false,
    category: "Founder update",
    title: "Q4 roadmap & marketplace outlook",
    summary:
      "A founder briefing on platform progress, upcoming plot releases, and how owner feedback is shaping the next phase of IndexHomes.",
    month: "NOV",
    day: "12",
    weekday: "Wednesday",
    time: "19:00 – 19:45 GMT",
    format: "Live online",
    seats: "Open registration",
    host: "IndexHomes Admin",
    agenda: [],
  },
  {
    featured: false,
    category: "Community meetup",
    title: "Early owners evening",
    summary:
      "An informal online meetup for buyers and holders — share goals, ask the community, and hear what is coming next on the marketplace.",
    month: "NOV",
    day: "26",
    weekday: "Wednesday",
    time: "18:00 – 18:40 GMT",
    format: "Live online",
    seats: "Limited to 40 seats",
    host: "IndexHomes community",
    agenda: [],
  },
] as const;

const EXPECT = [
  "Short, focused sessions — typically 30 to 45 minutes",
  "Clear language, no jargon and no crypto talk",
  "Room for questions at the end of every seminar",
  "Calendar invites and joining links sent to registered accounts",
] as const;

export default function CommunityPage() {
  const featured = EVENTS.find((e) => e.featured)!;
  const upcoming = EVENTS.filter((e) => !e.featured);

  return (
    <div className="space-y-16 lg:space-y-24">
      <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <FadeIn>
          <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
            Community &amp; Events
          </span>
          <h1 className="mt-5 font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Learn the market. Meet other owners.{" "}
            <span className="text-aurora">Grow together.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            IndexHomes hosts online seminars, founder updates, and owner meetups so you always
            understand the index, your ownership records, and what is happening on the marketplace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#upcoming" icon={<ArrowRightIcon />}>
              View upcoming events
            </ButtonLink>
            <ButtonLink href="/signup" variant="ghost" icon={<ArrowRightIcon />}>
              Join IndexHomes
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
            <span className="inline-flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
              Free for account holders
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
              Live online · UK time
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
              Recordings shared when available
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass-strong relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-teal/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-gold/15 blur-3xl"
              aria-hidden
            />
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Next featured session
            </p>
            <h2 className="relative mt-3 font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
              {featured.title}
            </h2>
            <p className="relative mt-3 text-sm leading-relaxed text-mist">{featured.summary}</p>
            <dl className="relative mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
                <dt className="text-[11px] uppercase tracking-wider text-white/45">Date</dt>
                <dd className="mt-1 font-medium text-white">
                  {featured.weekday} {featured.day} {featured.month}
                </dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
                <dt className="text-[11px] uppercase tracking-wider text-white/45">Time</dt>
                <dd className="mt-1 font-medium text-white">{featured.time}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
                <dt className="text-[11px] uppercase tracking-wider text-white/45">Format</dt>
                <dd className="mt-1 font-medium text-white">{featured.format}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
                <dt className="text-[11px] uppercase tracking-wider text-white/45">Access</dt>
                <dd className="mt-1 font-medium text-white">{featured.seats}</dd>
              </div>
            </dl>
            <div className="relative mt-6">
              <ButtonLink href="/signup" icon={<ArrowRightIcon />} className="w-full">
                Reserve your place
              </ButtonLink>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="space-y-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for owners who want <span className="text-aurora">clarity</span>
          </h2>
          <p className="mt-3 text-base text-mist">
            Every event is designed to help you trade and hold with confidence — not to overwhelm you
            with noise.
          </p>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-3">
          {BENEFITS.map((item, i) => (
            <GlassCard key={item.title} delay={0.06 * i} glow={false} className="p-5 text-center sm:p-6">
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="upcoming" className="space-y-8 scroll-mt-28">
        <FadeIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Upcoming <span className="text-aurora">events</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-mist">
                Register with your IndexHomes account to receive the joining link and calendar invite
                before each session.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1.5 text-xs font-medium text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              {EVENTS.length} events listed
            </span>
          </div>
        </FadeIn>

        <GlassCard delay={0.05} strong className="overflow-hidden p-0">
          <div className="grid lg:grid-cols-[auto_1fr]">
            <div className="flex flex-row items-center gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6 lg:w-40 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:py-8">
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  {featured.month}
                </p>
                <p className="font-display text-4xl font-semibold leading-none text-white sm:text-5xl">
                  {featured.day}
                </p>
                <p className="mt-1 text-xs text-mist">{featured.weekday}</p>
              </div>
              <div className="lg:hidden">
                <span className="rounded-lg border border-teal/30 bg-teal/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-soft">
                  Featured
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5 p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden rounded-lg border border-teal/30 bg-teal/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-soft lg:inline-flex">
                  Featured
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/65">
                  {featured.category}
                </span>
                <span className="text-sm text-mist">
                  {featured.time} · {featured.format}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">{featured.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">
                  {featured.summary}
                </p>
              </div>
              {featured.agenda.length ? (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {featured.agenda.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-mist">
                  Hosted by <span className="text-white/85">{featured.host}</span> · {featured.seats}
                </p>
                <ButtonLink href="/signup" icon={<ArrowRightIcon />} className="!px-5 !py-2.5">
                  Reserve your place
                </ButtonLink>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-2">
          {upcoming.map((event, i) => (
            <GlassCard key={event.title} delay={0.08 * (i + 1)} className="flex h-full flex-col p-0">
              <div className="flex flex-1 gap-4 p-5 sm:gap-5 sm:p-6">
                <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                    {event.month}
                  </span>
                  <span className="font-display text-2xl font-semibold leading-none text-white">
                    {event.day}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                      {event.category}
                    </span>
                    <span className="text-xs text-mist">{event.format}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{event.summary}</p>
                  <p className="mt-3 text-sm text-white/70">
                    {event.weekday} · {event.time}
                  </p>
                  <p className="mt-1 text-xs text-mist">
                    {event.host} · {event.seats}
                  </p>
                </div>
              </div>
              <div className="border-t border-white/10 px-5 py-4 sm:px-6">
                <ButtonLink
                  href="/signup"
                  variant="ghost"
                  icon={<ArrowRightIcon />}
                  className="w-full !px-4 !py-2.5"
                >
                  Reserve your place
                </ButtonLink>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
        <FadeIn>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            What to expect at every event
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
            We keep sessions useful and respectful of your time. Join from any device — no special
            software required beyond the link we send you.
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <ul className="glass space-y-3 rounded-[1.5rem] p-5 sm:p-6">
            {EXPECT.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/85 sm:text-[15px]">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      <section className="full-bleed border-y border-white/10 bg-white/[0.03]">
        <div className="site-shell py-12 sm:py-16">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to join the room?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-mist">
              Create your IndexHomes account to reserve seats, receive event reminders, and get the
              joining link for every seminar and meetup.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/signup" icon={<ArrowRightIcon />}>
                Create free account
              </ButtonLink>
              <Link
                href="/plots"
                className="inline-flex items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium text-white/60 transition hover:text-white"
              >
                Browse available plots
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
