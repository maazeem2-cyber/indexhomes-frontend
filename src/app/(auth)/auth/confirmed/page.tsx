"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ButtonLink } from "@/components/Button";
import { LogInIcon } from "@/components/icons";
import { AuthLogo } from "@/components/Logo";
import { useToast } from "@/components/Toast";

export default function EmailConfirmedPage() {
  const toast = useToast();

  useEffect(() => {
    toast.success("Email confirmed. You can sign in now.");
  }, [toast]);

  return (
    <div className="auth-card">
      <AuthLogo />

      <h1>Email confirmed</h1>
      <p className="muted small">
        Your address is verified. Sign in to open your IndexHomes dashboard.
      </p>

      <ButtonLink href="/login" variant="block" icon={<LogInIcon />}>
        Sign in
      </ButtonLink>

      <div className="row-between">
        <Link href="/">Back home</Link>
        <Link href="/signup">Create another account</Link>
      </div>
    </div>
  );
}
