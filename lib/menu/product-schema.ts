import { z } from "zod";
import { parsePriceToKopecks } from "@/lib/menu/money";

export const productNameSchema = z
  .string()
  .trim()
  .min(1, "Назва обов'язкова")
  .max(120, "Максимум 120 символів");

export const productDescriptionSchema = z
  .string()
  .trim()
  .max(1000, "Максимум 1000 символів")
  .transform((value) => (value.length === 0 ? null : value));

export const productCategoryIdSchema = z
  .string()
  .trim()
  .min(1, "Оберіть категорію");

export const productSortOrderSchema = z.coerce
  .number()
  .int("Порядок має бути цілим числом")
  .min(0, "Мінімум 0")
  .max(10000, "Максимум 10 000");

export const productPriceFieldSchema = z
  .string()
  .trim()
  .min(1, "Ціна обов'язкова")
  .superRefine((value, ctx) => {
    const parsed = parsePriceToKopecks(value);
    if (!parsed.ok) {
      ctx.addIssue({ code: "custom", message: parsed.error });
    }
  })
  .transform((value) => {
    const parsed = parsePriceToKopecks(value);
    if (!parsed.ok) {
      throw new Error(parsed.error);
    }
    return parsed.kopecks;
  });

export const productCreateSchema = z.object({
  name: productNameSchema,
  description: productDescriptionSchema,
  priceInKopecks: productPriceFieldSchema,
  categoryId: productCategoryIdSchema,
  sortOrder: productSortOrderSchema.default(0),
  isActive: z.boolean(),
  isAvailable: z.boolean(),
});

export const productUpdateSchema = z.object({
  id: z.string().trim().min(1, "Невідомий товар"),
  name: productNameSchema,
  description: productDescriptionSchema,
  priceInKopecks: productPriceFieldSchema,
  categoryId: productCategoryIdSchema,
  sortOrder: productSortOrderSchema,
  isActive: z.boolean(),
  isAvailable: z.boolean(),
});

export const productDeleteSchema = z.object({
  id: z.string().trim().min(1, "Невідомий товар"),
});

export function parseProductCheckbox(
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
