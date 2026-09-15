import { CategoryCreateForm } from "@/components/admin/menu/category-create-form";
import { CategoryRowActions } from "@/components/admin/menu/category-row-actions";
import {
  ProductList,
  type CategoryOption,
  type ProductListItem,
} from "@/components/admin/menu/product-list";

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  products: ProductListItem[];
};

type CategoryListProps = {
  categories: CategoryListItem[];
  canWrite: boolean;
};

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive
          ? "bg-[#e4e7df] text-[#2f4741]"
          : "bg-[#efe3d3] text-[#8a7262]"
      }`}
    >
      {isActive ? "Активна" : "Прихована"}
    </span>
  );
}

function toCategoryOptions(categories: CategoryListItem[]): CategoryOption[] {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
}

function CategoryReadOnlyRow({
  category,
  categoryOptions,
}: {
  category: CategoryListItem;
  categoryOptions: CategoryOption[];
}) {
  return (
    <article className="rounded-2xl border border-[#e4d5c5] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[#3c2a21]">{category.name}</h3>
          <p className="mt-1 text-sm text-[#8a7262]">/{category.slug}</p>
        </div>
        <StatusBadge isActive={category.isActive} />
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-[#5c4638] sm:grid-cols-3">
        <div>
          <dt className="font-medium text-[#3c2a21]">Порядок</dt>
          <dd>{category.sortOrder}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#3c2a21]">Товарів</dt>
          <dd>{category.productCount}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#3c2a21]">Slug</dt>
          <dd className="break-all">{category.slug}</dd>
        </div>
      </dl>

      <ProductList
        canWrite={false}
        categories={categoryOptions}
        categoryId={category.id}
        products={category.products}
      />
    </article>
  );
}

export function CategoryList({ categories, canWrite }: CategoryListProps) {
  const categoryOptions = toCategoryOptions(categories);

  return (
    <div className="space-y-6">
      {canWrite ? <CategoryCreateForm /> : null}

      {categories.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#d9c7b5] bg-[#fbf6f0] p-8 text-center">
          <h2 className="text-lg font-semibold text-[#3c2a21]">Категорій ще немає</h2>
          <p className="mt-2 text-sm text-[#5c4638]">
            {canWrite
              ? "Додайте першу категорію меню — наприклад, кава, чай або десерти."
              : "Категорії меню ще не створені. Зверніться до адміністратора."}
          </p>
        </section>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id}>
              {canWrite ? (
                <CategoryRowActions
                  category={category}
                  categoryOptions={categoryOptions}
                />
              ) : (
                <CategoryReadOnlyRow
                  category={category}
                  categoryOptions={categoryOptions}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
