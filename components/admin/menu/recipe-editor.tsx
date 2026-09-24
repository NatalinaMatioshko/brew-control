"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  deleteProductRecipe,
  saveProductRecipe,
  type RecipeActionResult,
} from "@/app/admin/(panel)/menu/actions";
import {
  RecipePanel,
  type RecipeView,
} from "@/components/admin/menu/recipe-panel";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";
import { normalizeDecimalString } from "@/lib/inventory/decimal";

export type InventoryItemOption = {
  id: string;
  name: string;
  unit: string;
  categoryName: string;
};

type RecipeEditorProps = {
  productId: string;
  productName: string;
  recipe: RecipeView | null;
  inventoryItemOptions: InventoryItemOption[];
};

type EditorRow = {
  key: string;
  inventoryItemId: string;
  quantity: string;
};

const initialState: RecipeActionResult | null = null;

function createRow(partial?: Partial<EditorRow>): EditorRow {
  return {
    key: partial?.key ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    inventoryItemId: partial?.inventoryItemId ?? "",
    quantity: partial?.quantity ?? "",
  };
}

export function RecipeEditor({
  productId,
  productName,
  recipe,
  inventoryItemOptions,
}: RecipeEditorProps) {
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState<EditorRow[]>([createRow()]);
  const [saveState, saveAction, savePending] = useActionState(
    saveProductRecipe,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteProductRecipe,
    initialState,
  );

  useEffect(() => {
    if (saveState?.ok || deleteState?.ok) {
      setEditing(false);
    }
  }, [saveState, deleteState]);

  const selectOptions = useMemo(() => {
    const byId = new Map(
      inventoryItemOptions.map((item) => [item.id, { ...item, isActive: true }]),
    );

    if (recipe) {
      for (const ingredient of recipe.ingredients) {
        if (!byId.has(ingredient.inventoryItem.id)) {
          byId.set(ingredient.inventoryItem.id, {
            id: ingredient.inventoryItem.id,
            name: ingredient.inventoryItem.name,
            unit: ingredient.inventoryItem.unit,
            categoryName: ingredient.inventoryItem.categoryName,
            isActive: ingredient.inventoryItem.isActive,
          });
        }
      }
    }

    return Array.from(byId.values()).sort((left, right) => {
      const categoryCmp = left.categoryName.localeCompare(right.categoryName, "uk");
      if (categoryCmp !== 0) {
        return categoryCmp;
      }
      return left.name.localeCompare(right.name, "uk");
    });
  }, [inventoryItemOptions, recipe]);

  const optionById = useMemo(
    () => new Map(selectOptions.map((item) => [item.id, item])),
    [selectOptions],
  );

  const busy = savePending || deletePending;
  const error =
    saveState && !saveState.ok
      ? saveState.error
      : deleteState && !deleteState.ok
        ? deleteState.error
        : null;

  function startEditing() {
    if (recipe && recipe.ingredients.length > 0) {
      setRows(
        recipe.ingredients.map((ingredient) =>
          createRow({
            inventoryItemId: ingredient.inventoryItem.id,
            quantity: normalizeDecimalString(ingredient.quantity),
          }),
        ),
      );
    } else {
      setRows([createRow()]);
    }
    setEditing(true);
  }

  if (!editing) {
    return (
      <div>
        <RecipePanel recipe={recipe} />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startEditing}
            disabled={busy}
            className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-1.5 text-sm font-semibold text-[#3c2a21] transition hover:border-[#c9a227] disabled:opacity-60"
          >
            {recipe ? "Редагувати рецепт" : "Додати рецепт"}
          </button>
          {recipe ? (
            <form
              action={deleteAction}
              onSubmit={(event) => {
                const confirmed = window.confirm(
                  `Видалити технологічну карту для «${productName}»?`,
                );
                if (!confirmed) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="productId" value={productId} />
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60"
              >
                {deletePending ? "Видалення…" : "Видалити рецепт"}
              </button>
            </form>
          ) : null}
        </div>
        {error ? (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-[#c9a227]/40 bg-[#fffaf3] px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h6 className="text-sm font-semibold text-[#3c2a21]">
          {recipe ? "Редагування технологічної карти" : "Нова технологічна карта"}
        </h6>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={busy}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#5c4638] ring-1 ring-[#d9c7b5]"
        >
          Скасувати
        </button>
      </div>

      <form action={saveAction} className="mt-3 space-y-3">
        <input type="hidden" name="productId" value={productId} />

        <div>
          <label
            htmlFor={`recipe-note-${productId}`}
            className="block text-sm font-medium text-[#3c2a21]"
          >
            Примітка
          </label>
          <textarea
            id={`recipe-note-${productId}`}
            name="note"
            rows={2}
            maxLength={500}
            defaultValue={recipe?.note ?? ""}
            disabled={busy}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-[#3c2a21]">Інгредієнти</p>
          {rows.map((row, index) => {
            const selected = optionById.get(row.inventoryItemId);
            const unitLabel = selected
              ? formatInventoryUnit(selected.unit)
              : null;

            return (
              <div
                key={row.key}
                className="grid gap-2 rounded-xl border border-[#efe3d3] bg-white p-3 sm:grid-cols-[1fr_7rem_auto] sm:items-end"
              >
                <div>
                  <label
                    htmlFor={`recipe-item-${productId}-${row.key}`}
                    className="block text-xs font-medium text-[#8a7262]"
                  >
                    Позиція складу
                  </label>
                  <select
                    id={`recipe-item-${productId}-${row.key}`}
                    name="inventoryItemId"
                    required
                    value={row.inventoryItemId}
                    disabled={busy}
                    onChange={(event) => {
                      const next = [...rows];
                      next[index] = {
                        ...row,
                        inventoryItemId: event.target.value,
                      };
                      setRows(next);
                    }}
                    className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
                  >
                    <option value="">Оберіть позицію</option>
                    {selectOptions.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        disabled={"isActive" in item && item.isActive === false}
                      >
                        {item.categoryName} · {item.name}
                        {"isActive" in item && item.isActive === false
                          ? " (неактивна)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`recipe-qty-${productId}-${row.key}`}
                    className="block text-xs font-medium text-[#8a7262]"
                  >
                    Кількість{unitLabel ? ` (${unitLabel})` : ""}
                  </label>
                  <input
                    id={`recipe-qty-${productId}-${row.key}`}
                    name="quantity"
                    type="text"
                    inputMode="decimal"
                    required
                    value={row.quantity}
                    disabled={busy}
                    onChange={(event) => {
                      const next = [...rows];
                      next[index] = { ...row, quantity: event.target.value };
                      setRows(next);
                    }}
                    className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
                  />
                </div>

                <button
                  type="button"
                  disabled={busy || rows.length <= 1}
                  onClick={() => {
                    setRows(rows.filter((entry) => entry.key !== row.key));
                  }}
                  className="rounded-xl border border-[#d9c7b5] px-3 py-2 text-sm font-medium text-[#5c4638] disabled:opacity-40"
                >
                  Прибрати
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => setRows([...rows, createRow()])}
            className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-1.5 text-sm font-semibold text-[#3c2a21]"
          >
            Додати інгредієнт
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:opacity-60"
          >
            {savePending ? "Збереження…" : "Зберегти рецепт"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
