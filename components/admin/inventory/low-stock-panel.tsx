import type { LowStockItemView } from "@/lib/inventory/low-stock";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";
import { formatQuantityDelta } from "@/lib/inventory/movement-schema";

type LowStockPanelProps = {
  items: LowStockItemView[];
};

export function LowStockPanel({ items }: LowStockPanelProps) {
  return (
    <section className="rounded-2xl border border-[#e4d5c5] bg-[#fffaf3] p-5">
      <h2 className="text-lg font-semibold text-[#3c2a21]">Потрібно поповнити</h2>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[#5c4638]">
          Усі активні позиції мають достатній залишок.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const unitLabel = formatInventoryUnit(item.unit);
            return (
              <li
                key={`${item.categoryName}:${item.itemName}`}
                className="rounded-xl border border-[#efe3d3] bg-white px-4 py-3"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[#8a7262]">
                  {item.categoryName}
                </p>
                <p className="mt-1 font-semibold text-[#3c2a21]">{item.itemName}</p>
                <dl className="mt-3 grid gap-2 text-sm text-[#5c4638] sm:grid-cols-3">
                  <div>
                    <dt className="font-medium text-[#3c2a21]">Залишок</dt>
                    <dd
                      className={`tabular-nums ${
                        item.isNegativeBalance ? "font-semibold text-red-800" : ""
                      }`}
                    >
                      {formatQuantityDelta(item.balance)} {unitLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[#3c2a21]">Мінімум</dt>
                    <dd className="tabular-nums">
                      {formatQuantityDelta(item.minimumQuantity)} {unitLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[#3c2a21]">Бракує</dt>
                    <dd className="font-semibold tabular-nums text-[#8a3b12]">
                      {formatQuantityDelta(item.shortage)} {unitLabel}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
