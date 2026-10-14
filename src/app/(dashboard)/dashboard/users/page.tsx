"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminCard,
  AdminTable,
  AdminTd,
  AdminTr,
  ActionIconButton,
  MetaGrid,
  StatusPill,
} from "@/components/AdminTable";
import { Button, ButtonLink } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import {
  ArrowRightIcon,
  BanIcon,
  CheckCircleIcon,
  LogInIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Modal } from "@/components/Modal";
import { Pagination } from "@/components/Pagination";
import { Select } from "@/components/Select";
import { FilterToolbar } from "@/components/FilterToolbar";
import { TableSkeleton } from "@/components/Skeleton";
import { PageLoader } from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { api, type AdminUser, type PaginationMeta, type Profile } from "@/lib/api";
import { getAccessToken, getProfile } from "@/lib/auth";

const PAGE_SIZE = 20;
const SUPER_ADMIN_EMAIL = "maazeem2@icloud.com";

type ConfirmState =
  | { type: "edit"; user: AdminUser }
  | { type: "save" }
  | { type: "deactivate"; user: AdminUser }
  | { type: "activate"; user: AdminUser }
  | { type: "delete"; user: AdminUser }
  | null;

function roleTone(role: AdminUser["role"]) {
  if (role === "admin") return "warn" as const;
  if (role === "seller") return "info" as const;
  return "success" as const;
}

function isSuperAdmin(user: Pick<AdminUser, "email">) {
  return user.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

export default function AdminUsersPage() {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState(false);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<"buyer" | "seller" | "admin">("buyer");
  const [editName, setEditName] = useState("");
  const [confirm, setConfirm] = useState<ConfirmState>(null);

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

  function fillEditForm(user: AdminUser) {
    setEditing(user);
    setEditRole(user.role);
    setEditName(user.display_name);
  }

  function requestEdit(user: AdminUser) {
    setConfirm({ type: "edit", user });
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token || !profile || !editing) return;
    setConfirm({ type: "save" });
  }

  async function performSave() {
    if (!token || !profile || !editing) return;
    setSaving(true);
    try {
      const payload: {
        role?: "buyer" | "seller" | "admin";
        display_name: string;
      } = {
        display_name: editName.trim(),
      };
      if (!isSuperAdmin(editing)) {
        payload.role = editRole;
      }
      await api.adminUpdateUser(token, editing.id, payload);
      toast.success("User updated");
      setConfirm(null);
      setEditing(null);
      await loadUsers(profile, { page, q: debouncedQ, role: roleFilter });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update user");
    } finally {
      setSaving(false);
    }
  }

  async function performToggleActive(user: AdminUser, nextActive: boolean) {
    if (!token || !profile) return;
    setActing(true);
    try {
      await api.adminUpdateUser(token, user.id, { is_active: nextActive });
      toast.success(nextActive ? "User reactivated" : "User deactivated");
      setConfirm(null);
      await loadUsers(profile, { page, q: debouncedQ, role: roleFilter });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update account status");
    } finally {
      setActing(false);
    }
  }

  async function performDelete(user: AdminUser) {
    if (!token || !profile) return;
    setActing(true);
    try {
      await api.adminDeleteUser(token, user.id);
      toast.success("User deleted");
      setConfirm(null);
      await loadUsers(profile, { page, q: debouncedQ, role: roleFilter });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete user");
    } finally {
      setActing(false);
    }
  }

  async function handleConfirm() {
    if (!confirm) return;
    if (confirm.type === "edit") {
      const user = confirm.user;
      setConfirm(null);
      fillEditForm(user);
      return;
    }
    if (confirm.type === "save") {
      await performSave();
      return;
    }
    if (confirm.type === "deactivate") {
      await performToggleActive(confirm.user, false);
      return;
    }
    if (confirm.type === "activate") {
      await performToggleActive(confirm.user, true);
      return;
    }
    if (confirm.type === "delete") {
      await performDelete(confirm.user);
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

  const confirmBusy = saving || acting;

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
            Admin · Accounts
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            User <span className="text-aurora">management</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-mist">
            Review accounts in a clean table. Update roles, deactivate access, or remove unused
            accounts.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        {loading && !users.length ? (
          <TableSkeleton rows={5} />
        ) : (
          <>
            <AdminTable
              columns={["Account", "Role", "Status", "Verified", "Actions"]}
              toolbar={
                <FilterToolbar
                  compact
                  searchValue={q}
                  onSearchChange={setQ}
                  searchLabel="Search users"
                  searchPlaceholder="Search these results"
                  resultLabel={`${pagination?.total?.toLocaleString("en-GB") ?? users.length} users`}
                  loading={loading}
                  filters={[
                    {
                      id: "role",
                      label: "Role",
                      value: roleFilter,
                      onChange: setRoleFilter,
                      options: [
                        { value: "all", label: "All roles" },
                        { value: "buyer", label: "Buyer" },
                        { value: "seller", label: "Seller" },
                        { value: "admin", label: "Admin" },
                      ],
                    },
                  ]}
                />
              }
              empty={
                !users.length ? (
                  <div className="px-5 py-10 text-center text-sm text-mist">
                    No users match your filters.
                  </div>
                ) : null
              }
              mobileCards={users.map((user) => {
                const superAdmin = isSuperAdmin(user);
                const active = user.is_active !== false;
                return (
                  <AdminCard key={`m-${user.id}`}>
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.06] text-sm font-semibold text-teal-soft">
                        {user.display_name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-teal-soft">
                              {user.display_name}
                            </p>
                            {superAdmin ? (
                              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-gold/80">
                                Super admin
                              </p>
                            ) : null}
                          </div>
                          <StatusPill
                            value={active ? "Active" : "Inactive"}
                            tone={active ? "success" : "danger"}
                          />
                        </div>
                        <MetaGrid
                          dense
                          items={[
                            { label: "Email", value: user.email },
                            {
                              label: "Joined",
                              value: user.created_at
                                ? new Date(user.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—",
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                      <div className="flex flex-wrap gap-2">
                        <StatusPill value={user.role} tone={roleTone(user.role)} />
                        <StatusPill
                          value={user.email_verified ? "Verified" : "Pending"}
                          tone={user.email_verified ? "success" : "warn"}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <ActionIconButton
                          label={superAdmin ? "Edit display name" : "Edit user"}
                          onClick={() => requestEdit(user)}
                        >
                          <PencilIcon />
                        </ActionIconButton>
                        <ActionIconButton
                          label={active ? "Deactivate user" : "Reactivate user"}
                          tone={active ? "danger" : "accent"}
                          disabled={superAdmin || user.id === profile.id}
                          onClick={() =>
                            setConfirm({
                              type: active ? "deactivate" : "activate",
                              user,
                            })
                          }
                        >
                          {active ? <BanIcon /> : <CheckCircleIcon />}
                        </ActionIconButton>
                        <ActionIconButton
                          label="Delete user"
                          tone="danger"
                          disabled={superAdmin || user.id === profile.id}
                          onClick={() => setConfirm({ type: "delete", user })}
                        >
                          <TrashIcon />
                        </ActionIconButton>
                      </div>
                    </div>
                  </AdminCard>
                );
              })}
            >
              {users.map((user) => {
                const superAdmin = isSuperAdmin(user);
                const active = user.is_active !== false;
                return (
                  <AdminTr key={user.id}>
                    <AdminTd>
                      <div className="flex min-w-[16rem] items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/[0.06] text-sm font-semibold text-teal-soft">
                          {user.display_name.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-teal-soft">
                            {user.display_name}
                          </p>
                          {superAdmin ? (
                            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-gold/80">
                              Super admin
                            </p>
                          ) : null}
                          <MetaGrid
                            items={[
                              { label: "Email", value: user.email },
                              {
                                label: "Joined",
                                value: user.created_at
                                  ? new Date(user.created_at).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "—",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </AdminTd>
                    <AdminTd>
                      <StatusPill value={user.role} tone={roleTone(user.role)} />
                    </AdminTd>
                    <AdminTd>
                      <StatusPill
                        value={active ? "Active" : "Inactive"}
                        tone={active ? "success" : "danger"}
                      />
                    </AdminTd>
                    <AdminTd>
                      <StatusPill
                        value={user.email_verified ? "Verified" : "Pending"}
                        tone={user.email_verified ? "success" : "warn"}
                      />
                    </AdminTd>
                    <AdminTd>
                      <div className="flex items-center gap-1">
                        <ActionIconButton
                          label={superAdmin ? "Edit display name" : "Edit user"}
                          onClick={() => requestEdit(user)}
                        >
                          <PencilIcon />
                        </ActionIconButton>
                        <ActionIconButton
                          label={active ? "Deactivate user" : "Reactivate user"}
                          tone={active ? "danger" : "accent"}
                          disabled={superAdmin || user.id === profile.id}
                          onClick={() =>
                            setConfirm({
                              type: active ? "deactivate" : "activate",
                              user,
                            })
                          }
                        >
                          {active ? <BanIcon /> : <CheckCircleIcon />}
                        </ActionIconButton>
                        <ActionIconButton
                          label="Delete user"
                          tone="danger"
                          disabled={superAdmin || user.id === profile.id}
                          onClick={() => setConfirm({ type: "delete", user })}
                        >
                          <TrashIcon />
                        </ActionIconButton>
                      </div>
                    </AdminTd>
                  </AdminTr>
                );
              })}
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
              {isSuperAdmin(editing) ? (
                <>
                  <div className="glass-input flex items-center text-white/70">Admin (locked)</div>
                  <p className="text-xs leading-relaxed text-gold/80">
                    Super admin role cannot be changed.
                  </p>
                </>
              ) : (
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
              )}
            </label>
            {!isSuperAdmin(editing) ? (
              <p className="text-xs leading-relaxed text-white/45">
                One role per account. Promoting someone to admin gives full inventory and user
                access.
              </p>
            ) : null}
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

      <ConfirmModal
        open={confirm?.type === "edit"}
        title="Edit this user?"
        description={
          confirm?.type === "edit"
            ? isSuperAdmin(confirm.user)
              ? `Open ${confirm.user.display_name} to update their display name. Role stays locked as super admin.`
              : `Open ${confirm.user.display_name} (${confirm.user.email}) to update their name or role.`
            : ""
        }
        confirmLabel="Continue to edit"
        onCancel={() => setConfirm(null)}
        onConfirm={handleConfirm}
      />

      <ConfirmModal
        open={confirm?.type === "save"}
        title="Save user changes?"
        description={
          editing
            ? isSuperAdmin(editing)
              ? `Update display name for ${editing.display_name}. Role remains admin.`
              : `Update ${editing.display_name} to role “${editRole}” with the new display name.`
            : "Save the selected user changes."
        }
        confirmLabel="Save changes"
        loading={saving}
        onCancel={() => !saving && setConfirm(null)}
        onConfirm={handleConfirm}
      />

      <ConfirmModal
        open={confirm?.type === "deactivate"}
        title="Deactivate this user?"
        description={
          confirm?.type === "deactivate"
            ? `${confirm.user.display_name} (${confirm.user.email}) will be blocked from signing in. You can reactivate them later.`
            : ""
        }
        confirmLabel="Deactivate"
        tone="danger"
        loading={acting}
        onCancel={() => !confirmBusy && setConfirm(null)}
        onConfirm={handleConfirm}
      />

      <ConfirmModal
        open={confirm?.type === "activate"}
        title="Reactivate this user?"
        description={
          confirm?.type === "activate"
            ? `${confirm.user.display_name} (${confirm.user.email}) will be able to sign in again.`
            : ""
        }
        confirmLabel="Reactivate"
        loading={acting}
        onCancel={() => !confirmBusy && setConfirm(null)}
        onConfirm={handleConfirm}
      />

      <ConfirmModal
        open={confirm?.type === "delete"}
        title="Delete this user?"
        description={
          confirm?.type === "delete"
            ? `Permanently remove ${confirm.user.display_name} (${confirm.user.email}). Users with purchase history cannot be deleted — deactivate them instead.`
            : ""
        }
        confirmLabel="Delete user"
        tone="danger"
        loading={acting}
        onCancel={() => !confirmBusy && setConfirm(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
