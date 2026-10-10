import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string;
  className?: string;
  compact?: boolean;
  showTagline?: boolean;
};

function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Image
      src="/images/brand/indexhomes-mark-on-dark.svg"
      alt=""
      width={36}
      height={36}
      className={`flex-none object-contain ${className}`.trim()}
      priority
      unoptimized
    />
  );
}

function BrandWordmark({
  subtitle,
  showTagline = true,
}: {
  subtitle?: string;
  showTagline?: boolean;
}) {
  return (
    <span className="flex flex-col justify-center leading-none">
      <span className="font-display text-[0.95rem] font-semibold tracking-tight text-white sm:text-[1.05rem]">
        IndexHomes
        {subtitle ? <span className="font-normal text-white/45"> {subtitle}</span> : null}
      </span>
      {showTagline ? (
        <span className="-mt-px hidden items-center gap-1.5 pt-0.5 text-[10px] font-medium leading-none tracking-wide text-gold min-[380px]:flex">
          <span className="h-px w-2.5 shrink-0 bg-gold/70" aria-hidden />
          Grow Together
          <span className="h-px w-2.5 shrink-0 bg-gold/70" aria-hidden />
        </span>
      ) : null}
    </span>
  );
}

export function Logo({
  href = "/",
  className = "",
  compact = false,
  showTagline = true,
}: Props) {
  const inner = compact ? (
    <span className={`inline-flex min-w-0 items-center gap-2 sm:gap-2.5 ${className}`.trim()}>
      <BrandMark className="h-8 w-8 sm:h-9 sm:w-9" />
      <span className="min-w-0">
        <BrandWordmark showTagline={showTagline} />
      </span>
    </span>
  ) : (
    <Image
      src="/images/brand/indexhomes-logo-on-dark.svg"
      alt="IndexHomes — Grow Together"
      width={220}
      height={56}
      className={`h-10 w-auto sm:h-11 ${className}`.trim()}
      priority
      unoptimized
    />
  );

  return (
    <Link href={href} className="group inline-flex flex-none items-center" aria-label="IndexHomes home">
      {inner}
    </Link>
  );
}

export function AuthLogo() {
  return (
    <div className="mb-6 flex items-center gap-2.5">
      <BrandMark />
      <BrandWordmark subtitle="Trading" />
    </div>
  );
}
