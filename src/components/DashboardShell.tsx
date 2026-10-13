"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRightIcon,
  GridIcon,
  LogOutIcon,
  PlusIcon,
  TagIcon,
  UsersIcon,
} from "@/components/icons";
import { Logo } from "@/components/Logo";
import { clearAuth, getProfile, getSession, logoutToLogin } from "@/lib/auth";
import type { Profile } from "@/lib/api";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  roles?: Array<Profile["role"]>;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: <GridIcon className="h-4 w-4" />,
      },
      {
        href: "/plots",
        label: "Marketplace",
        icon: <TagIcon className="h-4 w-4" />,
      },
      {
        href: "/community",
        label: "Community",
        icon: <UsersIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        href: "/dashboard/plots",
        label: "Plots",
        icon: <PlusIcon className="h-4 w-4" />,
        roles: ["admin"],
      },
      {
        href: "/dashboard/users",
        label: "Users",
        icon: <UsersIcon className="h-4 w-4" />,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        href: "/dashboard/profile",
        label: "Profile",
        icon: <UsersIcon className="h-4 w-4" />,
      },
      {
        href: "/plots",
        label: "Browse plots",
        icon: <TagIcon className="h-4 w-4" />,
        roles: ["buyer", "seller"],
      },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    const stored = getProfile();
    if (!session?.access_token || !stored) {
      logoutToLogin(stored ? "expired" : "required");
      return;
    }
    setProfile(stored);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function logout() {
    clearAuth();
    window.location.href = "/";
  }

  const role = profile?.role;

  const sections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (!item.roles) return true;
      if (!role) return false;
      return item.roles.includes(role);
    }),
  })).filter((section) => section.items.length > 0);

  const initials = (profile?.display_name || "IH")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#07111f]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/10 bg-[#0a1628]/95 backdrop-blur-xl lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo compact />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Control panel
          </p>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={`${section.title}-${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? "bg-teal/20 text-white shadow-[inset_0_0_0_1px_rgba(62,207,191,0.35)]"
                            : "text-white/65 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <span
                          className={active ? "text-teal-soft" : "text-white/45"}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal/25 text-xs font-semibold text-teal-soft">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {profile?.display_name || "Guest"}
              </p>
              <p className="truncate text-[11px] capitalize text-mist">
                {profile?.role || "signed out"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/10 bg-[#0a1628] transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Logo compact />
          <button
            type="button"
            className="rounded-lg border border-white/10 px-2 py-1 text-sm text-white/70"
            onClick={() => setMobileOpen(false)}
          >
            Close
          </button>
        </div>
        <nav className="space-y-5 px-3 py-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={`m-${section.title}-${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                          active
                            ? "bg-teal/20 text-white"
                            : "text-white/70 hover:bg-white/[0.05]"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-[260px]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07111f]/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white lg:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  IndexHomes
                </p>
                <p className="text-sm font-medium text-white/85">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/65 transition hover:text-white sm:inline-flex"
              >
                Marketing site
              </Link>
              {profile ? (
                <>
                  <span className="hidden items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal-soft sm:inline-flex">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal/25 text-[10px]">
                      {initials}
                    </span>
                    {profile.display_name}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#f2d7a8] to-[#d4b483] px-4 py-2 text-xs font-semibold text-[#1a1408] shadow-[0_8px_20px_-8px_rgba(212,180,131,0.7)] transition hover:brightness-105"
                  >
                    <LogOutIcon className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white"
                >
                  Sign in
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
