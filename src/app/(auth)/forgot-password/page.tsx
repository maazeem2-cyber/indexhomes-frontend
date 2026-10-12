"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { AuthLogo } from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.forgotPassword(email.trim());
      setSent(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <AuthLogo />
      <h1>Forgot password</h1>
      <p className="muted small">
        Enter your account email and we will send a secure link to reset your password.
      </p>

      {sent ? (
        <div className="space-y-4">
          <p className="text-sm text-mist">
            If that email is registered, a reset link is on its way. Check your inbox and spam folder.
          </p>
          <Link href="/login" className="text-sm font-medium text-teal-soft">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="field">
            <label className="label" htmlFor="forgot-email">
              Email
            </label>
            <input
              id="forgot-email"
              className="input"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" variant="block" loading={loading}>
            Send reset link
          </Button>
          <div className="row-between mt-4">
            <Link href="/login">Back to sign in</Link>
            <Link href="/signup">Create an account</Link>
          </div>
        </form>
      )}
    </div>
  );
}
