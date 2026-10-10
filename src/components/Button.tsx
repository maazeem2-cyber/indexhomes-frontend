"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "ghost" | "block";

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  block: "btn-block",
};

type SharedProps = {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
};

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

type ButtonLinkProps = SharedProps & {
  href: string;
  onClick?: () => void;
};

function content({
  loading,
  icon,
  iconPosition,
  children,
}: Pick<SharedProps, "loading" | "icon" | "iconPosition" | "children">) {
  if (loading) {
    return (
      <>
        <Spinner size="sm" className="spinner-inline" />
        <span>{children}</span>
      </>
    );
  }

  if (!icon) return children;

  return iconPosition === "left" ? (
    <>
      <span className="btn-icon">{icon}</span>
      <span>{children}</span>
    </>
  ) : (
    <>
      <span>{children}</span>
      <span className="btn-icon">{icon}</span>
    </>
  );
}

export function Button({
  variant = "primary",
  loading = false,
  icon,
  iconPosition = "right",
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`btn-iconed ${VARIANT[variant]} ${className}`.trim()}
      {...rest}
    >
      {content({ loading, icon, iconPosition, children })}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  loading = false,
  icon,
  iconPosition = "right",
  children,
  className = "",
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`btn-iconed ${VARIANT[variant]} ${className}`.trim()}
      aria-busy={loading || undefined}
    >
      {content({ loading, icon, iconPosition, children })}
    </Link>
  );
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
  label: string;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

export function IconButton({
  label,
  loading = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      disabled={disabled || loading}
      className={`btn-icon-only ${className}`.trim()}
      {...rest}
    >
      {loading ? <Spinner size="sm" className="spinner-inline" /> : children}
    </button>
  );
}
