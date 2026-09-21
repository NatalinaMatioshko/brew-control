import {
  formatMovementType,
  formatSignedQuantityDelta,
} from "@/lib/inventory/movement-schema";
import { formatInventoryUnit } from "@/lib/inventory/item-schema";

export type MovementHistoryItem = {
  id: string;
  type: string;
  quantityDelta: string;
  note: string | null;
  createdAt: string;
  createdByLabel: string;
};

type MovementHistoryProps = {
  movements: MovementHistoryItem[];
  unit: string;
};

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function MovementHistory({ movements, unit }: MovementHistoryProps) {
  const unitLabel = formatInventoryUnit(unit);

  return (
    <details className="rounded-xl border border-[#efe3d3] bg-white">
      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-[#5c4638]">
        Історія рухів ({movements.length})
      </summary>

      {movements.length === 0 ? (
        <p className="border-t border-[#efe3d3] px-3 py-3 text-sm text-[#8a7262]">
          Рухів ще немає.
        </p>
      ) : (
        <ul className="divide-y divide-[#efe3d3] border-t border-[#efe3d3]">
          {movements.map((movement) => (
            <li key={movement.id} className="px-3 py-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-[#3c2a21]">
                  {formatMovementType(movement.type)}
                </p>
                <p
                  className={`font-semibold tabular-nums ${
                    movement.quantityDelta.startsWith("-")
                      ? "text-red-800"
                      : "text-[#2f4741]"
                  }`}
                >
                  {formatSignedQuantityDelta(movement.quantityDelta)} {unitLabel}
                </p>
              </div>
              <p className="mt-1 text-xs text-[#8a7262]">
                {formatDateTime(movement.createdAt)} · {movement.createdByLabel}
              </p>
              {movement.note ? (
                <p className="mt-1 text-[#5c4638]">{movement.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
