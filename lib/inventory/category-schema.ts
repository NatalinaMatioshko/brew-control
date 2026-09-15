import { z } from "zod";
import { slugifyUkToLatin } from "@/lib/slugify";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const inventoryCategoryNameSchema = z
  .string()
  .trim()
  .min(1, "Назва обов'язкова")
  .max(80, "Максимум 80 символів");

export const inventoryCategorySlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(SLUG_REGEX, "Slug лише латиницею, lowercase, через дефіси");

export const inventoryCategorySortOrderSchema = z.coerce
  .number()
  .int("Порядок має бути цілим числом")
  .min(0, "Мінімум 0")
  .max(10000, "Максимум 10 000");

export const inventoryCategoryCreateSchema = z.object({
  name: inventoryCategoryNameSchema,
  sortOrder: inventoryCategorySortOrderSchema.default(0),
});

export const inventoryCategoryUpdateSchema = z.object({
  id: z.string().trim().min(1, "Невідома категорія"),
  name: inventoryCategoryNameSchema,
  slug: inventoryCategorySlugSchema,
  sortOrder: inventoryCategorySortOrderSchema,
  isActive: z.boolean(),
});

export const inventoryCategoryDeleteSchema = z.object({
  id: z.string().trim().min(1, "Невідома категорія"),
});

export function slugifyInventoryCategoryName(name: string): string {
  return slugifyUkToLatin(name);
}

export function parseInventoryCategoryIsActive(
  value: FormDataEntryValue | null,
): boolean {
  return value === "on";
}

export function isUniqueSlugError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

export function isInventoryCategoryInUseError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    ((error as { code: string }).code === "P2003" ||
      (error as { code: string }).code === "P2014")
  );
}
