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
import { getAdminAccess } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CategoryActionResult =
  | { ok: true }
  | { ok: false; error: string };

const FORBIDDEN_ERROR = "Недостатньо прав.";

async function requireAdminWriter(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const access = await getAdminAccess();

  if (access.status !== "authorized") {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  if (access.session.user.role !== "ADMIN") {
    return { ok: false, error: FORBIDDEN_ERROR };
  }

  return { ok: true };
}

function validationError(message: string): CategoryActionResult {
  return { ok: false, error: message };
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
