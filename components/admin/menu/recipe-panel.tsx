import { formatInventoryUnit } from "@/lib/inventory/item-schema";
import { formatQuantityDelta } from "@/lib/inventory/movement-schema";
import { normalizeDecimalString } from "@/lib/inventory/decimal";

export type RecipeIngredientView = {
  id: string;
  quantity: string;
  sortOrder: number;
  inventoryItem: {
    id: string;
    name: string;
    unit: string;
    isActive: boolean;
    categoryName: string;
  };
};

export type RecipeView = {
  id: string;
  note: string | null;
  ingredients: RecipeIngredientView[];
};

type RecipePanelProps = {
  recipe: RecipeView | null;
};

export function RecipePanel({ recipe }: RecipePanelProps) {
  return (
    <div className="mt-3 rounded-xl border border-[#efe3d3] bg-[#fbf6f0] px-3 py-3">
      <h6 className="text-xs font-semibold uppercase tracking-wide text-[#8a7262]">
        Технологічна карта
      </h6>

      {!recipe ? (
        <p className="mt-2 text-sm text-[#5c4638]">Рецепт ще не задано.</p>
      ) : (
        <div className="mt-2 space-y-2">
          {recipe.note ? (
            <p className="text-sm text-[#5c4638]">{recipe.note}</p>
          ) : null}
          <ul className="space-y-1.5">
            {recipe.ingredients.map((ingredient) => {
              const unitLabel = formatInventoryUnit(ingredient.inventoryItem.unit);
              const quantityLabel = formatQuantityDelta(
                normalizeDecimalString(ingredient.quantity),
              );
              return (
                <li
                  key={ingredient.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-[#3c2a21]"
                >
                  <span>
                    {ingredient.inventoryItem.name}
                    {!ingredient.inventoryItem.isActive ? (
                      <span className="ml-1 text-xs font-medium text-[#8a7262]">
                        (неактивна)
                      </span>
                    ) : null}
                    <span className="ml-1 text-xs text-[#8a7262]">
                      · {ingredient.inventoryItem.categoryName}
                    </span>
                  </span>
                  <span className="tabular-nums font-medium">
                    {quantityLabel} {unitLabel}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
