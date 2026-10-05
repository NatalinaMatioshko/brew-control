import { z } from "zod";

export const ChecklistKind = {
  OPENING: "OPENING",
  CLOSING: "CLOSING",
} as const;

export type ChecklistKind =
  (typeof ChecklistKind)[keyof typeof ChecklistKind];

export const ChecklistRunStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type ChecklistRunStatus =
  (typeof ChecklistRunStatus)[keyof typeof ChecklistRunStatus];

const CHECKLIST_KINDS = [
  ChecklistKind.OPENING,
  ChecklistKind.CLOSING,
] as const;

export const CHECKLIST_KIND_OPTIONS = [
  { value: ChecklistKind.OPENING, label: "Відкриття зміни" },
  { value: ChecklistKind.CLOSING, label: "Закриття зміни" },
] as const;

export function checklistKindLabel(kind: string): string {
  return (
    CHECKLIST_KIND_OPTIONS.find((option) => option.value === kind)?.label ??
    kind
  );
}

export function parseCheckbox(value: FormDataEntryValue | null): boolean {
  return value === "on";
}

const titleSchema = z
  .string()
  .trim()
  .min(1, "Назва обов'язкова")
  .max(200, "Максимум 200 символів");

const sortOrderSchema = z.coerce
  .number()
  .int("Порядок має бути цілим числом")
  .min(0, "Мінімум 0")
  .max(10000, "Максимум 10 000");

const kindSchema = z.enum(CHECKLIST_KINDS, {
  message: "Оберіть тип чекліста",
});

export const templateCreateSchema = z.object({
  kind: kindSchema,
  title: titleSchema,
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean(),
});

export const templateUpdateSchema = z.object({
  id: z.string().trim().min(1, "Невідомий шаблон"),
  kind: kindSchema,
  title: titleSchema,
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
});

export const templateDeleteSchema = z.object({
  id: z.string().trim().min(1, "Невідомий шаблон"),
});

export const templateItemCreateSchema = z.object({
  templateId: z.string().trim().min(1, "Невідомий шаблон"),
  title: titleSchema,
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean(),
});

export const templateItemUpdateSchema = z.object({
  id: z.string().trim().min(1, "Невідомий пункт"),
  title: titleSchema,
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
});

export const templateItemDeleteSchema = z.object({
  id: z.string().trim().min(1, "Невідомий пункт"),
});

export const startRunSchema = z.object({
  kind: kindSchema,
});

export const toggleRunItemSchema = z.object({
  runItemId: z.string().trim().min(1, "Невідомий пункт"),
  isChecked: z.boolean(),
});

export const completeRunSchema = z.object({
  runId: z.string().trim().min(1, "Невідоме виконання"),
});

export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

export function isRecordNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2025"
  );
}

export function isForeignKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2003"
  );
}

/**
 * Calendar date (YYYY-MM-DD) in Europe/Kyiv as a UTC midnight Date for @db.Date.
 */
export function getKyivServiceDate(now: Date = new Date()): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Не вдалося визначити дату служби.");
  }

  return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
}

export function formatServiceDate(date: Date): string {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatDateTimeKyiv(date: Date): string {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function userDisplayLabel(
  user: { name: string | null; email: string | null } | null | undefined,
): string {
  if (!user) {
    return "—";
  }
  return user.name?.trim() || user.email?.trim() || "—";
}
