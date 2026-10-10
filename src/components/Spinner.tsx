type SpinnerSize = "sm" | "md" | "lg";

const SIZE: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-[1.5px]",
  md: "h-5 w-5 border-2",
  lg: "h-9 w-9 border-[2.5px]",
};

export function Spinner({
  size = "md",
  className = "",
  label = "Loading",
}: {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`spinner inline-block shrink-0 rounded-full ${SIZE[size]} ${className}`}
    />
  );
}

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16" role="status">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-teal/20 blur-xl" />
        <Spinner size="lg" label={label} className="relative border-white/15 border-t-teal-soft" />
      </div>
      <p className="text-sm text-mist">{label}</p>
    </div>
  );
}
