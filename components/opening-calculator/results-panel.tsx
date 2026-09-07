import {
  buildCoffeeItem,
  buildExtraItems,
  buildResultGroups,
  buildWishlistItems,
  type ComputeResult,
  type ResultCard,
} from "@/lib/opening-calculator/calc";
import { CHAMPS_URL, PETROVKA_URL } from "@/lib/opening-calculator/supplies";
import { formatMoney } from "@/lib/opening-calculator/format";
import { Icon } from "./icon";
import styles from "./opening-calculator.module.css";

function ResultItem({ item }: { item: ResultCard }) {
  return (
    <article className={styles.item}>
      <div className={styles.itemTop}>
        <h4>{item.title}</h4>
        <Icon name={item.icon} className={`${styles.icon} ${styles.itemIcon}`} />
      </div>
      <p className={styles.amount}>{item.amount}</p>
      {item.price ? <p className={styles.itemPrice}>{item.price}</p> : null}
      <p className={styles.detail}>
        {item.detail.map((line, index) => (
          <span key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </p>
    </article>
  );
}

export function ResultsPanel({ data }: { data: ComputeResult }) {
  const groups = buildResultGroups(data);

  return (
    <article className={`${styles.card} ${styles.resultsCard}`}>
      <h2>Що закупити</h2>
      <p className={styles.intro}>
        Закупівля округлена вгору до фасовки, як продають Petrovka і 3 Champs. Кава
        в зернах — окремо в кінці.
      </p>
      <div>
        {groups.map((group) => (
          <section className={styles.group} key={group.title}>
            <h3>{group.title}</h3>
            <div className={styles.items}>
              {group.items.map((item) => (
                <ResultItem key={item.title} item={item} />
              ))}
            </div>
            {group.total ? (
              <div className={styles.priceTotal}>
                <div>
                  <strong>{group.total.label}</strong>
                  <p>{group.total.hint}</p>
                  <a href={group.total.href} target="_blank" rel="noreferrer">
                    {group.total.linkLabel}
                  </a>
                </div>
                <p className={styles.amount}>{group.total.amount}</p>
              </div>
            ) : null}
          </section>
        ))}
        {data.grandTotal > 0 ? (
          <div className={styles.priceTotal}>
            <div>
              <strong>Разом за всі розхідники</strong>
              <p>Стакани, кришки, матча, чай, молоко та дрібниця. Без кави в зернах</p>
            </div>
            <p className={styles.amount}>{formatMoney(data.grandTotal)}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ExtraExpensesPanel({ data }: { data: ComputeResult }) {
  const items = buildExtraItems(data);

  if (!items.length) return null;

  return (
    <article className={`${styles.card} ${styles.extraCard}`}>
      <h2>Додаткові розходи</h2>
      <p className={styles.intro}>
        Гігієна, клінінг і пакування їжі. Округлення до фасовки Petrovka, окремо
        від напоїв вище.
      </p>
      <section className={styles.group}>
        <div className={styles.items}>
          {items.map((item) => (
            <ResultItem key={item.title} item={item} />
          ))}
        </div>
        {data.extraCost > 0 ? (
          <div className={`${styles.priceTotal} ${styles.extraTotal}`}>
            <div>
              <strong>Сума додаткових розходів</strong>
              <p>
                Ганчірки, рукавички, хімія, вологі серветки, паперові рушники,
                пакування, мило і папір
              </p>
              <a href={PETROVKA_URL} target="_blank" rel="noreferrer">
                Каталог Petrovka HoReCa
              </a>
            </div>
            <p className={styles.amount}>{formatMoney(data.extraCost)}</p>
          </div>
        ) : null}
      </section>
    </article>
  );
}

export function CoffeePanel({ data }: { data: ComputeResult }) {
  const item = buildCoffeeItem(data);

  if (!item) return null;

  return (
    <article className={`${styles.card} ${styles.extraCard} ${styles.coffeeCard}`}>
      <h2>Кава в зернах</h2>
      <p className={styles.intro}>
        Окремо від розхідників. Пакети по 1 кг, мінімум 2 кг, як продає 3 Champs.
      </p>
      <section className={styles.group}>
        <div className={`${styles.items} ${styles.coffeeItems}`}>
          <ResultItem item={item} />
        </div>
        {data.coffeeCost > 0 ? (
          <div className={`${styles.priceTotal} ${styles.coffeeTotal}`}>
            <div>
              <strong>Сума за каву в зернах</strong>
              <p>{item.detail[0]}</p>
              <a href={CHAMPS_URL} target="_blank" rel="noreferrer">
                Відкрити 3champsroastery.com.ua
              </a>
            </div>
            <p className={styles.amount}>{formatMoney(data.coffeeCost)}</p>
          </div>
        ) : null}
        {data.combinedTotal > 0 ? (
          <div className={`${styles.priceTotal} ${styles.combinedTotal}`}>
            <div>
              <strong>Разом усе</strong>
              <p>Розхідники, додаткові розходи і кава в зернах на період</p>
            </div>
            <p className={styles.amount}>{formatMoney(data.combinedTotal)}</p>
          </div>
        ) : null}
      </section>
    </article>
  );
}

export function WishlistPanel({ data }: { data: ComputeResult }) {
  const items = buildWishlistItems(data);

  if (!items.length) return null;

  return (
    <article className={`${styles.card} ${styles.extraCard} ${styles.wishlistCard}`}>
      <h2>Wish list</h2>
      <p className={styles.intro}>
        На майбутнє, не входить у суми вище. Ціна й кількість є, у розрахунок
        закупівлі не додаються.
      </p>
      <section className={styles.group}>
        <div className={styles.items}>
          {items.map((item) => (
            <ResultItem key={item.title} item={item} />
          ))}
        </div>
        {data.wishlistCost > 0 ? (
          <div className={`${styles.priceTotal} ${styles.wishlistTotal}`}>
            <div>
              <strong>Орієнтир wish list — не в сумі</strong>
              <p>
                Пакети для сміття, набір і сито для матчі, холдер і додаткові чаї
                3 Champs
              </p>
              <a href={PETROVKA_URL} target="_blank" rel="noreferrer">
                Каталог Petrovka HoReCa
              </a>
            </div>
            <p className={styles.amount}>{formatMoney(data.wishlistCost)}</p>
          </div>
        ) : null}
      </section>
    </article>
  );
}
