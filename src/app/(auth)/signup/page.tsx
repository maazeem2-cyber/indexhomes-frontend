"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { UserPlusIcon } from "@/components/icons";
import { AuthLogo } from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function SignupPage() {
  const toast = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await api.register({
        email,
        password,
        display_name: displayName,
        role,
      });
      if (data.session) {
        const me = await api.me(data.session.access_token);
        saveAuth(data.session, me.profile);
        toast.success("Account created. Welcome aboard.");
        window.location.href = "/dashboard";
        return;
      }
      toast.success(data.message || "Registered. Check your email to verify before signing in.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <AuthLogo />

      <h1>Create your IndexHomes account</h1>
      <p className="muted small">
        Join as a buyer or seller. Email verification is on for v1. One role per account.
      </p>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="signup-name">
            Display name
          </label>
          <input
            id="signup-name"
            className="input"
            required
            minLength={2}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            className="input"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
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
          <label className="label" htmlFor="signup-confirm-password">
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            className="input"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <span className="label">Role</span>
          <div className="role-grid">
            {(["buyer", "seller"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`role-chip ${role === r ? "is-active" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="block" loading={loading} icon={<UserPlusIcon />}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>

      <div className="row-between">
        <Link href="/">Back home</Link>
        <Link href="/login">Sign in</Link>
      </div>
    </div>
  );
}
