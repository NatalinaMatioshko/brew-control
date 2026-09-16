"use client";

import { useActionState, useEffect, useState } from "react";
import {
  deleteInventoryItem,
  updateInventoryItem,
  type InventoryItemActionResult,
} from "@/app/admin/(panel)/inventory/actions";
import type { InventoryItemListItem } from "@/components/admin/inventory/item-list";
import {
  formatInventoryUnit,
  INVENTORY_UNIT_OPTIONS,
} from "@/lib/inventory/item-schema";

type InventoryItemRowActionsProps = {
  item: InventoryItemListItem;
};

const initialState: InventoryItemActionResult | null = null;

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

export function InventoryItemRowActions({ item }: InventoryItemRowActionsProps) {
  const [editing, setEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateInventoryItem,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteInventoryItem,
    initialState,
  );

  useEffect(() => {
    if (updateState?.ok) {
      setEditing(false);
    }
  }, [updateState]);

  const busy = updatePending || deletePending;
  const error =
    updateState && !updateState.ok
      ? updateState.error
      : deleteState && !deleteState.ok
        ? deleteState.error
        : null;

  if (!editing) {
    return (
      <article className="rounded-xl border border-[#efe3d3] bg-[#fffdfb] p-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h5 className="font-semibold text-[#3c2a21]">{item.name}</h5>
            <p className="mt-1 text-sm text-[#5c4638]">
              {formatInventoryUnit(item.unit)} · мін. {item.minimumQuantity}
            </p>
          </div>
          <StatusBadge isActive={item.isActive} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={busy}
            className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-1.5 text-sm font-semibold text-[#3c2a21] transition hover:border-[#c9a227] disabled:opacity-60"
          >
            Редагувати
          </button>
          <form
            action={deleteAction}
            onSubmit={(event) => {
              const confirmed = window.confirm(
                `Видалити позицію «${item.name}»? Цю дію не можна скасувати.`,
              );
              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60"
            >
              {deletePending ? "Видалення…" : "Видалити"}
            </button>
          </form>
        </div>

        {error ? (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-[#c9a227]/40 bg-[#fffaf3] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h5 className="font-semibold text-[#3c2a21]">Редагування позиції</h5>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={busy}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#5c4638] ring-1 ring-[#d9c7b5]"
        >
          Скасувати
        </button>
      </div>

      <form action={updateAction} className="mt-3 grid gap-3">
        <input type="hidden" name="id" value={item.id} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`edit-item-name-${item.id}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Назва
            </label>
            <input
              id={`edit-item-name-${item.id}`}
              name="name"
              type="text"
              required
              maxLength={120}
              defaultValue={item.name}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <div>
            <label
              htmlFor={`edit-item-unit-${item.id}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Одиниця
            </label>
            <select
              id={`edit-item-unit-${item.id}`}
              name="unit"
              required
              defaultValue={item.unit}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            >
              {INVENTORY_UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[160px_1fr] sm:items-end">
          <div>
            <label
              htmlFor={`edit-item-min-${item.id}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Мін. кількість
            </label>
            <input
              id={`edit-item-min-${item.id}`}
              name="minimumQuantity"
              type="number"
              min={0}
              step={1}
              defaultValue={item.minimumQuantity}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm text-[#3c2a21]">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={item.isActive}
              disabled={busy}
              className="h-4 w-4 rounded border-[#d9c7b5]"
            />
            Активна позиція
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:opacity-60"
          >
            {updatePending ? "Збереження…" : "Зберегти"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
