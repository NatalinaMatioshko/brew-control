"use server";

import {
  inventoryCategoryCreateSchema,
  inventoryCategoryDeleteSchema,
  inventoryCategoryUpdateSchema,
  isInventoryCategoryInUseError,
  isUniqueSlugError,
  parseInventoryCategoryIsActive,
  slugifyInventoryCategoryName,
} from "@/lib/inventory/category-schema";
import {
  buildInventoryCountNote,
  inventoryCountCreateSchema,
  isZeroDecimalString,
  subtractDecimalStrings,
} from "@/lib/inventory/count-schema";
import { lockInventoryItemForUpdate } from "@/lib/inventory/item-lock";
import {
  inventoryItemCreateSchema,
  inventoryItemDeleteSchema,
  inventoryItemUpdateSchema,
  isForeignKeyError,
  isRecordNotFoundError,
  parseInventoryItemIsActive,
} from "@/lib/inventory/item-schema";
import {
  formatQuantityDelta,
  stockMovementCreateSchema,
} from "@/lib/inventory/movement-schema";
import {
  requireAdminWriter,
  validationError,
  type MenuActionResult,
} from "@/lib/menu/action-auth";
import { StockMovementType } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type InventoryCategoryActionResult = MenuActionResult;
export type InventoryItemActionResult = MenuActionResult;
export type StockMovementActionResult = MenuActionResult;
export type InventoryCountActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function createInventoryCategory(
  _prevState: InventoryCategoryActionResult | null,
  formData: FormData,
): Promise<InventoryCategoryActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = inventoryCategoryCreateSchema.safeParse({
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") ?? "0",
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const slug = slugifyInventoryCategoryName(parsed.data.name);
  if (!slug) {
    return validationError("Не вдалося згенерувати slug з назви.");
  }

  try {
    await prisma.inventoryCategory.create({
      data: {
        name: parsed.data.name,
        slug,
        sortOrder: parsed.data.sortOrder,
        isActive: true,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return validationError("Категорія складу з таким slug уже існує.");
    }
    throw error;
  }

  revalidatePath("/admin/inventory");
  return { ok: true };
}

export async function updateInventoryCategory(
  _prevState: InventoryCategoryActionResult | null,
  formData: FormData,
): Promise<InventoryCategoryActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = inventoryCategoryUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    isActive: parseInventoryCategoryIsActive(formData.get("isActive")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.inventoryCategory.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return validationError("Категорія складу з таким slug уже існує.");
    }
    throw error;
  }

  revalidatePath("/admin/inventory");
  return { ok: true };
}

export async function deleteInventoryCategory(
  _prevState: InventoryCategoryActionResult | null,
  formData: FormData,
): Promise<InventoryCategoryActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = inventoryCategoryDeleteSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const category = await prisma.inventoryCategory.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      _count: { select: { items: true } },
    },
  });

  if (!category) {
    return validationError("Категорію не знайдено.");
  }

  if (category._count.items > 0) {
    return validationError("Неможливо видалити: у категорії є позиції складу.");
  }

  try {
    await prisma.inventoryCategory.delete({
      where: { id: parsed.data.id },
    });
  } catch (error) {
    if (isInventoryCategoryInUseError(error)) {
      return validationError("Неможливо видалити: у категорії є позиції складу.");
    }
    throw error;
  }

  revalidatePath("/admin/inventory");
  return { ok: true };
}

async function ensureInventoryCategoryExists(
  categoryId: string,
): Promise<InventoryItemActionResult | null> {
  const category = await prisma.inventoryCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return validationError("Категорію не знайдено.");
  }

  return null;
}

export async function createInventoryItem(
  _prevState: InventoryItemActionResult | null,
  formData: FormData,
): Promise<InventoryItemActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = inventoryItemCreateSchema.safeParse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    unit: formData.get("unit"),
    minimumQuantity: formData.get("minimumQuantity") ?? "",
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const categoryError = await ensureInventoryCategoryExists(parsed.data.categoryId);
  if (categoryError) {
    return categoryError;
  }

  try {
    await prisma.inventoryItem.create({
      data: {
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
        unit: parsed.data.unit,
        minimumQuantity: parsed.data.minimumQuantity,
        isActive: true,
      },
    });
  } catch (error) {
    if (isForeignKeyError(error)) {
      return validationError("Категорію не знайдено.");
    }
    throw error;
  }

  revalidatePath("/admin/inventory");
  return { ok: true };
}

export async function updateInventoryItem(
  _prevState: InventoryItemActionResult | null,
  formData: FormData,
): Promise<InventoryItemActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = inventoryItemUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    unit: formData.get("unit"),
    minimumQuantity: formData.get("minimumQuantity") ?? "",
    isActive: parseInventoryItemIsActive(formData.get("isActive")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.inventoryItem.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        unit: parsed.data.unit,
        minimumQuantity: parsed.data.minimumQuantity,
        isActive: parsed.data.isActive,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return validationError("Позицію не знайдено.");
    }
    throw error;
  }

  revalidatePath("/admin/inventory");
  return { ok: true };
}

export async function deleteInventoryItem(
  _prevState: InventoryItemActionResult | null,
  formData: FormData,
): Promise<InventoryItemActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = inventoryItemDeleteSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const item = await prisma.inventoryItem.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      _count: {
        select: {
          stockMovements: true,
          recipeIngredients: true,
        },
      },
    },
  });

  if (!item) {
    return validationError("Позицію не знайдено.");
  }

  if (item._count.stockMovements > 0) {
    return validationError(
      "Неможливо видалити: за цією позицією є рухи складу.",
    );
  }

  if (item._count.recipeIngredients > 0) {
    return validationError(
      "Неможливо видалити: позиція використовується в технологічних картах.",
    );
  }

  try {
    await prisma.inventoryItem.delete({
      where: { id: parsed.data.id },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return validationError("Позицію не знайдено.");
    }
    if (isForeignKeyError(error)) {
      return validationError(
        "Неможливо видалити: позиція використовується в рухах складу або технологічних картах.",
      );
    }
    throw error;
  }

  revalidatePath("/admin/inventory");
  return { ok: true };
}

export async function createStockMovement(
  _prevState: StockMovementActionResult | null,
  formData: FormData,
): Promise<StockMovementActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const type = formData.get("type");
  const adjustmentDirectionRaw = formData.get("adjustmentDirection");

  const parsed = stockMovementCreateSchema.safeParse({
    inventoryItemId: formData.get("inventoryItemId"),
    type,
    quantity: formData.get("quantity") ?? "",
    adjustmentDirection:
      type === "ADJUSTMENT"
        ? adjustmentDirectionRaw === "INCREASE" ||
          adjustmentDirectionRaw === "DECREASE"
          ? adjustmentDirectionRaw
          : null
        : null,
    note: formData.get("note") ?? "",
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const locked = await lockInventoryItemForUpdate(
        tx,
        parsed.data.inventoryItemId,
      );

      if (!locked) {
        throw Object.assign(new Error("ITEM_NOT_FOUND"), { code: "ITEM_NOT_FOUND" });
      }

      await tx.stockMovement.create({
        data: {
          inventoryItemId: parsed.data.inventoryItemId,
          type: parsed.data.type,
          // Normalized decimal string — no JS Number for persistence.
          quantityDelta: parsed.data.quantityDelta,
          note: parsed.data.note,
          createdById: authCheck.userId,
        },
      });
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "ITEM_NOT_FOUND"
    ) {
      return validationError("Позицію не знайдено.");
    }
    if (isForeignKeyError(error)) {
      return validationError("Позицію не знайдено.");
    }
    throw error;
  }

  revalidatePath("/admin/inventory");
  return { ok: true };
}

export async function createInventoryCount(
  _prevState: InventoryCountActionResult | null,
  formData: FormData,
): Promise<InventoryCountActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = inventoryCountCreateSchema.safeParse({
    inventoryItemId: formData.get("inventoryItemId"),
    actualQuantity: formData.get("actualQuantity") ?? "",
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const locked = await lockInventoryItemForUpdate(
        tx,
        parsed.data.inventoryItemId,
      );

      if (!locked) {
        throw Object.assign(new Error("ITEM_NOT_FOUND"), { code: "ITEM_NOT_FOUND" });
      }

      const item = await tx.inventoryItem.findUnique({
        where: { id: parsed.data.inventoryItemId },
        select: { id: true, unit: true },
      });

      if (!item) {
        throw Object.assign(new Error("ITEM_NOT_FOUND"), { code: "ITEM_NOT_FOUND" });
      }

      const aggregate = await tx.stockMovement.aggregate({
        where: { inventoryItemId: item.id },
        _sum: { quantityDelta: true },
      });

      const currentBalance = formatQuantityDelta(
        aggregate._sum.quantityDelta ?? "0",
      );
      const delta = subtractDecimalStrings(
        parsed.data.actualQuantity,
        currentBalance,
      );

      if (isZeroDecimalString(delta)) {
        return { created: false as const };
      }

      const note = buildInventoryCountNote(
        parsed.data.actualQuantity,
        currentBalance,
        item.unit,
      );

      await tx.stockMovement.create({
        data: {
          inventoryItemId: item.id,
          type: StockMovementType.ADJUSTMENT,
          quantityDelta: delta,
          note,
          createdById: authCheck.userId,
        },
      });

      return { created: true as const };
    });

    revalidatePath("/admin/inventory");

    if (!result.created) {
      return {
        ok: true,
        message: "Розбіжностей немає. Рух не створено.",
      };
    }

    return { ok: true };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "ITEM_NOT_FOUND"
    ) {
      return validationError("Позицію не знайдено.");
    }
    if (isForeignKeyError(error)) {
      return validationError("Позицію не знайдено.");
    }
    throw error;
  }
}
