import { InventoryCategoryList } from "@/components/admin/inventory/category-list";
import { auth } from "@/auth";
import { formatQuantityDelta } from "@/lib/inventory/movement-schema";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Склад · Brew Control",
};

function createdByLabel(
  createdBy: { name: string | null; email: string | null } | null,
): string {
  if (!createdBy) {
    return "Система/невідомо";
  }

  return createdBy.name?.trim() || createdBy.email?.trim() || "Система/невідомо";
}

export default async function AdminInventoryPage() {
  const session = await auth();
  const canWrite = session?.user?.role === "ADMIN";

  const categories = await prisma.inventoryCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      sortOrder: true,
      isActive: true,
      _count: { select: { items: true } },
      items: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          unit: true,
          minimumQuantity: true,
          isActive: true,
          sortOrder: true,
          categoryId: true,
        },
      },
    },
  });

  const itemIds = categories.flatMap((category) =>
    category.items.map((item) => item.id),
  );

  const [balanceRows, recentMovements] =
    itemIds.length === 0
      ? [[], []]
      : await Promise.all([
          prisma.stockMovement.groupBy({
            by: ["inventoryItemId"],
            where: { inventoryItemId: { in: itemIds } },
            _sum: { quantityDelta: true },
          }),
          prisma.stockMovement.findMany({
            where: { inventoryItemId: { in: itemIds } },
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              type: true,
              quantityDelta: true,
              note: true,
              createdAt: true,
              inventoryItemId: true,
              createdBy: {
                select: { name: true, email: true },
              },
            },
          }),
        ]);

  const balanceByItemId = new Map(
    balanceRows.map((row) => [
      row.inventoryItemId,
      formatQuantityDelta(row._sum.quantityDelta ?? "0"),
    ]),
  );

  const movementsByItemId = new Map<string, typeof recentMovements>();
  for (const movement of recentMovements) {
    const list = movementsByItemId.get(movement.inventoryItemId) ?? [];
    if (list.length < 10) {
      list.push(movement);
      movementsByItemId.set(movement.inventoryItemId, list);
    }
  }

  return (
    <main className="px-4 py-8 sm:px-6">
      <p className="text-sm font-medium text-[#8a7262]">Склад</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#3c2a21]">
        Категорії та позиції складу
      </h1>
      <p className="mt-3 max-w-2xl text-[#5c4638]">
        {canWrite
          ? "Керуйте категоріями, позиціями та рухами складу. Поточний залишок — сума всіх рухів."
          : "Перегляд категорій, позицій, залишків і історії рухів. Редагування доступне лише адміністратору."}
      </p>

      <div className="mt-8">
        <InventoryCategoryList
          canWrite={canWrite}
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            itemCount: category._count.items,
            items: category.items.map((item) => ({
              id: item.id,
              name: item.name,
              unit: item.unit,
              minimumQuantity: Number(item.minimumQuantity),
              isActive: item.isActive,
              sortOrder: item.sortOrder,
              categoryId: item.categoryId,
              balance: balanceByItemId.get(item.id) ?? "0",
              movements: (movementsByItemId.get(item.id) ?? []).map(
                (movement) => ({
                  id: movement.id,
                  type: movement.type,
                  quantityDelta: formatQuantityDelta(movement.quantityDelta),
                  note: movement.note,
                  createdAt: movement.createdAt.toISOString(),
                  createdByLabel: createdByLabel(movement.createdBy),
                }),
              ),
            })),
          }))}
        />
      </div>
    </main>
  );
}
