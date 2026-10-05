"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createChecklistTemplate,
  createChecklistTemplateItem,
  deleteChecklistTemplate,
  deleteChecklistTemplateItem,
  updateChecklistTemplate,
  updateChecklistTemplateItem,
  type ChecklistActionResult,
} from "@/app/admin/(panel)/checklists/actions";
import {
  CHECKLIST_KIND_OPTIONS,
  checklistKindLabel,
} from "@/lib/checklist/schema";

export type TemplateItemView = {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
};

export type TemplateView = {
  id: string;
  kind: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  items: TemplateItemView[];
};

type TemplatePanelProps = {
  templates: TemplateView[];
  canManage: boolean;
};

const initialState: ChecklistActionResult | null = null;

function TemplateItemRow({
  item,
  canManage,
}: {
  item: TemplateItemView;
  canManage: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateChecklistTemplateItem,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteChecklistTemplateItem,
    initialState,
  );

  useEffect(() => {
    if (updateState?.ok) {
      setEditing(false);
    }
  }, [updateState]);

  const busy = updatePending || deletePending;
  const error =
    (updateState && !updateState.ok && updateState.error) ||
    (deleteState && !deleteState.ok && deleteState.error) ||
    null;

  if (!canManage) {
    return (
      <li className="rounded-xl border border-[#efe3d3] bg-[#fffdfb] px-3 py-2 text-sm text-[#3c2a21]">
        {item.title}
        <span className="ml-2 text-xs text-[#8a7262]">
          · порядок {item.sortOrder}
          {!item.isActive ? " · неактивний" : ""}
        </span>
      </li>
    );
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-[#c9a227]/40 bg-[#fffaf3] p-3">
        <form action={updateAction} className="grid gap-2 sm:grid-cols-[1fr_6rem_auto]">
          <input type="hidden" name="id" value={item.id} />
          <input
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={item.title}
            disabled={busy}
            className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
          />
          <input
            name="sortOrder"
            type="number"
            min={0}
            max={10000}
            defaultValue={item.sortOrder}
            disabled={busy}
            className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-[#3c2a21]">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={item.isActive}
              disabled={busy}
            />
            Активний
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#3c2a21] px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {updatePending ? "Збереження…" : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              className="rounded-xl border border-[#d9c7b5] px-3 py-1.5 text-sm"
            >
              Скасувати
            </button>
          </div>
        </form>
        {error ? (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-[#efe3d3] bg-[#fffdfb] px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[#3c2a21]">
          {item.title}
          <span className="ml-2 text-xs text-[#8a7262]">
            · порядок {item.sortOrder}
            {!item.isActive ? " · неактивний" : ""}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={busy}
            className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-1 text-sm font-semibold text-[#3c2a21]"
          >
            Редагувати
          </button>
          <form
            action={deleteAction}
            onSubmit={(event) => {
              if (!window.confirm(`Видалити пункт «${item.title}»?`)) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-800"
            >
              Видалити
            </button>
          </form>
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </li>
  );
}

function TemplateCard({
  template,
  canManage,
}: {
  template: TemplateView;
  canManage: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateChecklistTemplate,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteChecklistTemplate,
    initialState,
  );
  const [createItemState, createItemAction, createItemPending] = useActionState(
    createChecklistTemplateItem,
    initialState,
  );

  useEffect(() => {
    if (updateState?.ok) {
      setEditing(false);
    }
  }, [updateState]);

  const busy = updatePending || deletePending || createItemPending;
  const error =
    (updateState && !updateState.ok && updateState.error) ||
    (deleteState && !deleteState.ok && deleteState.error) ||
    (createItemState && !createItemState.ok && createItemState.error) ||
    null;

  return (
    <article className="rounded-2xl border border-[#e4d5c5] bg-white p-4">
      {editing && canManage ? (
        <form action={updateAction} className="grid gap-3">
          <input type="hidden" name="id" value={template.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#3c2a21]">
                Тип
              </label>
              <select
                name="kind"
                defaultValue={template.kind}
                disabled={busy}
                className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
              >
                {CHECKLIST_KIND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3c2a21]">
                Порядок
              </label>
              <input
                name="sortOrder"
                type="number"
                min={0}
                max={10000}
                defaultValue={template.sortOrder}
                disabled={busy}
                className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3c2a21]">
              Назва
            </label>
            <input
              name="title"
              type="text"
              required
              maxLength={200}
              defaultValue={template.title}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#3c2a21]">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={template.isActive}
              disabled={busy}
            />
            Активний шаблон
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {updatePending ? "Збереження…" : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              className="rounded-xl border border-[#d9c7b5] px-4 py-2 text-sm"
            >
              Скасувати
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[#3c2a21]">
                {template.title}
              </h3>
              <p className="mt-1 text-sm text-[#8a7262]">
                {checklistKindLabel(template.kind)} · порядок {template.sortOrder}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                template.isActive
                  ? "bg-[#e4e7df] text-[#2f4741]"
                  : "bg-[#efe3d3] text-[#8a7262]"
              }`}
            >
              {template.isActive ? "Активний" : "Неактивний"}
            </span>
          </div>

          {canManage ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={busy}
                className="rounded-xl border border-[#d9c7b5] bg-[#fbf6f0] px-3 py-1.5 text-sm font-semibold text-[#3c2a21]"
              >
                Редагувати шаблон
              </button>
              <form
                action={deleteAction}
                onSubmit={(event) => {
                  if (
                    !window.confirm(
                      `Видалити шаблон «${template.title}»? Можливо лише без виконань.`,
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={template.id} />
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-800"
                >
                  Видалити
                </button>
              </form>
            </div>
          ) : null}
        </>
      )}

      <div className="mt-4 space-y-2 border-t border-[#efe3d3] pt-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-[#8a7262]">
          Пункти
        </h4>
        {template.items.length === 0 ? (
          <p className="text-sm text-[#5c4638]">Пунктів ще немає.</p>
        ) : (
          <ul className="space-y-2">
            {template.items.map((item) => (
              <TemplateItemRow
                key={item.id}
                item={item}
                canManage={canManage}
              />
            ))}
          </ul>
        )}

        {canManage ? (
          <form
            action={createItemAction}
            className="mt-3 grid gap-2 rounded-xl border border-dashed border-[#d9c7b5] bg-[#fbf6f0] p-3 sm:grid-cols-[1fr_6rem_auto_auto]"
          >
            <input type="hidden" name="templateId" value={template.id} />
            <input
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="Новий пункт"
              disabled={busy}
              className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
            />
            <input
              name="sortOrder"
              type="number"
              min={0}
              max={10000}
              defaultValue={0}
              disabled={busy}
              className="rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-[#3c2a21]">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked
                disabled={busy}
              />
              Активний
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#3c2a21] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {createItemPending ? "…" : "Додати"}
            </button>
          </form>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}

function CreateTemplateForm() {
  const [state, action, pending] = useActionState(
    createChecklistTemplate,
    initialState,
  );

  return (
    <form
      action={action}
      className="grid gap-3 rounded-2xl border border-dashed border-[#d9c7b5] bg-[#fbf6f0] p-4"
    >
      <h3 className="font-semibold text-[#3c2a21]">Новий шаблон</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#3c2a21]">Тип</label>
          <select
            name="kind"
            required
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
          >
            {CHECKLIST_KIND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3c2a21]">
            Порядок
          </label>
          <input
            name="sortOrder"
            type="number"
            min={0}
            max={10000}
            defaultValue={0}
            disabled={pending}
            className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#3c2a21]">Назва</label>
        <input
          name="title"
          type="text"
          required
          maxLength={200}
          placeholder="Наприклад, Відкриття зміни"
          disabled={pending}
          className="mt-1 w-full rounded-xl border border-[#d9c7b5] bg-white px-3 py-2 text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-[#3c2a21]">
        <input type="checkbox" name="isActive" defaultChecked disabled={pending} />
        Активний шаблон
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Створення…" : "Створити шаблон"}
      </button>
      {state && !state.ok ? (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

export function TemplatePanel({ templates, canManage }: TemplatePanelProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[#3c2a21]">Шаблони</h2>
        <p className="mt-1 text-sm text-[#5c4638]">
          {canManage
            ? "Лише один активний шаблон на відкриття та один на закриття."
            : "Перегляд шаблонів. Редагування доступне лише адміністратору."}
        </p>
      </div>

      {canManage ? <CreateTemplateForm /> : null}

      {templates.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#d9c7b5] bg-[#fbf6f0] px-4 py-6 text-sm text-[#5c4638]">
          Шаблонів ще немає.
        </p>
      ) : (
        <ul className="space-y-4">
          {templates.map((template) => (
            <li key={template.id}>
              <TemplateCard template={template} canManage={canManage} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
