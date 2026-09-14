import { z } from "zod";

const UKR_TO_LAT: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "yu",
  я: "ya",
  "'": "",
  "’": "",
};

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Назва обов'язкова")
  .max(80, "Максимум 80 символів");

export const categorySlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(SLUG_REGEX, "Slug лише латиницею, lowercase, через дефіси");

export const categorySortOrderSchema = z.coerce
  .number()
  .int("Порядок має бути цілим числом")
  .min(0, "Мінімум 0")
  .max(10000, "Максимум 10 000");

export const categoryCreateSchema = z.object({
  name: categoryNameSchema,
  sortOrder: categorySortOrderSchema.default(0),
});

export const categoryUpdateSchema = z.object({
  id: z.string().trim().min(1, "Невідома категорія"),
  name: categoryNameSchema,
  slug: categorySlugSchema,
  sortOrder: categorySortOrderSchema,
  isActive: z.boolean(),
});

export const categoryDeleteSchema = z.object({
  id: z.string().trim().min(1, "Невідома категорія"),
});

export function slugifyCategoryName(name: string): string {
  const lower = name.trim().toLowerCase();
  let transliterated = "";

  for (const char of lower) {
    if (UKR_TO_LAT[char] !== undefined) {
      transliterated += UKR_TO_LAT[char];
      continue;
    }
    transliterated += char;
  }

  return transliterated
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function parseCategoryIsActive(value: FormDataEntryValue | null): boolean {
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

export function isCategoryInUseError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    ((error as { code: string }).code === "P2003" ||
      (error as { code: string }).code === "P2014")
  );
}
