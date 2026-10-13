"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { LogInIcon } from "@/components/icons";
import { AuthLogo } from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "1") {
      toast.info("Your session expired. Please sign in again.");
    }
  }, [toast]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      saveAuth(data.session, data.user.profile);
      toast.success("Signed in successfully");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <AuthLogo />

      <h1>Welcome to new or existing users</h1>
      <p className="muted small">
        Create or Sign in to browse plots, track the live index, and manage your portfolio.
      </p>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className="input"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            className="input"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" variant="block" loading={loading} icon={<LogInIcon />}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="row-between">
        <Link href="/forgot-password">Forgot password?</Link>
        <Link href="/signup">Create an account</Link>
      </div>
    </div>
  );
}
