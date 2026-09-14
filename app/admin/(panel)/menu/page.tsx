import { CategoryList } from "@/components/admin/menu/category-list";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Меню · Brew Control",
};

export default async function AdminMenuPage() {
  const session = await auth();
  const canWrite = session?.user?.role === "ADMIN";

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      sortOrder: true,
      isActive: true,
      _count: { select: { products: true } },
    },
  });

  return (
    <main className="px-4 py-8 sm:px-6">
      <p className="text-sm font-medium text-[#8a7262]">Меню</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#3c2a21]">
        Категорії
      </h1>
      <p className="mt-3 max-w-2xl text-[#5c4638]">
        {canWrite
          ? "Керуйте категоріями меню для залу. Товари додамо на наступному етапі."
          : "Перегляд категорій меню. Редагування доступне лише адміністратору."}
      </p>

      <div className="mt-8">
        <CategoryList
          canWrite={canWrite}
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            productCount: category._count.products,
          }))}
        />
      </div>
    </main>
  );
}
