import { ProductCreateForm } from "@/components/admin/menu/product-create-form";
import { ProductRowActions } from "@/components/admin/menu/product-row-actions";
import { formatPriceUah } from "@/lib/menu/money";

export type ProductListItem = {
  id: string;
  name: string;
  description: string | null;
  priceInKopecks: number;
  isActive: boolean;
  isAvailable: boolean;
  sortOrder: number;
  categoryId: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};

type ProductListProps = {
  products: ProductListItem[];
  categories: CategoryOption[];
  categoryId: string;
  canWrite: boolean;
};

function ProductStatusBadges({
  isActive,
  isAvailable,
}: {
  isActive: boolean;
  isAvailable: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          isActive
            ? "bg-[#e4e7df] text-[#2f4741]"
            : "bg-[#efe3d3] text-[#8a7262]"
        }`}
      >
        {isActive ? "Активний" : "Прихований"}
      </span>
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          isAvailable
            ? "bg-[#e4e7df] text-[#2f4741]"
            : "bg-[#efe3d3] text-[#8a7262]"
        }`}
      >
        {isAvailable ? "Доступний" : "Немає в наявності"}
      </span>
    </div>
  );
}

function ProductReadOnlyRow({ product }: { product: ProductListItem }) {
  return (
    <article className="rounded-xl border border-[#efe3d3] bg-[#fffdfb] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h5 className="font-semibold text-[#3c2a21]">{product.name}</h5>
          {product.description ? (
            <p className="mt-1 text-sm text-[#5c4638]">{product.description}</p>
          ) : null}
          <p className="mt-2 text-sm font-medium text-[#3c2a21]">
            {formatPriceUah(product.priceInKopecks)}
          </p>
        </div>
        <ProductStatusBadges
          isActive={product.isActive}
          isAvailable={product.isAvailable}
        />
      </div>
      <p className="mt-2 text-xs text-[#8a7262]">Порядок: {product.sortOrder}</p>
    </article>
  );
}

export function ProductList({
  products,
  categories,
  categoryId,
  canWrite,
}: ProductListProps) {
  return (
    <div className="mt-4 space-y-3 border-t border-[#efe3d3] pt-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-[#8a7262]">
        Товари
      </h4>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#e4d5c5] bg-[#fbf6f0] px-3 py-4 text-sm text-[#5c4638]">
          У цій категорії ще немає товарів
        </p>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id}>
              {canWrite ? (
                <ProductRowActions product={product} categories={categories} />
              ) : (
                <ProductReadOnlyRow product={product} />
              )}
            </li>
          ))}
        </ul>
      )}

      {canWrite ? <ProductCreateForm categoryId={categoryId} /> : null}
    </div>
  );
}
