const PRICE_REGEX = /^\d+(?:[.,]\d{1,2})?$/;
const MAX_UAH = 1_000_000;

const uahFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
});

/**
 * Parse UI price string to integer kopecks without Float/parseFloat.
 * Accepts: 65 | 65,5 | 65,50 | 65.50
 */
export function parsePriceToKopecks(raw: string):
  | { ok: true; kopecks: number }
  | { ok: false; error: string } {
  const value = raw.trim();

  if (!value) {
    return { ok: false, error: "Ціна обов'язкова" };
  }

  if (!PRICE_REGEX.test(value)) {
    return {
      ok: false,
      error: "Невірний формат ціни. Приклади: 65, 65,5, 65,50 або 65.50",
    };
  }

  const normalized = value.replace(",", ".");
  const [wholePart, fractionPart = ""] = normalized.split(".");
  const paddedFraction = `${fractionPart}00`.slice(0, 2);

  const hryvnias = Number.parseInt(wholePart, 10);
  const kopeckPart = Number.parseInt(paddedFraction, 10);

  if (!Number.isFinite(hryvnias) || !Number.isFinite(kopeckPart)) {
    return { ok: false, error: "Невірний формат ціни" };
  }

  if (hryvnias > MAX_UAH || (hryvnias === MAX_UAH && kopeckPart > 0)) {
    return { ok: false, error: "Максимальна ціна — 1 000 000 ₴" };
  }

  const kopecks = hryvnias * 100 + kopeckPart;

  if (kopecks <= 0) {
    return { ok: false, error: "Ціна має бути більше 0" };
  }

  return { ok: true, kopecks };
}

export function formatPriceUah(priceInKopecks: number): string {
  return uahFormatter.format(priceInKopecks / 100);
}

/** Value for price input (edit form), always with two decimal digits. */
export function kopecksToPriceInput(priceInKopecks: number): string {
  const hryvnias = Math.trunc(priceInKopecks / 100);
  const kopecks = Math.abs(priceInKopecks % 100);
  return `${hryvnias},${String(kopecks).padStart(2, "0")}`;
}
