"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminTable, AdminTd, ActionIconButton, StatusPill } from "@/components/AdminTable";
import { Button, ButtonLink } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRightIcon, LogInIcon, PencilIcon } from "@/components/icons";
import { Modal } from "@/components/Modal";
import { Pagination } from "@/components/Pagination";
import { Select } from "@/components/Select";
import { PageLoader, Spinner } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { api, type AdminUser, type PaginationMeta, type Profile } from "@/lib/api";
import { getAccessToken, getProfile } from "@/lib/auth";

const PAGE_SIZE = 20;

function roleTone(role: AdminUser["role"]) {
  if (role === "admin") return "warn" as const;
  if (role === "seller") return "info" as const;
  return "success" as const;
}

export default function AdminUsersPage() {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<"buyer" | "seller" | "admin">("buyer");
  const [editName, setEditName] = useState("");

  const token = typeof window !== "undefined" ? getAccessToken() : null;

  async function loadUsers(
    activeProfile: Profile,
    opts?: { page?: number; q?: string; role?: string }
  ) {
    if (activeProfile.role !== "admin" || !token) return;
    setLoading(true);
    try {
      const data = await api.adminListUsers(token, {
        q: (opts?.q ?? debouncedQ) || undefined,
        role: (opts?.role ?? roleFilter) === "all" ? undefined : opts?.role ?? roleFilter,
        page: opts?.page ?? page,
        limit: PAGE_SIZE,
      });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setReady(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, roleFilter]);

  useEffect(() => {
    if (profile?.role === "admin") {
      loadUsers(profile, { page, q: debouncedQ, role: roleFilter });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.role, page, debouncedQ, roleFilter]);

  function openEdit(user: AdminUser) {
    setEditing(user);
    setEditRole(user.role);
    setEditName(user.display_name);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token || !profile || !editing) return;
    setSaving(true);
    try {
      await api.adminUpdateUser(token, editing.id, {
        role: editRole,
        display_name: editName.trim(),
      });
      toast.success("User updated");
      setEditing(null);
      await loadUsers(profile, { page, q: debouncedQ, role: roleFilter });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update user");
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <PageLoader label="Loading…" />;

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

  if (profile.role !== "admin") {
    return (
      <FadeIn>
        <div className="glass-strong mx-auto max-w-lg rounded-3xl p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Admin only</h1>
          <ButtonLink href="/dashboard" className="mt-6" icon={<ArrowRightIcon />}>
            Back to dashboard
          </ButtonLink>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
            Admin · Accounts
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            User <span className="text-aurora">management</span>
          </h1>
          <p className="mt-2 text-sm text-mist">
            Review accounts in a clean table. Update roles and display names without leaving the
            page.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:p-4">
          <input
            className="glass-input min-w-0 flex-1"
            placeholder="Search name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            className="sm:w-44"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: "all", label: "All roles" },
              { value: "buyer", label: "Buyer" },
              { value: "seller", label: "Seller" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm text-mist sm:min-w-[7rem]">
            {loading ? (
              <Spinner size="sm" />
            ) : (
              `${pagination?.total?.toLocaleString("en-GB") ?? users.length} users`
            )}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        {loading && !users.length ? (
          <div className="glass flex items-center justify-center gap-2 rounded-2xl p-10 text-sm text-mist">
            <Spinner size="sm" /> Loading users…
          </div>
        ) : (
          <>
            <AdminTable
              columns={["User", "Email", "Role", "Verified", "Joined", "Actions"]}
              empty={
                !users.length ? (
                  <div className="px-5 py-10 text-center text-sm text-mist">
                    No users match your filters.
                  </div>
                ) : null
              }
            >
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-white/[0.03]">
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal/30 to-gold/20 text-xs font-semibold text-white">
                        {user.display_name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="font-medium text-white">{user.display_name}</span>
                    </div>
                  </AdminTd>
                  <AdminTd>
                    <span className="text-white/75">{user.email}</span>
                  </AdminTd>
                  <AdminTd>
                    <StatusPill value={user.role} tone={roleTone(user.role)} />
                  </AdminTd>
                  <AdminTd>
                    <StatusPill
                      value={user.email_verified ? "Verified" : "Pending"}
                      tone={user.email_verified ? "success" : "warn"}
                    />
                  </AdminTd>
                  <AdminTd>
                    <span className="whitespace-nowrap text-white/60">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <ActionIconButton label="Edit user" onClick={() => openEdit(user)}>
                      <PencilIcon />
                    </ActionIconButton>
                  </AdminTd>
                </tr>
              ))}
            </AdminTable>
            <div className="mt-4">
              <Pagination meta={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </FadeIn>

      <Modal
        open={Boolean(editing)}
        onClose={() => !saving && setEditing(null)}
        title="Edit user"
        description={editing ? editing.email : undefined}
      >
        {editing ? (
          <form onSubmit={onSave} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-white/50">
                Display name
              </span>
              <input
                className="glass-input"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-white/50">
                Role
              </span>
              <Select
                value={editRole}
                onChange={(e) =>
                  setEditRole(e.target.value as "buyer" | "seller" | "admin")
                }
                options={[
                  { value: "buyer", label: "Buyer" },
                  { value: "seller", label: "Seller" },
                  { value: "admin", label: "Admin" },
                ]}
              />
            </label>
            <p className="text-xs leading-relaxed text-white/45">
              One role per account. Promoting someone to admin gives full inventory and user access.
            </p>
            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" disabled={saving} onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving} icon={<ArrowRightIcon />}>
                Save changes
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
