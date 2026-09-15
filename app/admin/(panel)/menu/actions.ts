"use server";

import {
  categoryCreateSchema,
  categoryDeleteSchema,
  categoryUpdateSchema,
  isCategoryInUseError,
  isUniqueSlugError,
  parseCategoryIsActive,
  slugifyCategoryName,
} from "@/lib/menu/category-schema";
import {
  requireAdminWriter,
  validationError,
  type MenuActionResult,
} from "@/lib/menu/action-auth";
import {
  isForeignKeyError,
  isRecordNotFoundError,
  parseProductCheckbox,
  productCreateSchema,
  productDeleteSchema,
  productUpdateSchema,
} from "@/lib/menu/product-schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CategoryActionResult = MenuActionResult;
export type ProductActionResult = MenuActionResult;

async function ensureCategoryExists(
  categoryId: string,
): Promise<MenuActionResult | null> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return validationError("Категорію не знайдено.");
  }

  return null;
}

export async function createCategory(
  _prevState: CategoryActionResult | null,
  formData: FormData,
): Promise<CategoryActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = categoryCreateSchema.safeParse({
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") ?? "0",
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const slug = slugifyCategoryName(parsed.data.name);
  if (!slug) {
    return validationError("Не вдалося згенерувати slug з назви.");
  }

  try {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug,
        sortOrder: parsed.data.sortOrder,
        isActive: true,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return validationError("Категорія з таким slug уже існує.");
    }
    throw error;
  }

  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function updateCategory(
  _prevState: CategoryActionResult | null,
  formData: FormData,
): Promise<CategoryActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = categoryUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    isActive: parseCategoryIsActive(formData.get("isActive")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.category.update({
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
      return validationError("Категорія з таким slug уже існує.");
    }
    throw error;
  }

  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function deleteCategory(
  _prevState: CategoryActionResult | null,
  formData: FormData,
): Promise<CategoryActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = categoryDeleteSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      _count: { select: { products: true } },
    },
  });

  if (!category) {
    return validationError("Категорію не знайдено.");
  }

  if (category._count.products > 0) {
    return validationError("Неможливо видалити: у категорії є товари.");
  }

  try {
    await prisma.category.delete({
      where: { id: parsed.data.id },
    });
  } catch (error) {
    if (isCategoryInUseError(error)) {
      return validationError("Неможливо видалити: у категорії є товари.");
    }
    throw error;
  }

  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function createProduct(
  _prevState: ProductActionResult | null,
  formData: FormData,
): Promise<ProductActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = productCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    priceInKopecks: formData.get("price") ?? "",
    categoryId: formData.get("categoryId"),
    sortOrder: formData.get("sortOrder") ?? "0",
    isActive: parseProductCheckbox(formData.get("isActive")),
    isAvailable: parseProductCheckbox(formData.get("isAvailable")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const categoryError = await ensureCategoryExists(parsed.data.categoryId);
  if (categoryError) {
    return categoryError;
  }

  try {
    await prisma.product.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        priceInKopecks: parsed.data.priceInKopecks,
        categoryId: parsed.data.categoryId,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
        isAvailable: parsed.data.isAvailable,
      },
    });
  } catch (error) {
    if (isForeignKeyError(error)) {
      return validationError("Категорію не знайдено.");
    }
    throw error;
  }

  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function updateProduct(
  _prevState: ProductActionResult | null,
  formData: FormData,
): Promise<ProductActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = productUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    priceInKopecks: formData.get("price") ?? "",
    categoryId: formData.get("categoryId"),
    sortOrder: formData.get("sortOrder"),
    isActive: parseProductCheckbox(formData.get("isActive")),
    isAvailable: parseProductCheckbox(formData.get("isAvailable")),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  const categoryError = await ensureCategoryExists(parsed.data.categoryId);
  if (categoryError) {
    return categoryError;
  }

  try {
    await prisma.product.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        priceInKopecks: parsed.data.priceInKopecks,
        categoryId: parsed.data.categoryId,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
        isAvailable: parsed.data.isAvailable,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return validationError("Товар не знайдено.");
    }
    if (isForeignKeyError(error)) {
      return validationError("Категорію не знайдено.");
    }
    throw error;
  }

  revalidatePath("/admin/menu");
  return { ok: true };
}

export async function deleteProduct(
  _prevState: ProductActionResult | null,
  formData: FormData,
): Promise<ProductActionResult> {
  const authCheck = await requireAdminWriter();
  if (!authCheck.ok) {
    return authCheck;
  }

  const parsed = productDeleteSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Невірні дані.");
  }

  try {
    await prisma.product.delete({
      where: { id: parsed.data.id },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return validationError("Товар не знайдено.");
    }
    throw error;
  }

  revalidatePath("/admin/menu");
  return { ok: true };
}
