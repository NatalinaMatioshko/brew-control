import { CategoryList } from "@/components/admin/menu/category-list";
import { auth } from "@/auth";
import { normalizeDecimalString } from "@/lib/inventory/decimal";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Меню · Brew Control",
};

export default async function AdminMenuPage() {
  const session = await auth();
  const canWrite = session?.user?.role === "ADMIN";

  const [categories, inventoryItems] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        isActive: true,
        _count: { select: { products: true } },
        products: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            description: true,
            priceInKopecks: true,
            isActive: true,
            isAvailable: true,
            sortOrder: true,
            categoryId: true,
            recipe: {
              select: {
                id: true,
                note: true,
                ingredients: {
                  orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
                  select: {
                    id: true,
                    quantity: true,
                    sortOrder: true,
                    inventoryItem: {
                      select: {
                        id: true,
                        name: true,
                        unit: true,
                        isActive: true,
                        category: { select: { name: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.inventoryItem.findMany({
      where: { isActive: true },
      orderBy: [
        { category: { sortOrder: "asc" } },
        { category: { name: "asc" } },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        unit: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const inventoryItemOptions = inventoryItems.map((item) => ({
    id: item.id,
    name: item.name,
    unit: item.unit,
    categoryName: item.category.name,
  }));

  return (
    <main className="px-4 py-8 sm:px-6">
      <p className="text-sm font-medium text-[#8a7262]">Меню</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#3c2a21]">
        Категорії та товари
      </h1>
      <p className="mt-3 max-w-2xl text-[#5c4638]">
        {canWrite
          ? "Керуйте категоріями, товарами меню та технологічними картами."
          : "Перегляд категорій, товарів і технологічних карт. Редагування доступне лише адміністратору."}
      </p>

      <div className="mt-8">
        <CategoryList
          canWrite={canWrite}
          inventoryItemOptions={inventoryItemOptions}
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            productCount: category._count.products,
            products: category.products.map((product) => ({
              id: product.id,
              name: product.name,
              description: product.description,
              priceInKopecks: product.priceInKopecks,
              isActive: product.isActive,
              isAvailable: product.isAvailable,
              sortOrder: product.sortOrder,
              categoryId: product.categoryId,
              recipe: product.recipe
                ? {
                    id: product.recipe.id,
                    note: product.recipe.note,
                    ingredients: product.recipe.ingredients.map((ingredient) => ({
                      id: ingredient.id,
                      quantity: normalizeDecimalString(ingredient.quantity),
                      sortOrder: ingredient.sortOrder,
                      inventoryItem: {
                        id: ingredient.inventoryItem.id,
                        name: ingredient.inventoryItem.name,
                        unit: ingredient.inventoryItem.unit,
                        isActive: ingredient.inventoryItem.isActive,
                        categoryName: ingredient.inventoryItem.category.name,
                      },
                    })),
                  }
                : null,
            })),
          }))}
        />
      </div>
    </main>
  );
}
