"use client";

import { useActionState, useEffect, useState } from "react";
import {
  deleteProduct,
  updateProduct,
  type ProductActionResult,
} from "@/app/admin/(panel)/menu/actions";
import type {
  CategoryOption,
  InventoryItemOption,
  ProductListItem,
} from "@/components/admin/menu/product-list";
import { RecipeEditor } from "@/components/admin/menu/recipe-editor";
import { formatPriceUah, kopecksToPriceInput } from "@/lib/menu/money";

type ProductRowActionsProps = {
  product: ProductListItem;
  categories: CategoryOption[];
  inventoryItemOptions: InventoryItemOption[];
};

const initialState: ProductActionResult | null = null;

function ProductStatusBadges({
  isActive,
  isAvailable,
}: {
  isActive: boolean;
  isAvailable: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          isActive
            ? "bg-[#e4e7df] text-[#2f4741]"
            : "bg-[#efe3d3] text-[#8a7262]"
        }`}
      >
        {isActive ? "Активний" : "Прихований"}
      </span>
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          isAvailable
            ? "bg-[#e4e7df] text-[#2f4741]"
            : "bg-[#efe3d3] text-[#8a7262]"
        }`}
      >
        {isAvailable ? "Доступний" : "Немає в наявності"}
      </span>
    </div>
  );
}

export function ProductRowActions({
  product,
  categories,
  inventoryItemOptions,
}: ProductRowActionsProps) {
  const [editing, setEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateProduct,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteProduct,
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
            <h5 className="font-semibold text-[#3c2a21]">{product.name}</h5>
            {product.description ? (
              <p className="mt-1 text-sm text-[#5c4638]">{product.description}</p>
            ) : null}
            <p className="mt-2 text-sm font-medium text-[#3c2a21]">
              {formatPriceUah(product.priceInKopecks)}
            </p>
          </div>
          <ProductStatusBadges
            isActive={product.isActive}
            isAvailable={product.isAvailable}
          />
        </div>

        <p className="mt-2 text-xs text-[#8a7262]">Порядок: {product.sortOrder}</p>

        <RecipeEditor
          productId={product.id}
          productName={product.name}
          recipe={product.recipe}
          inventoryItemOptions={inventoryItemOptions}
        />

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
              if (product.recipe) {
                event.preventDefault();
                window.alert(
                  `Товар «${product.name}» має технологічну карту. Спочатку видаліть карту, потім товар.`,
                );
                return;
              }
              const confirmed = window.confirm(
                `Видалити товар «${product.name}»? Цю дію не можна скасувати.`,
              );
              if (!confirmed) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              disabled={busy || Boolean(product.recipe)}
              title={
                product.recipe
                  ? "Спочатку видаліть технологічну карту"
                  : undefined
              }
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
        <h5 className="font-semibold text-[#3c2a21]">Редагування товару</h5>
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
        <input type="hidden" name="id" value={product.id} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`edit-name-${product.id}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Назва
            </label>
            <input
              id={`edit-name-${product.id}`}
              name="name"
              type="text"
              required
              maxLength={120}
              defaultValue={product.name}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <div>
            <label
              htmlFor={`edit-price-${product.id}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Ціна, ₴
            </label>
            <input
              id={`edit-price-${product.id}`}
              name="price"
              type="text"
              inputMode="decimal"
              required
              defaultValue={kopecksToPriceInput(product.priceInKopecks)}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`edit-description-${product.id}`}
            className="block text-sm font-medium text-[#3c2a21]"
          >
            Опис
          </label>
          <textarea
            id={`edit-description-${product.id}`}
            name="description"
            rows={2}
            maxLength={1000}
            defaultValue={product.description ?? ""}
            disabled={busy}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`edit-category-${product.id}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Категорія
            </label>
            <select
              id={`edit-category-${product.id}`}
              name="categoryId"
              defaultValue={product.categoryId}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor={`edit-sort-${product.id}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Порядок
            </label>
            <input
              id={`edit-sort-${product.id}`}
              name="sortOrder"
              type="number"
              min={0}
              max={10000}
              defaultValue={product.sortOrder}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[#3c2a21]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product.isActive}
              disabled={busy}
              className="h-4 w-4 rounded border-[#d9c7b5]"
            />
            Активний
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              defaultChecked={product.isAvailable}
              disabled={busy}
              className="h-4 w-4 rounded border-[#d9c7b5]"
            />
            Доступний
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
