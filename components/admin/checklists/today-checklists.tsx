"use client";

import { useActionState } from "react";
import {
  completeChecklistRun,
  startChecklistRun,
  toggleChecklistRunItem,
  type ChecklistActionResult,
} from "@/app/admin/(panel)/checklists/actions";
import {
  ChecklistKind,
  ChecklistRunStatus,
  checklistKindLabel,
} from "@/lib/checklist/schema";

export type TodayRunItemView = {
  id: string;
  titleSnapshot: string;
  sortOrder: number;
  isChecked: boolean;
};

export type TodayRunView = {
  id: string;
  status: string;
  titleSnapshot: string;
  kindSnapshot: string;
  items: TodayRunItemView[];
  allChecked: boolean;
} | null;

type TodayChecklistsProps = {
  serviceDateLabel: string;
  openingRun: TodayRunView;
  closingRun: TodayRunView;
  canOperate: boolean;
  hasActiveOpeningTemplate: boolean;
  hasActiveClosingTemplate: boolean;
};

const initialState: ChecklistActionResult | null = null;

function statusLabel(run: TodayRunView): string {
  if (!run) {
    return "Не почато";
  }
  if (run.status === ChecklistRunStatus.COMPLETED) {
    return "Завершено";
  }
  return "У процесі";
}

function KindCard({
  kind,
  run,
  canOperate,
  hasActiveTemplate,
}: {
  kind: (typeof ChecklistKind)[keyof typeof ChecklistKind];
  run: TodayRunView;
  canOperate: boolean;
  hasActiveTemplate: boolean;
}) {
  const [startState, startAction, startPending] = useActionState(
    startChecklistRun,
    initialState,
  );
  const [completeState, completeAction, completePending] = useActionState(
    completeChecklistRun,
    initialState,
  );
  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleChecklistRunItem,
    initialState,
  );

  const error =
    (startState && !startState.ok && startState.error) ||
    (completeState && !completeState.ok && completeState.error) ||
    (toggleState && !toggleState.ok && toggleState.error) ||
    null;

  const busy = startPending || completePending || togglePending;
  const inProgress = run?.status === ChecklistRunStatus.IN_PROGRESS;
  const completed = run?.status === ChecklistRunStatus.COMPLETED;

  return (
    <article className="rounded-2xl border border-[#e4d5c5] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#3c2a21]">
            {checklistKindLabel(kind)}
          </h3>
          {run ? (
            <p className="mt-1 text-sm text-[#5c4638]">{run.titleSnapshot}</p>
          ) : null}
        </div>
        <span className="inline-flex rounded-full bg-[#efe3d3] px-2.5 py-1 text-xs font-medium text-[#8a7262]">
          {statusLabel(run)}
        </span>
      </div>

      {!run && canOperate ? (
        <form action={startAction} className="mt-4">
          <input type="hidden" name="kind" value={kind} />
          <button
            type="submit"
            disabled={busy || !hasActiveTemplate}
            title={
              hasActiveTemplate
                ? undefined
                : "Спочатку створіть активний шаблон"
            }
            className="rounded-xl bg-[#3c2a21] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5c4638] disabled:opacity-60"
          >
            {startPending ? "Запуск…" : "Почати"}
          </button>
        </form>
      ) : null}

      {!run && !canOperate ? (
        <p className="mt-3 text-sm text-[#5c4638]">Ще не почато.</p>
      ) : null}

      {run ? (
        <ul className="mt-4 space-y-2">
          {run.items.map((item) => (
            <li key={item.id}>
              {canOperate && inProgress ? (
                <form action={toggleAction}>
                  <input type="hidden" name="runItemId" value={item.id} />
                  <input
                    type="hidden"
                    name="isChecked"
                    value={item.isChecked ? "false" : "true"}
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="flex w-full items-start gap-3 rounded-xl border border-[#efe3d3] bg-[#fffdfb] px-3 py-2 text-left text-sm text-[#3c2a21] transition hover:border-[#c9a227]/50 disabled:opacity-60"
                  >
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        item.isChecked
                          ? "border-[#2f4741] bg-[#e4e7df] text-[#2f4741]"
                          : "border-[#d9c7b5] bg-white"
                      }`}
                      aria-hidden
                    >
                      {item.isChecked ? "✓" : ""}
                    </span>
                    <span
                      className={
                        item.isChecked ? "text-[#8a7262] line-through" : ""
                      }
                    >
                      {item.titleSnapshot}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-[#efe3d3] bg-[#fffdfb] px-3 py-2 text-sm text-[#3c2a21]">
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      item.isChecked
                        ? "border-[#2f4741] bg-[#e4e7df] text-[#2f4741]"
                        : "border-[#d9c7b5] bg-white"
                    }`}
                    aria-hidden
                  >
                    {item.isChecked ? "✓" : ""}
                  </span>
                  <span>{item.titleSnapshot}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {canOperate && inProgress && run ? (
        <form action={completeAction} className="mt-4">
          <input type="hidden" name="runId" value={run.id} />
          <button
            type="submit"
            disabled={busy || !run.allChecked}
            title={
              run.allChecked
                ? undefined
                : "Спочатку відмітьте всі пункти"
            }
            className="rounded-xl border border-[#d9c7b5] bg-[#fbf6f0] px-4 py-2 text-sm font-semibold text-[#3c2a21] disabled:opacity-60"
          >
            {completePending ? "Завершення…" : "Завершити"}
          </button>
        </form>
      ) : null}

      {completed ? (
        <p className="mt-3 text-sm text-[#5c4638]">Чекліст завершено.</p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}

export function TodayChecklists({
  serviceDateLabel,
  openingRun,
  closingRun,
  canOperate,
  hasActiveOpeningTemplate,
  hasActiveClosingTemplate,
}: TodayChecklistsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[#3c2a21]">Сьогодні</h2>
        <p className="mt-1 text-sm text-[#5c4638]">
          Дата зміни (Europe/Kyiv): {serviceDateLabel}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <KindCard
          kind={ChecklistKind.OPENING}
          run={openingRun}
          canOperate={canOperate}
          hasActiveTemplate={hasActiveOpeningTemplate}
        />
        <KindCard
          kind={ChecklistKind.CLOSING}
          run={closingRun}
          canOperate={canOperate}
          hasActiveTemplate={hasActiveClosingTemplate}
        />
      </div>
    </section>
  );
}
