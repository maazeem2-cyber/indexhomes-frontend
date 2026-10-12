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
  created_at?: string;
  updated_at?: string;
};

export type AdminUser = Profile;

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
  created_at?: string;
  updated_at?: string;
};

export type PlotInput = {
  name: string;
  description: string;
  base_price: number | string;
  location: string;
  status?: "available" | "sold" | "reserved";
  tags?: string[] | string;
  just_added?: boolean;
  image?: File | null;
  image_url?: string | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type ListParams = {
  status?: string;
  q?: string;
  location?: string;
  role?: string;
  page?: number;
  limit?: number;
};

type ApiSuccess<T> = { success: true; data: T };
type ApiFail = { success: false; error: { message: string; code?: string } };

async function parseJson<T>(res: Response): Promise<T> {
  let json: ApiSuccess<T> | ApiFail;
  try {
    json = (await res.json()) as ApiSuccess<T> | ApiFail;
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok || !json.success) {
    const message = !json.success ? json.error.message : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json.data;
}

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

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Could not reach the IndexHomes API. Check that the backend is running.");
  }

  return parseJson<T>(res);
}

function toFormData(input: Partial<PlotInput>, { requireCore = true } = {}) {
  const form = new FormData();
  if (requireCore || input.name !== undefined) form.append("name", String(input.name ?? ""));
  if (requireCore || input.description !== undefined) {
    form.append("description", String(input.description ?? ""));
  }
  if (requireCore || input.base_price !== undefined) {
    form.append("base_price", String(input.base_price ?? ""));
  }
  if (requireCore || input.location !== undefined) {
    form.append("location", String(input.location ?? ""));
  }
  if (input.status) form.append("status", input.status);
  if (input.just_added !== undefined) form.append("just_added", String(input.just_added));
  if (input.tags !== undefined) {
    const tags = Array.isArray(input.tags) ? input.tags.join(",") : input.tags;
    form.append("tags", tags);
  }
  if (input.image_url) form.append("image_url", input.image_url);
  if (input.image) form.append("image", input.image);
  return form;
}

async function formRequest<T>(
  path: string,
  method: "POST" | "PATCH",
  form: FormData,
  token: string
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
  } catch {
    throw new Error("Could not reach the IndexHomes API. Check that the backend is running.");
  }
  return parseJson<T>(res);
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
  getPlots: (params?: ListParams) => {
    const qs = buildListQuery(params);
    return request<{ plots: Plot[]; index: PlatformIndex; pagination: PaginationMeta }>(
      `/plots${qs}`
    );
  },
  getPlot: (id: string) =>
    request<{ plot: Plot; index: PlatformIndex }>(`/plots/${id}`),
  getPlotLocations: () => request<{ locations: string[] }>("/plots/meta/locations"),
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
  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (body: {
    access_token: string;
    refresh_token?: string;
    new_password: string;
    confirm_password: string;
  }) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateProfile: (token: string, body: { display_name: string }) =>
    request<{ profile: Profile }>(
      "/auth/profile",
      { method: "PATCH", body: JSON.stringify(body) },
      token
    ),
  changePassword: (
    token: string,
    body: { current_password: string; new_password: string; confirm_password: string }
  ) =>
    request<{ message: string }>(
      "/auth/change-password",
      { method: "POST", body: JSON.stringify(body) },
      token
    ),
  adminMetrics: (token: string) =>
    request<{
      users: number;
      plots_available: number;
      plots_sold: number;
      sales: number;
      index: PlatformIndex;
    }>(`/admin/metrics`, {}, token),
  adminListPlots: (token: string, params?: ListParams) => {
    const qs = buildListQuery(params);
    return request<{ plots: Plot[]; index: PlatformIndex; pagination: PaginationMeta }>(
      `/admin/plots${qs}`,
      {},
      token
    );
  },
  adminCreatePlot: (token: string, input: PlotInput) =>
    formRequest<{ plot: Plot }>("/admin/plots", "POST", toFormData(input, { requireCore: true }), token),
  adminUpdatePlot: (token: string, id: string, input: Partial<PlotInput>) =>
    formRequest<{ plot: Plot }>(
      `/admin/plots/${id}`,
      "PATCH",
      toFormData(input, { requireCore: false }),
      token
    ),
  adminDeletePlot: (token: string, id: string) =>
    request<{ deleted: boolean; id: string }>(
      `/admin/plots/${id}`,
      { method: "DELETE" },
      token
    ),
  adminListUsers: (token: string, params?: ListParams) => {
    const qs = buildListQuery(params);
    return request<{ users: AdminUser[]; pagination: PaginationMeta }>(
      `/admin/users${qs}`,
      {},
      token
    );
  },
  adminUpdateUser: (
    token: string,
    id: string,
    body: { role?: "buyer" | "seller" | "admin"; display_name?: string }
  ) =>
    request<{ user: AdminUser }>(
      `/admin/users/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
      token
    ),
};

function buildListQuery(params?: ListParams) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);
  if (params?.location) qs.set("location", params.location);
  if (params?.role) qs.set("role", params.role);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const raw = qs.toString();
  return raw ? `?${raw}` : "";
}

export function formatGbp(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(n);
}

export function plotImageSrc(plot: Pick<Plot, "image_url">) {
  return plot.image_url || null;
}
