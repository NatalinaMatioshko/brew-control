import { RESERVE_OPTIONS, TAKEAWAY_OPTIONS } from "@/lib/opening-calculator/constants";
import styles from "./opening-calculator.module.css";

type ControlsProps = {
  days: number;
  reserve: number;
  takeaway: number;
  cupsPerDay: number;
  onDaysChange: (value: string) => void;
  onReserveChange: (value: string) => void;
  onTakeawayChange: (value: string) => void;
  onCupsPerDayChange: (value: string) => void;
};

export function Controls({
  days,
  reserve,
  takeaway,
  cupsPerDay,
  onDaysChange,
  onReserveChange,
  onTakeawayChange,
  onCupsPerDayChange,
}: ControlsProps) {
  return (
    <section className={styles.controlPanel} aria-label="Параметри розрахунку">
      <div>
        <label htmlFor="days">Кількість днів</label>
        <input
          id="days"
          type="number"
          min="1"
          value={days}
          onChange={(event) => onDaysChange(event.target.value)}
        />
        <p className={styles.hint}>Стартова закупівля, зазвичай 14</p>
      </div>
      <div>
        <label htmlFor="reserve">Запас на брак</label>
        <select
          id="reserve"
          value={reserve}
          onChange={(event) => onReserveChange(event.target.value)}
        >
          {RESERVE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className={styles.hint}>Помилки, дегустації, піки</p>
      </div>
      <div>
        <label htmlFor="takeaway">Із собою</label>
        <select
          id="takeaway"
          value={takeaway}
          onChange={(event) => onTakeawayChange(event.target.value)}
        >
          {TAKEAWAY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className={styles.hint}>Лише takeaway потребує стаканів</p>
      </div>
      <div>
        <label htmlFor="cupsPerDay">Напоїв на день</label>
        <input
          id="cupsPerDay"
          type="number"
          min="1"
          value={cupsPerDay}
          onChange={(event) => onCupsPerDayChange(event.target.value)}
        />
        <p className={styles.hint}>Орієнтир для перевірки меню</p>
      </div>
    </section>
  );
}
