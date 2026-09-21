import { z } from "zod";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";
import { formatQuantityDelta } from "@/lib/inventory/movement-schema";

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

  const normalized = trimmed.replace(",", ".");
  const [whole, fraction = ""] = normalized.split(".");
  const value =
    fraction.length > 0
      ? `${whole}.${fraction.replace(/0+$/, "")}`.replace(/\.$/, "")
      : whole;

  return { ok: true, value: value === "" ? "0" : value };
}

const SCALE_DIGITS = 3;
const SCALE_FACTOR = 1000n;

/** Convert decimal string to fixed-scale bigint (×10^3). No JS Number. */
function decimalStringToScaled(raw: string): bigint {
  const normalized = formatQuantityDelta(raw);
  const negative = normalized.startsWith("-");
  const abs = negative ? normalized.slice(1) : normalized;
  const [wholePart, fractionPart = ""] = abs.split(".");
  const whole = BigInt(wholePart === "" ? "0" : wholePart);
  const fraction = BigInt(`${fractionPart}000`.slice(0, SCALE_DIGITS));
  const scaled = whole * SCALE_FACTOR + fraction;
  return negative ? -scaled : scaled;
}

/** Convert fixed-scale bigint back to decimal string. */
function scaledToDecimalString(scaled: bigint): string {
  const negative = scaled < 0n;
  const abs = negative ? -scaled : scaled;
  const whole = abs / SCALE_FACTOR;
  const fraction = abs % SCALE_FACTOR;
  const fractionStr = fraction
    .toString()
    .padStart(SCALE_DIGITS, "0")
    .replace(/0+$/, "");
  const value =
    fractionStr.length > 0 ? `${whole.toString()}.${fractionStr}` : whole.toString();
  return negative ? `-${value}` : value;
}

/** Decimal-safe subtraction: actual − current → signed delta string. */
export function subtractDecimalStrings(actual: string, current: string): string {
  const delta = decimalStringToScaled(actual) - decimalStringToScaled(current);
  return scaledToDecimalString(delta);
}

export function isZeroDecimalString(value: string): boolean {
  return decimalStringToScaled(value) === 0n;
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
