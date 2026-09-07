import type { ComputeResult } from "@/lib/opening-calculator/calc";
import type { CupSize, MenuRow } from "@/lib/opening-calculator/constants";
import { formatNumber, recipeLine } from "@/lib/opening-calculator/format";
import { Icon } from "./icon";
import styles from "./opening-calculator.module.css";

type MenuPanelProps = {
  rows: MenuRow[];
  cupsPerDay: number;
  data: ComputeResult;
  onDailyChange: (id: string, value: string) => void;
};

function MenuItemRow({
  item,
  onDailyChange,
}: {
  item: MenuRow;
  onDailyChange: (id: string, value: string) => void;
}) {
  return (
    <div className={styles.menuItem}>
      <h3>
        <Icon name={item.icon} size={16} className={styles.icon} />
        {item.name}
      </h3>
      <p className={styles.recipe}>{recipeLine(item)}</p>
      <div className={styles.menuRow}>
        <div>
          <label htmlFor={`daily_${item.id}`}>Порцій на день</label>
          <input
            id={`daily_${item.id}`}
            type="number"
            min="0"
            value={item.daily}
            onChange={(event) => onDailyChange(item.id, event.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`total_${item.id}`}>За період</label>
          <input
            id={`total_${item.id}`}
            type="text"
            readOnly
            value={formatNumber(item.total)}
          />
        </div>
      </div>
    </div>
  );
}

export function MenuPanel({ rows, cupsPerDay, data, onDailyChange }: MenuPanelProps) {
  const delta = data.totalDaily - cupsPerDay;
  const groups: { size: CupSize; items: MenuRow[] }[] = [];

  rows.forEach((item) => {
    const last = groups[groups.length - 1];
    if (!last || last.size !== item.cupSize) {
      groups.push({ size: item.cupSize, items: [item] });
    } else {
      last.items.push(item);
    }
  });

  return (
    <article className={`${styles.card} ${styles.menuCard}`}>
      <h2>Меню напоїв</h2>
      <p className={styles.intro}>
        Порції на день множаться на період. Напої згруповані за розміром стакана.
      </p>
      <div className={styles.menuGroups}>
        {groups.map((group) => (
          <section className={styles.group} key={group.size}>
            <h3>Стакан {group.size} мл</h3>
            <div className={styles.menuGrid}>
              {group.items.map((item) => (
                <MenuItemRow key={item.id} item={item} onDailyChange={onDailyChange} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className={`${styles.summary}${delta !== 0 ? ` ${styles.mismatch}` : ""}`}>
        <strong>Сума порцій на день:</strong> {formatNumber(data.totalDaily)}
        {" "}(орієнтир «Напоїв на день»: {formatNumber(cupsPerDay)}
        {delta === 0 ? ", збігається" : `, різниця ${delta > 0 ? "+" : ""}${formatNumber(delta)}`})
        <br />
        <strong>За період:</strong> {formatNumber(data.totalPeriod)} напоїв,
        {" "}із них takeaway ≈ {formatNumber(Math.round(data.totalPeriod * data.takeaway))}.
      </div>
    </article>
  );
}
