"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createInventoryCount,
  type InventoryCountActionResult,
} from "@/app/admin/(panel)/inventory/actions";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";
import { formatQuantityDelta } from "@/lib/inventory/movement-schema";

type InventoryCountFormProps = {
  inventoryItemId: string;
  itemName: string;
  unit: string;
  systemBalance: string;
};

const initialState: InventoryCountActionResult | null = null;

export function InventoryCountForm({
  inventoryItemId,
  itemName,
  unit,
  systemBalance,
}: InventoryCountFormProps) {
  const [state, formAction, pending] = useActionState(
    createInventoryCount,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && !state.message) {
      formRef.current?.reset();
    }
  }, [state]);

  const unitLabel = formatInventoryUnit(unit);
  const balanceLabel = formatQuantityDelta(systemBalance);

  return (
    <section className="rounded-xl border border-[#d9c7b5] bg-white p-3">
      <h5 className="text-sm font-semibold text-[#3c2a21]">Інвентаризація</h5>
      <p className="mt-1 text-xs text-[#8a7262]">{itemName}</p>
      <p className="mt-2 text-sm text-[#5c4638]">
        Вкажіть, скільки є фізично. Система сама зробить коригування.
      </p>
      <p className="mt-2 text-sm text-[#3c2a21]">
        Системний залишок:{" "}
        <span className="font-semibold tabular-nums">
          {balanceLabel} {unitLabel}
        </span>
      </p>

      <form ref={formRef} action={formAction} className="mt-3 grid gap-3">
        <input type="hidden" name="inventoryItemId" value={inventoryItemId} />

        <div>
          <label
            htmlFor={`count-actual-${inventoryItemId}`}
            className="block text-sm font-medium text-[#3c2a21]"
          >
            Фактичний залишок ({unitLabel})
          </label>
          <input
            id={`count-actual-${inventoryItemId}`}
            name="actualQuantity"
            type="text"
            inputMode="decimal"
            required
            placeholder="0 або 10,5"
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-[#fbf6f0] px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#5c4638] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3c2a21] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Перевірка…" : "Звірити залишок"}
          </button>
        </div>
      </form>

      {state && !state.ok ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      {state?.ok && state.message ? (
        <p className="mt-3 text-sm text-[#2f4741]" role="status">
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
