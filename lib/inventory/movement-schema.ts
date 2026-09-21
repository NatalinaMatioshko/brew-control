import { z } from "zod";
import { StockMovementType } from "@/app/generated/prisma/enums";

export const STOCK_MOVEMENT_TYPE_OPTIONS = [
  { value: StockMovementType.RECEIPT, label: "Прихід" },
  { value: StockMovementType.USAGE, label: "Використання" },
  { value: StockMovementType.ADJUSTMENT, label: "Коригування" },
  { value: StockMovementType.WASTE, label: "Списання" },
] as const;

export const ADJUSTMENT_DIRECTION_OPTIONS = [
  { value: "INCREASE", label: "Збільшити залишок" },
  { value: "DECREASE", label: "Зменшити залишок" },
] as const;

export type AdjustmentDirection = "INCREASE" | "DECREASE";

const STOCK_MOVEMENT_TYPES = [
  StockMovementType.RECEIPT,
  StockMovementType.USAGE,
  StockMovementType.ADJUSTMENT,
  StockMovementType.WASTE,
] as const;

/** Positive decimal only: optional integer part, up to 3 fractional digits. No sci notation. */
const POSITIVE_DECIMAL_REGEX = /^(?:0|[1-9]\d*)(?:[.,]\d{1,3})?$/;

export function normalizePositiveDecimalString(raw: string):
  | { ok: true; value: string }
  | { ok: false; error: string } {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: false, error: "Кількість обов'язкова" };
  }

  if (/[eE]/.test(trimmed)) {
    return { ok: false, error: "Невірний формат кількості" };
  }

  if (trimmed.startsWith("-")) {
    return { ok: false, error: "Кількість має бути більше 0" };
  }

  if (!POSITIVE_DECIMAL_REGEX.test(trimmed)) {
    return {
      ok: false,
      error: "Невірний формат. Приклади: 10, 10,5 або 10.125",
    };
  }

  const normalized = trimmed.replace(",", ".");
  const [whole, fraction = ""] = normalized.split(".");

  if (whole === "0" && (fraction === "" || /^0+$/.test(fraction))) {
    return { ok: false, error: "Кількість має бути більше 0" };
  }

  const value = fraction.length > 0 ? `${whole}.${fraction}` : whole;
  return { ok: true, value };
}

export function applyMovementSign(
  type: (typeof STOCK_MOVEMENT_TYPES)[number],
  quantity: string,
  direction: AdjustmentDirection | null,
): string {
  if (type === StockMovementType.RECEIPT) {
    return quantity;
  }

  if (
    type === StockMovementType.USAGE ||
    type === StockMovementType.WASTE
  ) {
    return `-${quantity}`;
  }

  // ADJUSTMENT
  if (direction === "DECREASE") {
    return `-${quantity}`;
  }

  return quantity;
}

export const stockMovementCreateSchema = z
  .object({
    inventoryItemId: z.string().trim().min(1, "Оберіть позицію"),
    type: z.enum(STOCK_MOVEMENT_TYPES, {
      message: "Оберіть тип руху",
    }),
    quantity: z.string().trim().min(1, "Кількість обов'язкова"),
    adjustmentDirection: z
      .enum(["INCREASE", "DECREASE"])
      .optional()
      .nullable(),
    note: z
      .string()
      .trim()
      .max(500, "Максимум 500 символів")
      .transform((value) => (value.length === 0 ? null : value)),
  })
  .superRefine((data, ctx) => {
    const parsed = normalizePositiveDecimalString(data.quantity);
    if (!parsed.ok) {
      ctx.addIssue({ code: "custom", message: parsed.error, path: ["quantity"] });
    }

    if (data.type === StockMovementType.ADJUSTMENT) {
      if (data.adjustmentDirection !== "INCREASE" && data.adjustmentDirection !== "DECREASE") {
        ctx.addIssue({
          code: "custom",
          message: "Оберіть напрям коригування",
          path: ["adjustmentDirection"],
        });
      }
    }
  })
  .transform((data) => {
    const parsed = normalizePositiveDecimalString(data.quantity);
    if (!parsed.ok) {
      throw new Error(parsed.error);
    }

    const direction =
      data.type === StockMovementType.ADJUSTMENT
        ? (data.adjustmentDirection as AdjustmentDirection)
        : null;

    return {
      inventoryItemId: data.inventoryItemId,
      type: data.type,
      quantityDelta: applyMovementSign(data.type, parsed.value, direction),
      note: data.note,
    };
  });

/** Format Decimal-like values without Number() floating artifacts. */
export function formatQuantityDelta(
  value: { toString(): string } | string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return "0";
  }

  let raw = typeof value === "string" ? value : value.toString();
  if (raw === "") {
    return "0";
  }

  const negative = raw.startsWith("-");
  if (negative) {
    raw = raw.slice(1);
  }

  if (raw.includes(".")) {
    raw = raw.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  }

  if (raw === "") {
    raw = "0";
  }

  return negative ? `-${raw}` : raw;
}

export function formatSignedQuantityDelta(
  value: { toString(): string } | string | number | null | undefined,
): string {
  const formatted = formatQuantityDelta(value);
  if (formatted === "0") {
    return "0";
  }
  if (formatted.startsWith("-")) {
    return formatted;
  }
  return `+${formatted}`;
}

export function formatMovementType(type: string): string {
  return (
    STOCK_MOVEMENT_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    type
  );
}
