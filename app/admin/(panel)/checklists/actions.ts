"use server";

import {
  requireAdminWriter,
  requireChecklistOperator,
  validationError,
  type ChecklistActionResult,
} from "@/lib/checklist/action-auth";
import {
  ChecklistKind,
  ChecklistRunStatus,
  checklistKindLabel,
  completeRunSchema,
  getKyivServiceDate,
  isForeignKeyError,
  isRecordNotFoundError,
  isUniqueConstraintError,
  parseCheckbox,
  startRunSchema,
  templateCreateSchema,
  templateDeleteSchema,
  templateItemCreateSchema,
  templateItemDeleteSchema,
  templateItemUpdateSchema,
  templateUpdateSchema,
  toggleRunItemSchema,
} from "@/lib/checklist/schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type { ChecklistActionResult };

const PATH = "/admin/checklists";

class ChecklistActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChecklistActionError";
  }
}

async function assertNoOtherActiveTemplate(
  // Prisma interactive transaction client (typed after generate).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  kind: (typeof ChecklistKind)[keyof typeof ChecklistKind],
  excludeId?: string,
) {
  const existing = await tx.checklistTemplate.findFirst({
    where: {
      kind,
      isActive: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new ChecklistActionError(
      `Для «${checklistKindLabel(kind)}» уже є активний шаблон.`,
    );
  }
}

export async function createChecklistTemplate(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = templateCreateSchema.safeParse({
    kind: formData.get("kind"),
    title: formData.get("title"),
    sortOrder: formData.get("sortOrder") ?? "0",
    isActive: parseCheckbox(formData.get("isActive")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (parsed.data.isActive) {
        await assertNoOtherActiveTemplate(tx, parsed.data.kind);
      }

      await tx.checklistTemplate.create({
        data: {
          kind: parsed.data.kind,
          title: parsed.data.title,
          sortOrder: parsed.data.sortOrder,
          isActive: parsed.data.isActive,
        },
      });
    });
  } catch (error) {
    if (error instanceof ChecklistActionError) {
      return validationError(error.message);
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function updateChecklistTemplate(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = templateUpdateSchema.safeParse({
    id: formData.get("id"),
    kind: formData.get("kind"),
    title: formData.get("title"),
    sortOrder: formData.get("sortOrder"),
    isActive: parseCheckbox(formData.get("isActive")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.checklistTemplate.findUnique({
        where: { id: parsed.data.id },
        select: { id: true },
      });

      if (!current) {
        throw new ChecklistActionError("Шаблон не знайдено.");
      }

      if (parsed.data.isActive) {
        await assertNoOtherActiveTemplate(
          tx,
          parsed.data.kind,
          parsed.data.id,
        );
      }

      await tx.checklistTemplate.update({
        where: { id: parsed.data.id },
        data: {
          kind: parsed.data.kind,
          title: parsed.data.title,
          sortOrder: parsed.data.sortOrder,
          isActive: parsed.data.isActive,
        },
      });
    });
  } catch (error) {
    if (error instanceof ChecklistActionError) {
      return validationError(error.message);
    }
    if (isRecordNotFoundError(error)) {
      return validationError("Шаблон не знайдено.");
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function deleteChecklistTemplate(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = templateDeleteSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const template = await prisma.checklistTemplate.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      _count: { select: { runs: true } },
    },
  });

  if (!template) {
    return validationError("Шаблон не знайдено.");
  }

  if (template._count.runs > 0) {
    return validationError(
      "Неможливо видалити: за шаблоном є виконання. Деактивуйте шаблон замість видалення.",
    );
  }

  try {
    await prisma.checklistTemplate.delete({
      where: { id: parsed.data.id },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return validationError("Шаблон не знайдено.");
    }
    if (isForeignKeyError(error)) {
      return validationError(
        "Неможливо видалити: за шаблоном є виконання. Деактивуйте шаблон замість видалення.",
      );
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function createChecklistTemplateItem(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = templateItemCreateSchema.safeParse({
    templateId: formData.get("templateId"),
    title: formData.get("title"),
    sortOrder: formData.get("sortOrder") ?? "0",
    isActive: parseCheckbox(formData.get("isActive")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const template = await prisma.checklistTemplate.findUnique({
    where: { id: parsed.data.templateId },
    select: { id: true },
  });

  if (!template) {
    return validationError("Шаблон не знайдено.");
  }

  try {
    await prisma.checklistTemplateItem.create({
      data: {
        templateId: parsed.data.templateId,
        title: parsed.data.title,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
      },
    });
  } catch (error) {
    if (isForeignKeyError(error)) {
      return validationError("Шаблон не знайдено.");
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function updateChecklistTemplateItem(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = templateItemUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    sortOrder: formData.get("sortOrder"),
    isActive: parseCheckbox(formData.get("isActive")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.checklistTemplateItem.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return validationError("Пункт не знайдено.");
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function deleteChecklistTemplateItem(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = templateItemDeleteSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.checklistTemplateItem.delete({
      where: { id: parsed.data.id },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return validationError("Пункт не знайдено.");
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function startChecklistRun(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireChecklistOperator();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = startRunSchema.safeParse({
    kind: formData.get("kind"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const serviceDate = getKyivServiceDate();

  try {
    await prisma.$transaction(async (tx) => {
      const template = await tx.checklistTemplate.findFirst({
        where: { kind: parsed.data.kind, isActive: true },
        select: {
          id: true,
          title: true,
          kind: true,
          items: {
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
            select: { id: true, title: true, sortOrder: true },
          },
        },
      });

      if (!template) {
        throw new ChecklistActionError(
          `Немає активного шаблону для «${checklistKindLabel(parsed.data.kind)}».`,
        );
      }

      if (template.items.length === 0) {
        throw new ChecklistActionError(
          "Неможливо почати: у шаблоні немає активних пунктів.",
        );
      }

      const existing = await tx.checklistRun.findUnique({
        where: {
          templateId_serviceDate: {
            templateId: template.id,
            serviceDate,
          },
        },
        select: { id: true },
      });

      if (existing) {
        throw new ChecklistActionError(
          "Для цього шаблону сьогодні вже є виконання.",
        );
      }

      await tx.checklistRun.create({
        data: {
          templateId: template.id,
          serviceDate,
          titleSnapshot: template.title,
          kindSnapshot: template.kind,
          status: ChecklistRunStatus.IN_PROGRESS,
          startedById: authCheck.userId,
          items: {
            create: template.items.map((item) => ({
              titleSnapshot: item.title,
              sortOrder: item.sortOrder,
              templateItemId: item.id,
            })),
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof ChecklistActionError) {
      return validationError(error.message);
    }
    if (isUniqueConstraintError(error)) {
      return validationError(
        "Для цього шаблону сьогодні вже є виконання.",
      );
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function toggleChecklistRunItem(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireChecklistOperator();
  if (!authCheck.ok) {
    return authCheck;
  }

  const checkedRaw = formData.get("isChecked");
  const isChecked =
    checkedRaw === "true" || checkedRaw === "on" || checkedRaw === "1";

  const parsed = toggleRunItemSchema.safeParse({
    runItemId: formData.get("runItemId"),
    isChecked,
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.checklistRunItem.findUnique({
        where: { id: parsed.data.runItemId },
        select: {
          id: true,
          run: { select: { id: true, status: true } },
        },
      });

      if (!item) {
        throw new ChecklistActionError("Пункт не знайдено.");
      }

      if (item.run.status !== ChecklistRunStatus.IN_PROGRESS) {
        throw new ChecklistActionError(
          "Неможливо змінити пункт: виконання вже завершено.",
        );
      }

      await tx.checklistRunItem.update({
        where: { id: item.id },
        data: parsed.data.isChecked
          ? {
              isChecked: true,
              checkedAt: new Date(),
              checkedById: authCheck.userId,
            }
          : {
              isChecked: false,
              checkedAt: null,
              checkedById: null,
            },
      });
    });
  } catch (error) {
    if (error instanceof ChecklistActionError) {
      return validationError(error.message);
    }
    if (isRecordNotFoundError(error)) {
      return validationError("Пункт не знайдено.");
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}

export async function completeChecklistRun(
  _prevState: ChecklistActionResult | null,
  formData: FormData,
): Promise<ChecklistActionResult> {
  const authCheck = await requireChecklistOperator();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = completeRunSchema.safeParse({
    runId: formData.get("runId"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const run = await tx.checklistRun.findUnique({
        where: { id: parsed.data.runId },
        select: {
          id: true,
          status: true,
          items: { select: { id: true, isChecked: true } },
        },
      });

      if (!run) {
        throw new ChecklistActionError("Виконання не знайдено.");
      }

      if (run.status !== ChecklistRunStatus.IN_PROGRESS) {
        throw new ChecklistActionError("Це виконання вже завершено.");
      }

      if (run.items.length === 0) {
        throw new ChecklistActionError(
          "Неможливо завершити: немає пунктів у виконанні.",
        );
      }

      const unchecked = run.items.filter((item) => !item.isChecked);
      if (unchecked.length > 0) {
        throw new ChecklistActionError(
          "Неможливо завершити: відмітьте всі пункти чекліста.",
        );
      }

      await tx.checklistRun.update({
        where: { id: run.id },
        data: {
          status: ChecklistRunStatus.COMPLETED,
          completedById: authCheck.userId,
          completedAt: new Date(),
        },
      });
    });
  } catch (error) {
    if (error instanceof ChecklistActionError) {
      return validationError(error.message);
    }
    if (isRecordNotFoundError(error)) {
      return validationError("Виконання не знайдено.");
    }
    throw error;
  }

  revalidatePath(PATH);
  return { ok: true };
}
