import type { PrismaClient } from "@/app/generated/prisma/client";

type InventoryLockClient = Pick<PrismaClient, "$queryRaw">;

/**
 * Row-lock a single inventory_items row inside an interactive transaction.
 * Uses parameterized `$queryRaw` (Postgres `$1` under the hood).
 */
export async function lockInventoryItemForUpdate(
  tx: InventoryLockClient,
  itemId: string,
): Promise<{ id: string } | null> {
  const rows = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM inventory_items
    WHERE id = ${itemId}
    FOR UPDATE
  `;

  return rows[0] ?? null;
}
