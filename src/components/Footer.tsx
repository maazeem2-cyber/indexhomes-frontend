import Link from "next/link";
import { AppDownloadButtons } from "@/components/AppDownloadButtons";
import { Logo } from "@/components/Logo";

const explore = [
  { href: "/plots", label: "Browse plots" },
  { href: "/community", label: "Community & Events" },
  { href: "/#faq", label: "FAQ" },
  { href: "/signup", label: "Get started" },
  { href: "/login", label: "Sign in" },
];

const product = [
  { href: "/#index", label: "Platform index" },
  { href: "/plots", label: "Available inventory" },
  { href: "/community", label: "Seminars & updates" },
  { href: "/#faq", label: "FAQ" },
  { href: "/dashboard", label: "Buyer portfolio" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-4 border-t border-white/10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="site-shell py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,auto))] lg:gap-8 xl:gap-12">
          <div className="max-w-md sm:col-span-2 lg:col-span-1">
            <Logo compact />
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Trade virtual plots against one unified platform index. Ownership stays in our
              database. Payments via Stripe. Built for web now, ready for mobile apps later.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-mist">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              Index starts at 10.0 · GBP only
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-mist transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5">
              {product.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-mist transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Download the app
            </h3>
            <AppDownloadButtons className="mt-4" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {year} IndexHomes. Virtual property trading platform.
          </p>
          <p className="text-xs text-white/40 sm:text-right">
            No crypto · No wallets · Card payments via Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}
