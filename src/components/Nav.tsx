"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, ButtonLink, IconButton } from "@/components/Button";
import { ArrowRightIcon, GridIcon, LogInIcon, LogOutIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { clearAuth, getProfile } from "@/lib/auth";
import type { Profile } from "@/lib/api";

const links = [
  { href: "/plots", label: "Plots" },
  { href: "/community", label: "Community" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function logout() {
    clearAuth();
    setProfile(null);
    window.location.href = "/";
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="site-shell !py-0">
        <nav
          className={`relative flex min-w-0 items-center gap-2 rounded-full px-3 py-2 backdrop-blur-md transition-all duration-500 sm:gap-4 sm:px-5 sm:py-2.5 ${
            scrolled
              ? "bg-white/[0.09] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/20"
              : "bg-white/[0.06] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/15"
          }`}
        >
          <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <Logo compact />

          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative whitespace-nowrap py-1 text-sm font-medium tracking-tight text-white/75 transition-colors duration-200 hover:text-white"
              >
                {link.label}
                <span className="pointer-events-none absolute -bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal to-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden flex-none items-center gap-2.5 lg:flex">
            {profile ? (
              <>
                <ButtonLink
                  href="/dashboard"
                  variant="ghost"
                  icon={<GridIcon />}
                  iconPosition="left"
                  className="!px-4 !py-2.5"
                >
                  Dashboard
                </ButtonLink>
                <Button
                  variant="ghost"
                  icon={<LogOutIcon />}
                  iconPosition="left"
                  className="!px-4 !py-2.5"
                  onClick={logout}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <ButtonLink
                  href="/login"
                  variant="ghost"
                  icon={<LogInIcon />}
                  iconPosition="left"
                  className="!px-4 !py-2.5"
                >
                  Sign in
                </ButtonLink>
                <ButtonLink href="/signup" icon={<ArrowRightIcon />} className="!px-5 !py-2.5">
                  Get started
                </ButtonLink>
              </>
            )}
          </div>

          <IconButton
            label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto lg:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </IconButton>
        </nav>

        {open ? (
          <div className="mt-2 overflow-hidden rounded-3xl bg-white/[0.08] p-4 backdrop-blur-md ring-1 ring-white/15 lg:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              {profile ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Dashboard
                </Link>
              ) : null}
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
              {profile ? (
                <Button
                  variant="ghost"
                  icon={<LogOutIcon />}
                  iconPosition="left"
                  className="w-full"
                  onClick={logout}
                >
                  Sign out
                </Button>
              ) : (
                <>
                  <ButtonLink
                    href="/login"
                    variant="ghost"
                    icon={<LogInIcon />}
                    iconPosition="left"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </ButtonLink>
                  <ButtonLink
                    href="/signup"
                    icon={<ArrowRightIcon />}
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Get started
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
