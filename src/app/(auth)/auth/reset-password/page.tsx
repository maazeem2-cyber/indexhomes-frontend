"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { AuthLogo } from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";

function readRecoveryTokens() {
  if (typeof window === "undefined") return { access_token: "", refresh_token: "" };
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return {
    access_token: hash.get("access_token") || query.get("access_token") || "",
    refresh_token: hash.get("refresh_token") || query.get("refresh_token") || "",
  };
}

export default function ResetPasswordPage() {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const tokens = readRecoveryTokens();
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    setReady(true);
  }, []);

  const canSubmit = useMemo(
    () => Boolean(accessToken) && password.length >= 8 && password === confirm,
    [accessToken, password, confirm]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await api.resetPassword({
        access_token: accessToken,
        refresh_token: refreshToken || undefined,
        new_password: password,
        confirm_password: confirm,
      });
      setDone(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  return (
    <div className="auth-card">
      <AuthLogo />
      <h1>Reset password</h1>
      <p className="muted small">Choose a new password for your IndexHomes account.</p>

      {!accessToken ? (
        <div className="space-y-4">
          <p className="text-sm text-mist">
            This reset link is missing or expired. Request a new one from the forgot password page.
          </p>
          <Link href="/forgot-password" className="text-sm font-medium text-teal-soft">
            Request a new link
          </Link>
        </div>
      ) : done ? (
        <div className="space-y-4">
          <p className="text-sm text-mist">Your password has been updated. You can sign in now.</p>
          <Link href="/login" className="text-sm font-medium text-teal-soft">
            Go to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="field">
            <label className="label" htmlFor="reset-password">
              New password
            </label>
            <input
              id="reset-password"
              className="input"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="reset-confirm">
              Confirm new password
            </label>
            <input
              id="reset-confirm"
              className="input"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="block" loading={loading} disabled={!canSubmit}>
            Update password
          </Button>
        </form>
      )}
    </div>
  );
}
