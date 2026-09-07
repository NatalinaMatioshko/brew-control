import { plural } from "@/lib/opening-calculator/format";
import styles from "./opening-calculator.module.css";

type HeroProps = {
  days: number;
};

export function Hero({ days }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div>
        <h1>Розхідники на 2 тижні</h1>
        <p className={styles.subtitle}>
          Вкажіть порції на день — калькулятор збере стакани, кришки, молоко й
          дрібницю. Кава в зернах рахується окремо в кінці.
        </p>
      </div>
      <div className={styles.badge}>
        Період: {days} {plural(days, "день", "дні", "днів")}
      </div>
    </section>
  );
}
