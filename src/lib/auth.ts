"use client";

import type { Profile, Session } from "./api";

const SESSION_KEY = "indexhomes_session";
const PROFILE_KEY = "indexhomes_profile";

export function saveAuth(session: Session, profile: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function updateStoredSession(session: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

/** Clears local session and sends the user to sign in again. */
export function logoutToLogin(reason: "expired" | "required" = "expired") {
  if (typeof window === "undefined") return;
  const onLogin = window.location.pathname.startsWith("/login");
  clearAuth();
  if (onLogin) return;
  const params = new URLSearchParams();
  if (reason === "expired") params.set("expired", "1");
  const qs = params.toString();
  window.location.replace(qs ? `/login?${qs}` : "/login");
}

export function isAccessTokenExpiring(session: Session | null = getSession(), skewSeconds = 30) {
  if (!session?.expires_at) return false;
  return Date.now() / 1000 >= session.expires_at - skewSeconds;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return getSession()?.access_token || null;
}

export function updateStoredProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
