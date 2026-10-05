import {
  ChecklistRunStatus,
  checklistKindLabel,
  formatDateTimeKyiv,
  formatServiceDate,
  userDisplayLabel,
} from "@/lib/checklist/schema";

export type HistoryRunView = {
  id: string;
  serviceDate: string;
  kindSnapshot: string;
  titleSnapshot: string;
  status: string;
  startedByLabel: string;
  completedByLabel: string | null;
  completedAtLabel: string | null;
};

type ChecklistHistoryProps = {
  runs: HistoryRunView[];
};

export function ChecklistHistory({ runs }: ChecklistHistoryProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[#3c2a21]">Історія</h2>

      {runs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#d9c7b5] bg-[#fbf6f0] px-4 py-6 text-sm text-[#5c4638]">
          Виконань ще немає.
        </p>
      ) : (
        <ul className="space-y-3">
          {runs.map((run) => (
            <li
              key={run.id}
              className="rounded-2xl border border-[#e4d5c5] bg-white px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#3c2a21]">
                    {checklistKindLabel(run.kindSnapshot)} · {run.titleSnapshot}
                  </p>
                  <p className="mt-1 text-sm text-[#5c4638]">
                    Дата: {run.serviceDate}
                  </p>
                </div>
                <span className="inline-flex rounded-full bg-[#efe3d3] px-2.5 py-1 text-xs font-medium text-[#8a7262]">
                  {run.status === ChecklistRunStatus.COMPLETED
                    ? "Завершено"
                    : "У процесі"}
                </span>
              </div>
              <dl className="mt-3 grid gap-2 text-sm text-[#5c4638] sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-[#3c2a21]">Почав</dt>
                  <dd>{run.startedByLabel}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[#3c2a21]">Завершив</dt>
                  <dd>
                    {run.completedByLabel
                      ? `${run.completedByLabel}${
                          run.completedAtLabel
                            ? ` · ${run.completedAtLabel}`
                            : ""
                        }`
                      : "—"}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function mapHistoryRun(run: {
  id: string;
  serviceDate: Date;
  kindSnapshot: string;
  titleSnapshot: string;
  status: string;
  startedBy: { name: string | null; email: string | null } | null;
  completedBy: { name: string | null; email: string | null } | null;
  completedAt: Date | null;
}): HistoryRunView {
  return {
    id: run.id,
    serviceDate: formatServiceDate(run.serviceDate),
    kindSnapshot: run.kindSnapshot,
    titleSnapshot: run.titleSnapshot,
    status: run.status,
    startedByLabel: userDisplayLabel(run.startedBy),
    completedByLabel: run.completedBy
      ? userDisplayLabel(run.completedBy)
      : null,
    completedAtLabel: run.completedAt
      ? formatDateTimeKyiv(run.completedAt)
      : null,
  };
}
