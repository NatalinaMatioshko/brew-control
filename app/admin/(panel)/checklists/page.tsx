import { ChecklistHistory, mapHistoryRun } from "@/components/admin/checklists/checklist-history";
import { TemplatePanel } from "@/components/admin/checklists/template-panel";
import {
  TodayChecklists,
  type TodayRunView,
} from "@/components/admin/checklists/today-checklists";
import { auth } from "@/auth";
import {
  ChecklistKind,
  formatServiceDate,
  getKyivServiceDate,
} from "@/lib/checklist/schema";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Чеклісти · Brew Control",
};

function mapTodayRun(
  run:
    | {
        id: string;
        status: string;
        titleSnapshot: string;
        kindSnapshot: string;
        items: Array<{
          id: string;
          titleSnapshot: string;
          sortOrder: number;
          isChecked: boolean;
        }>;
      }
    | null
    | undefined,
): TodayRunView {
  if (!run) {
    return null;
  }

  return {
    id: run.id,
    status: run.status,
    titleSnapshot: run.titleSnapshot,
    kindSnapshot: run.kindSnapshot,
    items: run.items,
    allChecked: run.items.length > 0 && run.items.every((item) => item.isChecked),
  };
}

export default async function AdminChecklistsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const canManageTemplates = role === "ADMIN";
  const canOperate = role === "ADMIN" || role === "MANAGER";

  const serviceDate = getKyivServiceDate();

  const [templates, todayRuns, historyRuns] = await Promise.all([
    prisma.checklistTemplate.findMany({
      orderBy: [{ sortOrder: "asc" }, { kind: "asc" }, { title: "asc" }],
      select: {
        id: true,
        kind: true,
        title: true,
        sortOrder: true,
        isActive: true,
        items: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          select: {
            id: true,
            title: true,
            sortOrder: true,
            isActive: true,
          },
        },
      },
    }),
    prisma.checklistRun.findMany({
      where: { serviceDate },
      select: {
        id: true,
        status: true,
        titleSnapshot: true,
        kindSnapshot: true,
        items: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          select: {
            id: true,
            titleSnapshot: true,
            sortOrder: true,
            isChecked: true,
          },
        },
      },
    }),
    prisma.checklistRun.findMany({
      orderBy: [{ serviceDate: "desc" }, { createdAt: "desc" }],
      take: 30,
      select: {
        id: true,
        serviceDate: true,
        kindSnapshot: true,
        titleSnapshot: true,
        status: true,
        completedAt: true,
        startedBy: { select: { name: true, email: true } },
        completedBy: { select: { name: true, email: true } },
      },
    }),
  ]);

  const openingRun = mapTodayRun(
    todayRuns.find((run) => run.kindSnapshot === ChecklistKind.OPENING),
  );
  const closingRun = mapTodayRun(
    todayRuns.find((run) => run.kindSnapshot === ChecklistKind.CLOSING),
  );

  const hasActiveOpeningTemplate = templates.some(
    (template) =>
      template.isActive && template.kind === ChecklistKind.OPENING,
  );
  const hasActiveClosingTemplate = templates.some(
    (template) =>
      template.isActive && template.kind === ChecklistKind.CLOSING,
  );

  return (
    <main className="px-4 py-8 sm:px-6">
      <p className="text-sm font-medium text-[#8a7262]">Операції</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#3c2a21]">
        Чеклісти зміни
      </h1>
      <p className="mt-3 max-w-2xl text-[#5c4638]">
        {canManageTemplates
          ? "Шаблони відкриття/закриття та щоденні виконання. Зміни шаблону не переписують історію."
          : "Перегляд і відмітка пунктів чеклістів відкриття та закриття зміни."}
      </p>

      <div className="mt-8 space-y-10">
        <TodayChecklists
          serviceDateLabel={formatServiceDate(serviceDate)}
          openingRun={openingRun}
          closingRun={closingRun}
          canOperate={canOperate}
          hasActiveOpeningTemplate={hasActiveOpeningTemplate}
          hasActiveClosingTemplate={hasActiveClosingTemplate}
        />

        <ChecklistHistory runs={historyRuns.map(mapHistoryRun)} />

        <TemplatePanel
          canManage={canManageTemplates}
          templates={templates.map((template) => ({
            id: template.id,
            kind: template.kind,
            title: template.title,
            sortOrder: template.sortOrder,
            isActive: template.isActive,
            items: template.items,
          }))}
        />
      </div>
    </main>
  );
}
