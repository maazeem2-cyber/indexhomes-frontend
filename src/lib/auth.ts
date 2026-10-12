"use client";

import type { Profile, Session } from "./api";

const SESSION_KEY = "indexhomes_session";
const PROFILE_KEY = "indexhomes_profile";

export function saveAuth(session: Session, profile: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PROFILE_KEY);
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
