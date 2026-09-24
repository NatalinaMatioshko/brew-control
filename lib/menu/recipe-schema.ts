import { z } from "zod";
import { normalizePositiveDecimalString } from "@/lib/inventory/movement-schema";

export const recipeNoteSchema = z
  .string()
  .trim()
  .max(500, "Максимум 500 символів")
  .transform((value) => (value.length === 0 ? null : value));

const recipeIngredientInputSchema = z.object({
  inventoryItemId: z.string().trim().min(1, "Оберіть позицію складу"),
  quantity: z.string().trim().min(1, "Кількість обов'язкова"),
});

export const recipeSaveSchema = z
  .object({
    productId: z.string().trim().min(1, "Невідомий товар"),
    note: recipeNoteSchema,
    ingredients: z
      .array(recipeIngredientInputSchema)
      .min(1, "Додайте щонайменше один інгредієнт"),
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>();

    data.ingredients.forEach((ingredient, index) => {
      if (seen.has(ingredient.inventoryItemId)) {
        ctx.addIssue({
          code: "custom",
          message: "Одну позицію складу не можна додати двічі",
          path: ["ingredients", index, "inventoryItemId"],
        });
      } else if (ingredient.inventoryItemId) {
        seen.add(ingredient.inventoryItemId);
      }

      const parsed = normalizePositiveDecimalString(ingredient.quantity);
      if (!parsed.ok) {
        ctx.addIssue({
          code: "custom",
          message: parsed.error,
          path: ["ingredients", index, "quantity"],
        });
      }
    });
  })
  .transform((data) => ({
    productId: data.productId,
    note: data.note,
    ingredients: data.ingredients.map((ingredient, index) => {
      const parsed = normalizePositiveDecimalString(ingredient.quantity);
      if (!parsed.ok) {
        throw new Error(parsed.error);
      }

      return {
        inventoryItemId: ingredient.inventoryItemId,
        quantity: parsed.value,
        sortOrder: index,
      };
    }),
  }));

export const recipeDeleteSchema = z.object({
  productId: z.string().trim().min(1, "Невідомий товар"),
});

export function parseRecipeIngredientsFromFormData(formData: FormData): Array<{
  inventoryItemId: string;
  quantity: string;
}> {
  const itemIds = formData.getAll("inventoryItemId").map((value) => String(value));
  const quantities = formData.getAll("quantity").map((value) => String(value));
  const length = Math.max(itemIds.length, quantities.length);

  const ingredients: Array<{ inventoryItemId: string; quantity: string }> = [];
  for (let index = 0; index < length; index += 1) {
    ingredients.push({
      inventoryItemId: itemIds[index] ?? "",
      quantity: quantities[index] ?? "",
    });
  }

  return ingredients;
}
