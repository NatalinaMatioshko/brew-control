"use client";

import { useActionState, useEffect, useState } from "react";
import {
  deleteCategory,
  updateCategory,
  type CategoryActionResult,
} from "@/app/admin/(panel)/menu/actions";
import type { CategoryListItem } from "@/components/admin/menu/category-list";

type CategoryRowActionsProps = {
  category: CategoryListItem;
};

const initialState: CategoryActionResult | null = null;

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive
          ? "bg-[#e4e7df] text-[#2f4741]"
          : "bg-[#efe3d3] text-[#8a7262]"
      }`}
    >
      {isActive ? "Активна" : "Прихована"}
    </span>
  );
}

export function CategoryRowActions({ category }: CategoryRowActionsProps) {
  const [editing, setEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateCategory,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteCategory,
    initialState,
  );

  useEffect(() => {
    if (updateState?.ok) {
      setEditing(false);
    }
  }, [updateState]);

  const busy = updatePending || deletePending;
  const error = updateState && !updateState.ok
    ? updateState.error
    : deleteState && !deleteState.ok
      ? deleteState.error
      : null;

  if (!editing) {
    return (
      <article className="rounded-2xl border border-[#e4d5c5] bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-[#3c2a21]">{category.name}</h3>
            <p className="mt-1 text-sm text-[#8a7262]">/{category.slug}</p>
          </div>
          <StatusBadge isActive={category.isActive} />
        </div>

        <dl className="mt-4 grid gap-2 text-sm text-[#5c4638] sm:grid-cols-3">
          <div>
            <dt className="font-medium text-[#3c2a21]">Порядок</dt>
            <dd>{category.sortOrder}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#3c2a21]">Товарів</dt>
            <dd>{category.productCount}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#3c2a21]">Slug</dt>
            <dd className="break-all">{category.slug}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={busy}
            className="rounded-xl border border-[#d9c7b5] bg-[#fbf6f0] px-3 py-2 text-sm font-semibold text-[#3c2a21] transition hover:border-[#c9a227] disabled:opacity-60"
          >
            Редагувати
          </button>
          <form
            action={deleteAction}
            onSubmit={(event) => {
              const confirmed = window.confirm(
                `Видалити категорію «${category.name}»? Цю дію не можна скасувати.`,
              );
              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={category.id} />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60"
            >
              {deletePending ? "Видалення…" : "Видалити"}
            </button>
          </form>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-[#c9a227]/40 bg-[#fffaf3] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#3c2a21]">Редагування</h3>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={busy}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#5c4638] ring-1 ring-[#d9c7b5]"
        >
          Скасувати
        </button>
      </div>

      <form action={updateAction} className="mt-4 grid gap-4">
        <input type="hidden" name="id" value={category.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`name-${category.id}`} className="block text-sm font-medium text-[#3c2a21]">
              Назва
            </label>
            <input
              id={`name-${category.id}`}
              name="name"
              type="text"
              required
              maxLength={80}
              defaultValue={category.name}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <div>
            <label htmlFor={`slug-${category.id}`} className="block text-sm font-medium text-[#3c2a21]">
              Slug
            </label>
            <input
              id={`slug-${category.id}`}
              name="slug"
              type="text"
              required
              defaultValue={category.slug}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-end">
          <div>
            <label htmlFor={`sort-${category.id}`} className="block text-sm font-medium text-[#3c2a21]">
              Порядок
            </label>
            <input
              id={`sort-${category.id}`}
              name="sortOrder"
              type="number"
              min={0}
              max={10000}
              defaultValue={category.sortOrder}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#3c2a21]">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={category.isActive}
              disabled={busy}
              className="h-4 w-4 rounded border-[#d9c7b5]"
            />
            Активна категорія
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#3c2a21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:opacity-60"
          >
            {updatePending ? "Збереження…" : "Зберегти"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
