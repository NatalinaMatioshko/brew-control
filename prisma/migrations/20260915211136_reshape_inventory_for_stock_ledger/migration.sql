-- CreateEnum
CREATE TYPE "InventoryUnit" AS ENUM ('PIECE', 'GRAM', 'KILOGRAM', 'MILLILITER', 'LITER', 'PACK');

-- AlterEnum
-- Old StockMovementType values (from 20260826165838_init): PURCHASE, ADJUSTMENT, WASTE.
-- Explicit mapping: PURCHASE → RECEIPT; ADJUSTMENT → ADJUSTMENT; WASTE → WASTE.
-- No ELSE fallback: any unexpected value yields NULL and fails NOT NULL on "type".
BEGIN;
CREATE TYPE "StockMovementType_new" AS ENUM ('RECEIPT', 'USAGE', 'ADJUSTMENT', 'WASTE');
ALTER TABLE "stock_movements" ALTER COLUMN "type" TYPE "StockMovementType_new" USING (
  CASE "type"::text
    WHEN 'PURCHASE' THEN 'RECEIPT'
    WHEN 'ADJUSTMENT' THEN 'ADJUSTMENT'
    WHEN 'WASTE' THEN 'WASTE'
  END
)::"StockMovementType_new"
);
ALTER TYPE "StockMovementType" RENAME TO "StockMovementType_old";
ALTER TYPE "StockMovementType_new" RENAME TO "StockMovementType";
DROP TYPE "public"."StockMovementType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_expense_id_fkey";

-- DropIndex
DROP INDEX "inventory_items_category_idx";

-- DropIndex
DROP INDEX "inventory_items_created_at_idx";

-- DropIndex
DROP INDEX "inventory_items_is_active_idx";

-- DropIndex
DROP INDEX "stock_movements_created_at_idx";

-- DropIndex
DROP INDEX "stock_movements_created_by_id_idx";

-- DropIndex
DROP INDEX "stock_movements_expense_id_idx";

-- DropIndex
DROP INDEX "stock_movements_inventory_item_id_idx";

-- DropIndex
DROP INDEX "stock_movements_type_idx";

-- AlterTable
ALTER TABLE "inventory_items" DROP COLUMN "average_unit_cost",
DROP COLUMN "category",
DROP COLUMN "current_quantity",
ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "unit",
ADD COLUMN     "unit" "InventoryUnit" NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "expense_id",
DROP COLUMN "notes",
DROP COLUMN "quantity_after",
DROP COLUMN "quantity_change",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "quantity_delta" DECIMAL(12,3) NOT NULL,
ALTER COLUMN "created_by_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "inventory_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_categories_slug_key" ON "inventory_categories"("slug");

-- CreateIndex
CREATE INDEX "inventory_categories_is_active_sort_order_idx" ON "inventory_categories"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "inventory_items_category_id_is_active_sort_order_idx" ON "inventory_items"("category_id", "is_active", "sort_order");

-- CreateIndex
CREATE INDEX "stock_movements_inventory_item_id_created_at_idx" ON "stock_movements"("inventory_item_id", "created_at");

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "inventory_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
