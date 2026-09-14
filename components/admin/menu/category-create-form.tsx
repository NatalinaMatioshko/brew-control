"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createCategory,
  type CategoryActionResult,
} from "@/app/admin/(panel)/menu/actions";

const initialState: CategoryActionResult | null = null;

export function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="rounded-2xl border border-[#e4d5c5] bg-[#fbf6f0] p-5">
      <h2 className="text-lg font-semibold text-[#3c2a21]">Додати категорію</h2>
      <p className="mt-1 text-sm text-[#5c4638]">
        Slug згенерується автоматично з назви.
      </p>

      <form ref={formRef} action={formAction} className="mt-4 grid gap-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
        <div>
          <label htmlFor="category-name" className="block text-sm font-medium text-[#3c2a21]">
            Назва
          </label>
          <input
            id="category-name"
            name="name"
            type="text"
            required
            maxLength={80}
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
          />
        </div>
        <div>
          <label htmlFor="category-sort-order" className="block text-sm font-medium text-[#3c2a21]">
            Порядок
          </label>
          <input
            id="category-sort-order"
            name="sortOrder"
            type="number"
            min={0}
            max={10000}
            defaultValue={0}
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-[#3c2a21] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#efe3d3]"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[#3c2a21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Збереження…" : "Додати"}
        </button>
      </form>

      {state && !state.ok ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </section>
  );
}
