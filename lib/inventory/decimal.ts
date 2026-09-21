/**
 * Shared Decimal(12,3)-safe string arithmetic without JS Number/float.
 * Scale: fixed bigint × 1000 (3 fractional digits).
 */

const SCALE_DIGITS = 3;
const SCALE_FACTOR = 1000n;

/**
 * Normalize a Decimal-like value to a canonical decimal string
 * (trim trailing zeros, preserve sign). No Number().
 */
export function normalizeDecimalString(
  value: { toString(): string } | string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return "0";
  }

  let raw = typeof value === "string" ? value.trim() : value.toString();
  if (raw === "") {
    return "0";
  }

  raw = raw.replace(",", ".");

  const negative = raw.startsWith("-");
  if (negative) {
    raw = raw.slice(1);
  }
  if (raw.startsWith("+")) {
    raw = raw.slice(1);
  }

  if (raw.includes(".")) {
    raw = raw.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  }

  if (raw === "") {
    raw = "0";
  }

  return negative && raw !== "0" ? `-${raw}` : raw;
}

function decimalStringToScaled(raw: string): bigint {
  const normalized = normalizeDecimalString(raw);
  const negative = normalized.startsWith("-");
  const abs = negative ? normalized.slice(1) : normalized;
  const [wholePart, fractionPart = ""] = abs.split(".");
  const whole = BigInt(wholePart === "" ? "0" : wholePart);
  const fraction = BigInt(`${fractionPart}000`.slice(0, SCALE_DIGITS));
  const scaled = whole * SCALE_FACTOR + fraction;
  return negative ? -scaled : scaled;
}

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

export function compareDecimalStrings(a: string, b: string): -1 | 0 | 1 {
  const left = decimalStringToScaled(a);
  const right = decimalStringToScaled(b);
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

/** Decimal-safe subtraction: a − b → signed decimal string. */
export function subtractDecimalStrings(a: string, b: string): string {
  return scaledToDecimalString(decimalStringToScaled(a) - decimalStringToScaled(b));
}

export function isZeroDecimalString(value: string): boolean {
  return decimalStringToScaled(value) === 0n;
}

export function isNegativeDecimalString(value: string): boolean {
  return decimalStringToScaled(value) < 0n;
}
