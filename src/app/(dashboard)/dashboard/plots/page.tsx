"use client";

import Image from "next/image";
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
  EyeIcon,
  LogInIcon,
  PencilIcon,
  PlusIcon,
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
import { api, formatGbp, type PaginationMeta, type Plot, type Profile } from "@/lib/api";
import { getAccessToken, getProfile } from "@/lib/auth";

const PAGE_SIZE = 20;

type ConfirmState =
  | { type: "edit"; plot: Plot }
  | { type: "save" }
  | { type: "delete"; plot: Plot }
  | null;

type FormState = {
  name: string;
  description: string;
  base_price: string;
  location: string;
  status: "available" | "sold" | "reserved";
  tags: string;
  just_added: boolean;
  image: File | null;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  base_price: "",
  location: "",
  status: "available",
  tags: "",
  just_added: true,
  image: null,
};

function statusTone(status: Plot["status"]) {
  if (status === "available") return "success" as const;
  if (status === "reserved") return "warn" as const;
  return "neutral" as const;
}

export default function AdminPlotsPage() {
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewPlot, setViewPlot] = useState<Plot | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [deleting, setDeleting] = useState(false);

  const token = typeof window !== "undefined" ? getAccessToken() : null;

  async function loadPlots(activeProfile: Profile, opts?: { page?: number; q?: string; status?: string }) {
    if (activeProfile.role !== "admin" || !token) return;
    setLoading(true);
    try {
      const data = await api.adminListPlots(token, {
        status: opts?.status ?? statusFilter,
        q: (opts?.q ?? debouncedQ) || undefined,
        page: opts?.page ?? page,
        limit: PAGE_SIZE,
      });
      setPlots(data.plots);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load inventory");
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
  }, [debouncedQ, statusFilter]);

  useEffect(() => {
    if (profile?.role === "admin") {
      loadPlots(profile, { page, q: debouncedQ, status: statusFilter });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.role, page, debouncedQ, statusFilter]);

  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setExistingImage(null);
    setPreview(null);
    setModalOpen(true);
  }

  function fillEditForm(plot: Plot) {
    setEditingId(plot.id);
    setForm({
      name: plot.name,
      description: plot.description,
      base_price: String(plot.base_price),
      location: plot.location,
      status: plot.status,
      tags: (plot.tags || []).join(", "),
      just_added: Boolean(plot.just_added),
      image: null,
    });
    setExistingImage(plot.image_url);
    setPreview(null);
    setModalOpen(true);
  }

  function requestEdit(plot: Plot) {
    setConfirm({ type: "edit", plot });
  }

  function requestDelete(plot: Plot) {
    setConfirm({ type: "delete", plot });
  }

  function closeModal(force = false) {
    if (saving && !force) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setPreview(null);
    setExistingImage(null);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || !profile || profile.role !== "admin") return;
    if (!editingId && !form.image) {
      toast.error("Please upload a plot image");
      return;
    }
    setConfirm({ type: "save" });
  }

  async function performSave() {
    if (!token || !profile || profile.role !== "admin") return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        base_price: form.base_price,
        location: form.location.trim(),
        status: form.status,
        tags: form.tags,
        just_added: form.just_added,
        image: form.image,
      };
      if (editingId) {
        await api.adminUpdatePlot(token, editingId, payload);
        toast.success("Plot updated");
      } else {
        await api.adminCreatePlot(token, payload);
        toast.success("Plot published");
      }
      setConfirm(null);
      closeModal(true);
      await loadPlots(profile, { page, q: debouncedQ, status: statusFilter });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save plot");
    } finally {
      setSaving(false);
    }
  }

  async function performDelete(plot: Plot) {
    if (!token || !profile) return;
    setDeleting(true);
    try {
      await api.adminDeletePlot(token, plot.id);
      toast.success("Plot deleted");
      setConfirm(null);
      if (editingId === plot.id) closeModal(true);
      await loadPlots(profile, { page, q: debouncedQ, status: statusFilter });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete plot");
    } finally {
      setDeleting(false);
    }
  }

  async function handleConfirm() {
    if (!confirm) return;
    if (confirm.type === "edit") {
      const plot = confirm.plot;
      setConfirm(null);
      setViewPlot(null);
      fillEditForm(plot);
      return;
    }
    if (confirm.type === "save") {
      await performSave();
      return;
    }
    if (confirm.type === "delete") {
      await performDelete(confirm.plot);
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

  const imagePreview = preview || existingImage;

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-soft">
              Admin · Inventory
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Plot <span className="text-aurora">inventory</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-mist">
              Manage listings in one table. Add or edit plots in a modal — prices stay index-linked.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="btn-iconed btn-primary w-full shrink-0 !px-4 !py-2.5 sm:w-auto"
            aria-label="New plot"
            title="New plot"
          >
            <span className="btn-icon">
              <PlusIcon />
            </span>
            <span>New plot</span>
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        {loading && !plots.length ? (
          <TableSkeleton rows={6} />
        ) : (
          <>
          <AdminTable
            columns={["Listing", "Status", "Base", "Display", "Actions"]}
            toolbar={
              <FilterToolbar
                compact
                searchValue={q}
                onSearchChange={setQ}
                searchLabel="Search plots"
                searchPlaceholder="Search these results"
                resultLabel={`${pagination?.total?.toLocaleString("en-GB") ?? plots.length} plots`}
                loading={loading}
                filters={[
                  {
                    id: "status",
                    label: "Status",
                    value: statusFilter,
                    onChange: setStatusFilter,
                    options: [
                      { value: "all", label: "All statuses" },
                      { value: "available", label: "Available" },
                      { value: "reserved", label: "Reserved" },
                      { value: "sold", label: "Sold" },
                    ],
                  },
                ]}
              />
            }
            empty={
              !plots.length ? (
                <div className="px-5 py-10 text-center text-sm text-mist">
                  No plots match your filters. Click + New plot to add inventory.
                </div>
              ) : null
            }
            mobileCards={plots.map((plot) => (
              <AdminCard key={`m-${plot.id}`}>
                <div className="flex items-start gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-teal/40 bg-[#050b14]">
                    {plot.image_url ? (
                      <Image
                        src={plot.image_url}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setViewPlot(plot)}
                        className="text-left text-sm font-semibold text-teal-soft hover:underline"
                      >
                        {plot.name}
                      </button>
                      <StatusPill value={plot.status} tone={statusTone(plot.status)} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-white/45">{plot.description}</p>
                    <MetaGrid
                      dense
                      items={[
                        { label: "Location", value: plot.location },
                        {
                          label: "Tags",
                          value: plot.tags?.length ? plot.tags.slice(0, 3).join(", ") : "—",
                        },
                        {
                          label: "Badge",
                          value: plot.just_added ? "Just added" : "Standard",
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <div className="flex gap-4 text-sm tabular-nums">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40">Base</p>
                      <p className="font-medium text-white/85">
                        {formatGbp(Number(plot.base_price))}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40">Display</p>
                      <p className="font-semibold text-teal-soft">
                        {formatGbp(Number(plot.display_price ?? plot.base_price))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ActionIconButton
                      label="View"
                      onClick={() => setViewPlot(plot)}
                      tone="accent"
                    >
                      <EyeIcon />
                    </ActionIconButton>
                    <ActionIconButton label="Edit" onClick={() => requestEdit(plot)}>
                      <PencilIcon />
                    </ActionIconButton>
                    <ActionIconButton label="Open public page" href={`/plots/${plot.id}`}>
                      <ArrowRightIcon />
                    </ActionIconButton>
                    <ActionIconButton
                      label="Delete"
                      tone="danger"
                      onClick={() => requestDelete(plot)}
                    >
                      <TrashIcon />
                    </ActionIconButton>
                  </div>
                </div>
              </AdminCard>
            ))}
          >
            {plots.map((plot) => (
              <AdminTr key={plot.id}>
                <AdminTd>
                  <div className="flex min-w-[18rem] items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-teal/40 bg-[#050b14]">
                      {plot.image_url ? (
                        <Image
                          src={plot.image_url}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setViewPlot(plot)}
                        className="truncate text-left text-sm font-semibold text-teal-soft hover:underline"
                      >
                        {plot.name}
                      </button>
                      <p className="mt-0.5 line-clamp-1 text-xs text-white/45">{plot.description}</p>
                      <MetaGrid
                        items={[
                          { label: "Location", value: plot.location },
                          {
                            label: "Tags",
                            value: plot.tags?.length ? plot.tags.slice(0, 3).join(", ") : "—",
                          },
                          {
                            label: "Badge",
                            value: plot.just_added ? "Just added" : "Standard",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </AdminTd>
                <AdminTd>
                  <StatusPill value={plot.status} tone={statusTone(plot.status)} />
                </AdminTd>
                <AdminTd>
                  <div className="tabular-nums">
                    <p className="text-xs text-white/40">Base</p>
                    <p className="font-medium text-white/85">
                      {formatGbp(Number(plot.base_price))}
                    </p>
                  </div>
                </AdminTd>
                <AdminTd>
                  <div className="tabular-nums">
                    <p className="text-xs text-white/40">Display</p>
                    <p className="font-semibold text-teal-soft">
                      {formatGbp(Number(plot.display_price ?? plot.base_price))}
                    </p>
                  </div>
                </AdminTd>
                <AdminTd>
                  <div className="flex items-center gap-1">
                    <ActionIconButton
                      label="View"
                      onClick={() => setViewPlot(plot)}
                      tone="accent"
                    >
                      <EyeIcon />
                    </ActionIconButton>
                    <ActionIconButton label="Edit" onClick={() => requestEdit(plot)}>
                      <PencilIcon />
                    </ActionIconButton>
                    <ActionIconButton
                      label="Open public page"
                      href={`/plots/${plot.id}`}
                    >
                      <ArrowRightIcon />
                    </ActionIconButton>
                    <ActionIconButton
                      label="Delete"
                      tone="danger"
                      onClick={() => requestDelete(plot)}
                    >
                      <TrashIcon />
                    </ActionIconButton>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTable>
          <div className="mt-4">
            <Pagination meta={pagination} onPageChange={setPage} />
          </div>
          </>
        )}
      </FadeIn>

      <Modal
        open={modalOpen}
        onClose={() => closeModal()}
        wide
        title={editingId ? "Edit plot" : "New plot"}
        description={
          editingId
            ? "Update listing details. Leave the image blank to keep the current photo."
            : "Add a listing with a photo. Display price will follow the live index."
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plot name">
              <input
                className="glass-input"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Location / district">
              <input
                className="glass-input"
                required
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className="glass-input min-h-[96px] resize-y"
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Base price (GBP)">
              <input
                className="glass-input"
                required
                type="number"
                min="0"
                step="0.01"
                value={form.base_price}
                onChange={(e) => setForm((f) => ({ ...f, base_price: e.target.value }))}
              />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as FormState["status"] }))
                }
                options={[
                  { value: "available", label: "Available" },
                  { value: "reserved", label: "Reserved" },
                  { value: "sold", label: "Sold" },
                ]}
              />
            </Field>
            <Field label="Tags">
              <input
                className="glass-input"
                placeholder="modern, 2-bed"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-mist">
            <input
              type="checkbox"
              checked={form.just_added}
              onChange={(e) => setForm((f) => ({ ...f, just_added: e.target.checked }))}
            />
            Show “Just Added” badge
          </label>

          <Field label={editingId ? "Replace image (optional)" : "Plot image"}>
            <input
              className="glass-input file:mr-3 file:rounded-lg file:border-0 file:bg-teal/20 file:px-3 file:py-1.5 file:text-sm file:text-teal-soft"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
            />
          </Field>

          {imagePreview ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628]">
              <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => closeModal()} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} icon={<PlusIcon />}>
              {editingId ? "Save changes" : "Publish plot"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(viewPlot)}
        onClose={() => setViewPlot(null)}
        title={viewPlot?.name || "Plot"}
        description={viewPlot ? `${viewPlot.location} · ${viewPlot.status}` : undefined}
      >
        {viewPlot ? (
          <div className="space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0a1628]">
              {viewPlot.image_url ? (
                <Image
                  src={viewPlot.image_url}
                  alt={viewPlot.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-mist">{viewPlot.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                <p className="text-[11px] uppercase tracking-wider text-white/45">Base</p>
                <p className="mt-1 font-medium">{formatGbp(Number(viewPlot.base_price))}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                <p className="text-[11px] uppercase tracking-wider text-white/45">Display</p>
                <p className="mt-1 font-medium text-teal-soft">
                  {formatGbp(Number(viewPlot.display_price ?? viewPlot.base_price))}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                icon={<PencilIcon />}
                iconPosition="left"
                onClick={() => requestEdit(viewPlot)}
              >
                Edit
              </Button>
              <ButtonLink href={`/plots/${viewPlot.id}`} icon={<ArrowRightIcon />}>
                Public page
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmModal
        open={confirm?.type === "edit"}
        title="Edit this plot?"
        description={
          confirm?.type === "edit"
            ? `Open “${confirm.plot.name}” in the editor so you can update details, pricing, or the image.`
            : ""
        }
        confirmLabel="Continue to edit"
        onCancel={() => setConfirm(null)}
        onConfirm={handleConfirm}
      />

      <ConfirmModal
        open={confirm?.type === "save"}
        title={editingId ? "Save plot changes?" : "Publish this plot?"}
        description={
          editingId
            ? "Your updates will go live on the marketplace immediately, including any new image."
            : "This listing will appear in inventory with the details and image you entered."
        }
        confirmLabel={editingId ? "Save changes" : "Publish plot"}
        loading={saving}
        onCancel={() => !saving && setConfirm(null)}
        onConfirm={handleConfirm}
      />

      <ConfirmModal
        open={confirm?.type === "delete"}
        title="Delete this plot?"
        description={
          confirm?.type === "delete"
            ? `“${confirm.plot.name}” will be removed permanently. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete plot"
        tone="danger"
        loading={deleting}
        onCancel={() => !deleting && setConfirm(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</span>
      {children}
    </label>
  );
}
