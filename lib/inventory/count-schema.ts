import { z } from "zod";
import { normalizeDecimalString } from "@/lib/inventory/decimal";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";
import { formatQuantityDelta } from "@/lib/inventory/movement-schema";

export { isZeroDecimalString, subtractDecimalStrings } from "@/lib/inventory/decimal";

/** Non-negative decimal: 0 allowed, up to 3 fractional digits. No sci notation. */
const NON_NEGATIVE_DECIMAL_REGEX = /^(?:0|[1-9]\d*)(?:[.,]\d{1,3})?$/;

export function normalizeNonNegativeDecimalString(raw: string):
  | { ok: true; value: string }
  | { ok: false; error: string } {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: false, error: "Фактичний залишок обов'язковий" };
  }

  if (/[eE]/.test(trimmed)) {
    return { ok: false, error: "Невірний формат кількості" };
  }

  if (trimmed.startsWith("-") || trimmed.startsWith("+")) {
    return { ok: false, error: "Фактичний залишок не може бути від'ємним" };
  }

  if (!NON_NEGATIVE_DECIMAL_REGEX.test(trimmed)) {
    return {
      ok: false,
      error: "Невірний формат. Приклади: 0, 10, 10,5 або 10.125",
    };
  }

  return { ok: true, value: normalizeDecimalString(trimmed.replace(",", ".")) };
}

export function buildInventoryCountNote(
  actual: string,
  current: string,
  unit: string,
): string {
  const unitLabel = formatInventoryUnit(unit);
  const actualLabel = formatQuantityDelta(actual);
  const currentLabel = formatQuantityDelta(current);
  return `Інвентаризація: факт ${actualLabel} ${unitLabel}, система ${currentLabel} ${unitLabel}.`;
}

export const inventoryCountCreateSchema = z
  .object({
    inventoryItemId: z.string().trim().min(1, "Оберіть позицію"),
    actualQuantity: z.string().trim().min(1, "Фактичний залишок обов'язковий"),
  })
  .superRefine((data, ctx) => {
    const parsed = normalizeNonNegativeDecimalString(data.actualQuantity);
    if (!parsed.ok) {
      ctx.addIssue({
        code: "custom",
        message: parsed.error,
        path: ["actualQuantity"],
      });
    }
  })
  .transform((data) => {
    const parsed = normalizeNonNegativeDecimalString(data.actualQuantity);
    if (!parsed.ok) {
      throw new Error(parsed.error);
    }

    return {
      inventoryItemId: data.inventoryItemId,
      actualQuantity: parsed.value,
    };
  });
