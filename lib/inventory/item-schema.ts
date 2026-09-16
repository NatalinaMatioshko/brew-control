import { z } from "zod";
import { InventoryUnit } from "@/app/generated/prisma/enums";

const INVENTORY_UNITS = [
  InventoryUnit.PIECE,
  InventoryUnit.GRAM,
  InventoryUnit.KILOGRAM,
  InventoryUnit.MILLILITER,
  InventoryUnit.LITER,
  InventoryUnit.PACK,
] as const;

export const INVENTORY_UNIT_OPTIONS: ReadonlyArray<{
  value: (typeof INVENTORY_UNITS)[number];
  label: string;
}> = [
  { value: InventoryUnit.PIECE, label: "шт" },
  { value: InventoryUnit.GRAM, label: "г" },
  { value: InventoryUnit.KILOGRAM, label: "кг" },
  { value: InventoryUnit.MILLILITER, label: "мл" },
  { value: InventoryUnit.LITER, label: "л" },
  { value: InventoryUnit.PACK, label: "пач." },
];

export function formatInventoryUnit(unit: string): string {
  return INVENTORY_UNIT_OPTIONS.find((option) => option.value === unit)?.label ?? unit;
}

export const inventoryItemNameSchema = z
  .string()
  .trim()
  .min(1, "Назва обов'язкова")
  .max(120, "Максимум 120 символів");

export const inventoryItemUnitSchema = z.enum(INVENTORY_UNITS, {
  message: "Оберіть одиницю виміру",
});

/** Empty → 0 (DB column is required Decimal). Otherwise non-negative integer. */
export const inventoryItemMinimumQuantitySchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return 0;
    }
    if (typeof value === "string" && value.trim() === "") {
      return 0;
    }
    return value;
  },
  z.coerce
    .number()
    .int("Мінімальна кількість має бути цілим числом")
    .min(0, "Мінімум 0"),
);

export const inventoryItemCreateSchema = z.object({
  categoryId: z.string().trim().min(1, "Оберіть категорію"),
  name: inventoryItemNameSchema,
  unit: inventoryItemUnitSchema,
  minimumQuantity: inventoryItemMinimumQuantitySchema,
});

export const inventoryItemUpdateSchema = z.object({
  id: z.string().trim().min(1, "Невідома позиція"),
  name: inventoryItemNameSchema,
  unit: inventoryItemUnitSchema,
  minimumQuantity: inventoryItemMinimumQuantitySchema,
  isActive: z.boolean(),
});

export const inventoryItemDeleteSchema = z.object({
  id: z.string().trim().min(1, "Невідома позиція"),
});

export function parseInventoryItemIsActive(
  value: FormDataEntryValue | null,
): boolean {
  return value === "on";
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
