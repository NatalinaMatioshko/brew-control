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
  requireAdminWriter,
  validationError,
  type MenuActionResult,
} from "@/lib/menu/action-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type InventoryCategoryActionResult = MenuActionResult;

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
