"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createProduct,
  type ProductActionResult,
} from "@/app/admin/(panel)/menu/actions";

type ProductCreateFormProps = {
  categoryId: string;
};

const initialState: ProductActionResult | null = null;

export function ProductCreateForm({ categoryId }: ProductCreateFormProps) {
  const [state, formAction, pending] = useActionState(createProduct, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="rounded-xl border border-[#e4d5c5] bg-[#fbf6f0] p-4">
      <h4 className="text-sm font-semibold text-[#3c2a21]">Додати товар</h4>

      <form ref={formRef} action={formAction} className="mt-3 grid gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`product-name-${categoryId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Назва
            </label>
            <input
              id={`product-name-${categoryId}`}
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
              htmlFor={`product-price-${categoryId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Ціна, ₴
            </label>
            <input
              id={`product-price-${categoryId}`}
              name="price"
              type="text"
              inputMode="decimal"
              required
              placeholder="65,00"
              disabled={pending}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`product-description-${categoryId}`}
            className="block text-sm font-medium text-[#3c2a21]"
          >
            Опис
          </label>
          <textarea
            id={`product-description-${categoryId}`}
            name="description"
            rows={2}
            maxLength={1000}
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-end">
          <div>
            <label
              htmlFor={`product-sort-${categoryId}`}
              className="block text-sm font-medium text-[#3c2a21]"
            >
              Порядок
            </label>
            <input
              id={`product-sort-${categoryId}`}
              name="sortOrder"
              type="number"
              min={0}
              max={10000}
              defaultValue={0}
              disabled={pending}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
            />
          </div>
          <div className="flex flex-wrap gap-4 pb-1 text-sm text-[#3c2a21]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked
                disabled={pending}
                className="h-4 w-4 rounded border-[#d9c7b5]"
              />
              Активний
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                defaultChecked
                disabled={pending}
                className="h-4 w-4 rounded border-[#d9c7b5]"
              />
              Доступний
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Збереження…" : "Додати товар"}
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
