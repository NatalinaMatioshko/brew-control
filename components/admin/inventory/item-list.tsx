"use client";

import { InventoryItemCreateForm } from "@/components/admin/inventory/item-create-form";
import { InventoryItemRowActions } from "@/components/admin/inventory/item-row-actions";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";

export type InventoryItemListItem = {
  id: string;
  name: string;
  unit: string;
  minimumQuantity: number;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
};

type InventoryItemListProps = {
  items: InventoryItemListItem[];
  categoryId: string;
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

function InventoryItemReadOnlyRow({ item }: { item: InventoryItemListItem }) {
  return (
    <article className="rounded-xl border border-[#efe3d3] bg-[#fffdfb] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h5 className="font-semibold text-[#3c2a21]">{item.name}</h5>
          <p className="mt-1 text-sm text-[#5c4638]">
            {formatInventoryUnit(item.unit)} · мін. {item.minimumQuantity}
          </p>
        </div>
        <StatusBadge isActive={item.isActive} />
      </div>
    </article>
  );
}

export function InventoryItemList({
  items,
  categoryId,
  canWrite,
}: InventoryItemListProps) {
  return (
    <details className="mt-4 border-t border-[#efe3d3] pt-4" open={items.length > 0}>
      <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-wide text-[#8a7262]">
        Позиції ({items.length})
      </summary>

      <div className="mt-3 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#e4d5c5] bg-[#fbf6f0] px-3 py-4 text-sm text-[#5c4638]">
            У цій категорії ще немає позицій складу.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                {canWrite ? (
                  <InventoryItemRowActions item={item} />
                ) : (
                  <InventoryItemReadOnlyRow item={item} />
                )}
              </li>
            ))}
          </ul>
        )}

        {canWrite ? <InventoryItemCreateForm categoryId={categoryId} /> : null}
      </div>
    </details>
  );
}
