import { InventoryCategoryCreateForm } from "@/components/admin/inventory/category-create-form";
import { InventoryCategoryRowActions } from "@/components/admin/inventory/category-row-actions";
import {
  InventoryItemList,
  type InventoryItemListItem,
} from "@/components/admin/inventory/item-list";

export type InventoryCategoryListItem = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  itemCount: number;
  items: InventoryItemListItem[];
};

type InventoryCategoryListProps = {
  categories: InventoryCategoryListItem[];
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

function InventoryCategoryReadOnlyRow({
  category,
}: {
  category: InventoryCategoryListItem;
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
          <dt className="font-medium text-[#3c2a21]">Позицій</dt>
          <dd>{category.itemCount}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#3c2a21]">Slug</dt>
          <dd className="break-all">{category.slug}</dd>
        </div>
      </dl>

      <InventoryItemList
        canWrite={false}
        categoryId={category.id}
        items={category.items}
      />
    </article>
  );
}

export function InventoryCategoryList({
  categories,
  canWrite,
}: InventoryCategoryListProps) {
  return (
    <div className="space-y-6">
      {canWrite ? <InventoryCategoryCreateForm /> : null}

      {categories.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#d9c7b5] bg-[#fbf6f0] p-8 text-center">
          <h2 className="text-lg font-semibold text-[#3c2a21]">
            Категорій складу ще немає
          </h2>
          <p className="mt-2 text-sm text-[#5c4638]">
            {canWrite
              ? "Додайте першу категорію — наприклад, зерно, молоко, сиропи або стакани."
              : "Категорії складу ще не створені. Зверніться до адміністратора."}
          </p>
        </section>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id}>
              {canWrite ? (
                <InventoryCategoryRowActions category={category} />
              ) : (
                <InventoryCategoryReadOnlyRow category={category} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
