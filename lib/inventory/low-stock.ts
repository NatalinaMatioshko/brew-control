import {
  compareDecimalStrings,
  isNegativeDecimalString,
  normalizeDecimalString,
  subtractDecimalStrings,
} from "@/lib/inventory/decimal";

export type LowStockSourceCategory = {
  name: string;
  isActive: boolean;
  items: Array<{
    name: string;
    unit: string;
    isActive: boolean;
    minimumQuantity: { toString(): string } | string;
    balance: string;
  }>;
};

export type LowStockItemView = {
  categoryName: string;
  itemName: string;
  unit: string;
  balance: string;
  minimumQuantity: string;
  shortage: string;
  isNegativeBalance: boolean;
};

export function buildLowStockItems(
  categories: LowStockSourceCategory[],
): LowStockItemView[] {
  const rows: LowStockItemView[] = [];

  for (const category of categories) {
    if (!category.isActive) {
      continue;
    }

    for (const item of category.items) {
      if (!item.isActive) {
        continue;
      }

      const balance = normalizeDecimalString(item.balance);
      const minimumQuantity = normalizeDecimalString(item.minimumQuantity);

      if (compareDecimalStrings(balance, minimumQuantity) > 0) {
        continue;
      }

      const shortage = subtractDecimalStrings(minimumQuantity, balance);

      rows.push({
        categoryName: category.name,
        itemName: item.name,
        unit: item.unit,
        balance,
        minimumQuantity,
        shortage,
        isNegativeBalance: isNegativeDecimalString(balance),
      });
    }
  }

  rows.sort((left, right) => {
    if (left.isNegativeBalance !== right.isNegativeBalance) {
      return left.isNegativeBalance ? -1 : 1;
    }

    const shortageCmp = compareDecimalStrings(right.shortage, left.shortage);
    if (shortageCmp !== 0) {
      return shortageCmp;
    }

    const categoryCmp = left.categoryName.localeCompare(right.categoryName, "uk");
    if (categoryCmp !== 0) {
      return categoryCmp;
    }

    return left.itemName.localeCompare(right.itemName, "uk");
  });

  return rows;
}
