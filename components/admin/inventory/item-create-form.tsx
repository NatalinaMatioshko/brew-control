"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createInventoryItem,
  type InventoryItemActionResult,
} from "@/app/admin/(panel)/inventory/actions";
import { INVENTORY_UNIT_OPTIONS } from "@/lib/inventory/item-schema";

type InventoryItemCreateFormProps = {
  categoryId: string;
};

const initialState: InventoryItemActionResult | null = null;

export function InventoryItemCreateForm({
  categoryId,
}: InventoryItemCreateFormProps) {
  const [state, formAction, pending] = useActionState(
    createInventoryItem,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="rounded-xl border border-[#e4d5c5] bg-[#fbf6f0] p-4">
      <h4 className="text-sm font-semibold text-[#3c2a21]">Додати позицію</h4>

      <form ref={formRef} action={formAction} className="mt-3 grid gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`item-name-${categoryId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Назва
            </label>
            <input
              id={`item-name-${categoryId}`}
              name="name"
              type="text"
              required
              maxLength={120}
              disabled={pending}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <div>
            <label
              htmlFor={`item-unit-${categoryId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Одиниця
            </label>
            <select
              id={`item-unit-${categoryId}`}
              name="unit"
              required
              defaultValue="PIECE"
              disabled={pending}
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

        <div className="grid gap-3 sm:grid-cols-[160px_auto] sm:items-end">
          <div>
            <label
              htmlFor={`item-min-${categoryId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Мін. кількість
            </label>
            <input
              id={`item-min-${categoryId}`}
              name="minimumQuantity"
              type="number"
              min={0}
              step={1}
              placeholder="0"
              disabled={pending}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Збереження…" : "Додати позицію"}
          </button>
        </div>
      </form>

      {state && !state.ok ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </section>
  );
}
