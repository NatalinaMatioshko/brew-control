"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  createStockMovement,
  type StockMovementActionResult,
} from "@/app/admin/(panel)/inventory/actions";
import {
  ADJUSTMENT_DIRECTION_OPTIONS,
  STOCK_MOVEMENT_TYPE_OPTIONS,
} from "@/lib/inventory/movement-schema";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";

type MovementCreateFormProps = {
  inventoryItemId: string;
  itemName: string;
  unit: string;
};

const initialState: StockMovementActionResult | null = null;

export function MovementCreateForm({
  inventoryItemId,
  itemName,
  unit,
}: MovementCreateFormProps) {
  const [state, formAction, pending] = useActionState(
    createStockMovement,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<string>("RECEIPT");

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setType("RECEIPT");
    }
  }, [state]);

  const unitLabel = formatInventoryUnit(unit);

  return (
    <section className="rounded-xl border border-[#e4d5c5] bg-[#fbf6f0] p-3">
      <h5 className="text-sm font-semibold text-[#3c2a21]">Додати рух</h5>
      <p className="mt-1 text-xs text-[#8a7262]">{itemName}</p>

      <form ref={formRef} action={formAction} className="mt-3 grid gap-3">
        <input type="hidden" name="inventoryItemId" value={inventoryItemId} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`movement-type-${inventoryItemId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Тип руху
            </label>
            <select
              id={`movement-type-${inventoryItemId}`}
              name="type"
              required
              value={type}
              onChange={(event) => setType(event.target.value)}
              disabled={pending}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            >
              {STOCK_MOVEMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`movement-qty-${inventoryItemId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Кількість ({unitLabel})
            </label>
            <input
              id={`movement-qty-${inventoryItemId}`}
              name="quantity"
              type="text"
              inputMode="decimal"
              required
              placeholder="10 або 10,5"
              disabled={pending}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
        </div>

        {type === "ADJUSTMENT" ? (
          <div>
            <label
              htmlFor={`movement-dir-${inventoryItemId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Напрям коригування
            </label>
            <select
              id={`movement-dir-${inventoryItemId}`}
              name="adjustmentDirection"
              required
              defaultValue="INCREASE"
              disabled={pending}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            >
              {ADJUSTMENT_DIRECTION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label
            htmlFor={`movement-note-${inventoryItemId}`}
            className="block text-sm font-medium text-[#3c2a21]"
          >
            Примітка
          </label>
          <textarea
            id={`movement-note-${inventoryItemId}`}
            name="note"
            rows={2}
            maxLength={500}
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Збереження…" : "Записати рух"}
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
