const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  token_type?: string;
};

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  role: "buyer" | "seller" | "admin";
  email_verified: boolean;
};

export type PlatformIndex = {
  starting_index: number;
  current_index: number;
  total_platform_value: number;
  total_units_issued: number;
  updated_at: string;
};

export type Plot = {
  id: string;
  name: string;
  description: string;
  base_price: number;
  display_price?: number;
  status: "available" | "sold" | "reserved";
  owner_id: string | null;
  image_url: string | null;
  location: string;
  tags: string[];
  just_added?: boolean;
  currency?: string;
};

type ApiSuccess<T> = { success: true; data: T };
type ApiFail = { success: false; error: { message: string; code?: string } };

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = (await res.json()) as ApiSuccess<T> | ApiFail;

  if (!res.ok || !json.success) {
    const message = !json.success ? json.error.message : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json.data;
}

export const api = {
  getIndex: () => request<PlatformIndex>("/index"),
  getIndexHistory: (range: string) =>
    request<{
      range: string;
      current_index: number;
      change_pct: number;
      rising: boolean;
      updated_at: string;
      points: { t: string; v: number }[];
    }>(`/index/history?range=${range}`),
  getPlots: (params?: { status?: string; q?: string; location?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.q) qs.set("q", params.q);
    if (params?.location) qs.set("location", params.location);
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<{ plots: Plot[]; index: PlatformIndex }>(`/plots${suffix}`);
  },
  register: (body: {
    email: string;
    password: string;
    display_name: string;
    role: "buyer" | "seller";
  }) =>
    request<{ message: string; session: Session | null }>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{
      user: { id: string; email: string; profile: Profile };
      session: Session;
    }>(`/auth/login`, { method: "POST", body: JSON.stringify(body) }),
  me: (token: string) =>
    request<{ id: string; email: string; profile: Profile }>(`/auth/me`, {}, token),
  adminMetrics: (token: string) =>
    request<{
      users: number;
      plots_available: number;
      plots_sold: number;
      sales: number;
      index: PlatformIndex;
    }>(`/admin/metrics`, {}, token),
};

export function formatGbp(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(n);
}
