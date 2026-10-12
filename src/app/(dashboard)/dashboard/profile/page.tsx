"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRightIcon, LogInIcon } from "@/components/icons";
import { PageLoader } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { api, type Profile } from "@/lib/api";
import { getAccessToken, getProfile, updateStoredProfile } from "@/lib/auth";

export default function ProfilePage() {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const token = typeof window !== "undefined" ? getAccessToken() : null;

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setDisplayName(p?.display_name || "");
    setReady(true);
  }, []);

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!token || !profile) return;
    setSavingProfile(true);
    try {
      const data = await api.updateProfile(token, { display_name: displayName.trim() });
      setProfile(data.profile);
      updateStoredProfile(data.profile);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const data = await api.changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  }

  if (!ready) return <PageLoader label="Loading profile…" />;

  if (!profile) {
    return (
      <FadeIn>
        <div className="glass-strong mx-auto max-w-lg rounded-3xl p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Sign in required</h1>
          <ButtonLink href="/login" className="mt-6" icon={<LogInIcon />} iconPosition="left">
            Sign in
          </ButtonLink>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
          Account
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Your <span className="text-aurora">profile</span>
        </h1>
        <p className="mt-2 text-sm text-mist">
          Update your display name and password. Role stays fixed to one account type.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form onSubmit={onSaveProfile} className="glass space-y-4 rounded-2xl p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Profile details</h2>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-white/50">Email</span>
            <input className="glass-input opacity-70" value={profile.email} disabled readOnly />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-white/50">Role</span>
            <input
              className="glass-input capitalize opacity-70"
              value={profile.role}
              disabled
              readOnly
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-white/50">
              Display name
            </span>
            <input
              className="glass-input"
              required
              minLength={2}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <Button type="submit" loading={savingProfile} icon={<ArrowRightIcon />}>
            Save profile
          </Button>
        </form>
      </FadeIn>

      <FadeIn delay={0.1}>
        <form onSubmit={onChangePassword} className="glass space-y-4 rounded-2xl p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Change password</h2>
          <p className="text-sm text-mist">
            Enter your current password, then confirm the new password before saving.
          </p>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-white/50">
              Current password
            </span>
            <input
              className="glass-input"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-white/50">
              New password
            </span>
            <input
              className="glass-input"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-white/50">
              Confirm new password
            </span>
            <input
              className="glass-input"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <Button type="submit" loading={savingPassword} icon={<ArrowRightIcon />}>
            Update password
          </Button>
        </form>
      </FadeIn>
    </div>
  );
}
